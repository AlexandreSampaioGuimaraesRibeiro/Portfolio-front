import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { IconDownload, IconExternalLink, IconZoomIn, IconZoomOut } from '@tabler/icons-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { CURRICULOS } from '../config/curriculo'
import { useIdioma } from '../idioma/contexto'
import CarregandoTema from './CarregandoTema'
import './VisualizadorCurriculo.css'

// O worker do pdf.js precisa ser configurado neste mesmo módulo, onde o <Document> é usado
// (recomendação do react-pdf).
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const PASSO = 0.25
const LARGURA_MAX = 820

const LINGUAS = [
  { id: 'pt', rotulo: 'PT', nome: 'Português' },
  { id: 'en', rotulo: 'EN', nome: 'English' },
]

// Por que a tela piscava antes:
//  O react-pdf 11 usa Suspense por padrão. Enquanto o PDF carregava, o <Document> "suspendia" e o
//  React trocava o visualizador INTEIRO (barra incluída) pelo fallback do <Suspense> do modal.
//  Escondido, o corpo ficava com largura 0, o ResizeObserver avisava, o <Document> era desmontado,
//  a barra voltava, o <Document> montava e suspendia de novo... um vai e volta até o PDF chegar.
//  Depois ainda vinha o "Loading page…" de cada página e o canvas em branco a cada zoom.
//
// Agora:
//  - suspense={false}: o carregamento fica por nossa conta, sem trocar a árvore de lugar.
//  - As páginas são desenhadas por baixo de uma cobertura com o carregamento do tema, e só
//    aparecem (com um fade) quando todas estão prontas.
//  - Largura 0 é ignorada e a barra de rolagem tem espaço reservado, então a largura não oscila.
//  - Ao mudar o zoom, a imagem anterior fica esticada por cima até o novo desenho terminar.
//  - Cada idioma aberto continua montado (escondido), então trocar PT/EN de novo é instantâneo.

function Pagina({ numero, largura, aoDesenhar }) {
  const canvas = useRef(null)
  const [foto, setFoto] = useState(null) // imagem do último desenho, para cobrir o redesenho
  const [larguraDesenhada, setLarguraDesenhada] = useState(null)

  useEffect(() => () => foto && URL.revokeObjectURL(foto), [foto])

  const desenhou = () => {
    setLarguraDesenhada(largura)
    aoDesenhar(numero)
    canvas.current?.toBlob((blob) => blob && setFoto(URL.createObjectURL(blob)), 'image/jpeg', 0.85)
  }

  const redesenhando = foto && larguraDesenhada !== largura

  return (
    <div className="cv-folha">
      <Page
        pageNumber={numero}
        width={largura}
        canvasRef={canvas}
        className="cv-pagina"
        loading={null}
        suspense={false}
        onRenderSuccess={desenhou}
        onRenderError={() => aoDesenhar(numero)}
      />
      {redesenhando && <img className="cv-foto" src={foto} alt="" aria-hidden="true" />}
    </div>
  )
}

