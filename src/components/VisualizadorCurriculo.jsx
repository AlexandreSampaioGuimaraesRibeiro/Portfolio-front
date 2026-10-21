import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { IconDownload, IconExternalLink, IconZoomIn, IconZoomOut } from '@tabler/icons-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { CURRICULOS } from '../config/curriculo'
import { useIdioma } from '../idioma/contexto'
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

export default function VisualizadorCurriculo() {
  const { idioma, t } = useIdioma()

  // Idioma escolhido aqui dentro. Se o idioma do site mudar (teclas P e I), o currículo acompanha.
  const [escolha, setEscolha] = useState(null)
  const lingua = escolha && escolha.doSite === idioma ? escolha.lingua : idioma
  const { arquivo, nome } = CURRICULOS[lingua]

  const [zoom, setZoom] = useState(1)
  const [paginas, setPaginas] = useState({}) // número de páginas de cada arquivo
  const [largura, setLargura] = useState(0)
  const corpo = useRef(null)

  // largura disponível para as páginas (acompanha o tamanho da janela)
  useEffect(() => {
    const observador = new ResizeObserver(([entrada]) => setLargura(entrada.contentRect.width))
    observador.observe(corpo.current)
    return () => observador.disconnect()
  }, [])

  const escolher = (nova) => {
    setEscolha({ lingua: nova, doSite: idioma })
    if (corpo.current) corpo.current.scrollTop = 0
  }
  const mudarZoom = (delta) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(z + delta).toFixed(2))))

  const larguraPagina = Math.max(Math.min(largura, LARGURA_MAX), 240) * zoom
  const totalPaginas = paginas[arquivo] ?? 0

  return (
    <div className="cv">
      <div className="cv-barra">
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
        {largura > 0 && (
          <Document
            key={arquivo}
            file={arquivo}
            loading={<p className="cv-status" role="status">{t('curriculo.carregando')}</p>}
            error={
              <p className="cv-status erro" role="alert">
                {t('curriculo.erro')}{' '}
                <a href={arquivo} target="_blank" rel="noreferrer">{t('curriculo.novaAba')}</a>
              </p>
            }
            onLoadSuccess={({ numPages }) => setPaginas((atual) => ({ ...atual, [arquivo]: numPages }))}
          >
            {Array.from({ length: totalPaginas }, (_, i) => (
              <Page key={i + 1} pageNumber={i + 1} width={larguraPagina} className="cv-pagina" />
            ))}
          </Document>
        )}
      </div>
    </div>
  )
}