export default function VisualizadorCurriculo() {
  const { idioma, t } = useIdioma()

  // Idioma escolhido aqui dentro. Se o idioma do site mudar (teclas P e I), o currículo acompanha.
  const [escolha, setEscolha] = useState(null)
  const lingua = escolha && escolha.doSite === idioma ? escolha.lingua : idioma
  const { arquivo, nome } = CURRICULOS[lingua]

  const [zoom, setZoom] = useState(1)
  const [largura, setLargura] = useState(0)
  // estado de cada arquivo: { total, desenhadas: [], erro, progresso }
  const [docs, setDocs] = useState({})
  const [abertos, setAbertos] = useState([arquivo]) // arquivos já abertos ficam montados
  if (!abertos.includes(arquivo)) setAbertos([...abertos, arquivo])

  const [jaMostrou, setJaMostrou] = useState(false) // depois da 1ª vez a barra fica livre
  const corpo = useRef(null)
  const barra = useRef(null)
  const [alturaBarra, setAlturaBarra] = useState(0)

  // largura disponível para as páginas (acompanha o tamanho da janela)
  useLayoutEffect(() => {
    const medir = (w) => {
      const nova = Math.floor(w)
      if (nova > 0) setLargura((atual) => (Math.abs(atual - nova) >= 2 ? nova : atual))
    }
    const el = corpo.current
    const estilo = getComputedStyle(el)
    medir(el.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight))
    const observador = new ResizeObserver(([entrada]) => medir(entrada.contentRect.width))
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = barra.current
    setAlturaBarra(el.offsetHeight)
    const observador = new ResizeObserver(() => setAlturaBarra(el.offsetHeight))
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  const atualizar = useCallback((arq, mudar) => {
    setDocs((atual) => {
      const antes = atual[arq] ?? { total: 0, desenhadas: [], erro: false, progresso: null }
      return { ...atual, [arq]: { ...antes, ...mudar(antes) } }
    })
  }, [])

  const escolher = (nova) => {
    setEscolha({ lingua: nova, doSite: idioma })
    if (corpo.current) corpo.current.scrollTop = 0
  }
  const mudarZoom = (delta) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(z + delta).toFixed(2))))

  const larguraPagina = Math.round(Math.max(Math.min(largura, LARGURA_MAX), 240) * zoom)

  const atual = docs[arquivo]
  const pronto = Boolean(atual && (atual.erro || (atual.total > 0 && atual.desenhadas.length >= atual.total)))

  // a cobertura some com um fade e só depois sai da tela (a animação para de rodar)
  const [coberturaMontada, setCoberturaMontada] = useState(true)
  if (!pronto && !coberturaMontada) setCoberturaMontada(true)
  useEffect(() => {
    if (!pronto) return
    const id = setTimeout(() => {
      setCoberturaMontada(false)
      setJaMostrou(true)
    }, 450)
    return () => clearTimeout(id)
  }, [pronto])

  return (
    <div className="cv" aria-busy={!pronto}>
      <div className="cv-barra" ref={barra}>
        <div className="cv-grupo" role="group" aria-label={t('curriculo.idioma')}>
          {LINGUAS.map(({ id, rotulo, nome: nomeLingua }) => (
            <button
              key={id}
              type="button"
              className={`cv-btn ${lingua === id ? 'ativo' : ''}`}
              aria-pressed={lingua === id}
              aria-label={nomeLingua}
              lang={id}
              onClick={() => escolher(id)}
            >
              {rotulo}
            </button>
          ))}
        </div>

        <div className="cv-grupo">
          <button type="button" className="cv-btn" aria-label={t('curriculo.menosZoom')} onClick={() => mudarZoom(-PASSO)} disabled={zoom <= ZOOM_MIN}>
            <IconZoomOut size={18} aria-hidden="true" />
          </button>
          <span className="cv-zoom" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" className="cv-btn" aria-label={t('curriculo.maisZoom')} onClick={() => mudarZoom(PASSO)} disabled={zoom >= ZOOM_MAX}>
            <IconZoomIn size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="cv-grupo">
          <a className="cv-btn" href={arquivo} download={nome}>
            <IconDownload size={18} aria-hidden="true" />
            <span className="cv-rotulo">{t('curriculo.baixar')}</span>
          </a>
          <a className="cv-btn" href={arquivo} target="_blank" rel="noreferrer" aria-label={t('curriculo.novaAba')}>
            <IconExternalLink size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="cv-corpo" ref={corpo}>
        {largura > 0 &&
          abertos.map((arq) => {
            const info = docs[arq]
            const total = info?.total ?? 0
            return (
              <div key={arq} className="cv-documento" hidden={arq !== arquivo}>
                <Document
                  file={arq}
                  suspense={false}
                  loading={null}
                  error={
                    <p className="cv-status erro" role="alert">
                      {t('curriculo.erro')}{' '}
                      <a href={arq} target="_blank" rel="noreferrer">{t('curriculo.novaAba')}</a>
                    </p>
                  }
                  onLoadProgress={({ loaded, total: bytes }) => bytes > 0 && atualizar(arq, () => ({ progresso: loaded / bytes }))}
                  onLoadSuccess={({ numPages }) => atualizar(arq, () => ({ total: numPages, progresso: 1 }))}
                  onLoadError={() => atualizar(arq, () => ({ erro: true }))}
                >
                  {Array.from({ length: total }, (_, i) => (
                    <Pagina
                      key={i + 1}
                      numero={i + 1}
                      largura={larguraPagina}
                      aoDesenhar={(n) =>
                        atualizar(arq, (antes) => (antes.desenhadas.includes(n) ? {} : { desenhadas: [...antes.desenhadas, n] }))
                      }
                    />
                  ))}
                </Document>
              </div>
            )
          })}
      </div>

      {/* Na primeira abertura cobre tudo (igual ao fallback do modal, então nada pula de lugar);
          depois cobre só a área das páginas e deixa a barra livre. */}
      <div
        className={`cv-cobertura ${pronto ? 'saindo' : ''}`}
        style={jaMostrou ? { top: alturaBarra } : undefined}
        aria-hidden={pronto}
      >
        {coberturaMontada && <CarregandoTema progresso={atual?.progresso ?? null} />}
      </div>
    </div>
  )
}
