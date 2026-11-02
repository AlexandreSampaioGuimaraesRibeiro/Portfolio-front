import { useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconChevronLeft, IconChevronRight, IconPhoto } from '@tabler/icons-react'
import { useIdioma } from '../idioma/contexto'
import './PrintsProjeto.css'

// Cada print pode ser só o endereço da imagem ou { src, pt, en } (com a legenda em cada idioma)
const normalizar = (item) => (typeof item === 'string' ? { src: item } : item)
const MAX_MINIATURAS = 3

export default function PrintsProjeto({ nome, prints = [] }) {
  const { t, idioma } = useIdioma()
  const celular = useMediaQuery('(max-width: 640px)')
  const [aberto, setAberto] = useState(null) // posição do print ampliado, ou null
  const [quebradas, setQuebradas] = useState({}) // imagens que não carregaram (arquivo ausente)

  const validas = prints.map(normalizar).filter((p) => !quebradas[p.src])
  const total = validas.length
  const legenda = (p) => (idioma === 'en' ? (p.en ?? p.pt) : (p.pt ?? p.en))
  const textoAlt = (p) => legenda(p) ?? t('projetos.printAlt', { nome })
  const marcarQuebrada = (src) => setQuebradas((atual) => ({ ...atual, [src]: true }))

  // ← e → trocam de print com a imagem ampliada
  useEffect(() => {
    if (aberto === null || total === 0) return
    const aoTeclar = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setAberto((i) => (i + 1) % total)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setAberto((i) => (i - 1 + total) % total)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto, total])

  if (total === 0) {
    return (
      <div className="prints-vazio">
        <IconPhoto size={28} aria-hidden="true" />
        <span>{t('projetos.semPrints')}</span>
      </div>
    )
  }

  const atual = aberto !== null ? validas[Math.min(aberto, total - 1)] : null
  const miniaturas = validas.slice(0, MAX_MINIATURAS)
  const extras = total - MAX_MINIATURAS

  return (
    <>
      <div className={`prints n${miniaturas.length}`}>
        {miniaturas.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className="print"
            aria-label={t('projetos.ampliar', { n: i + 1, total, nome })}
            onClick={() => setAberto(i)}
          >
            <img src={p.src} alt={textoAlt(p)} loading="lazy" onError={() => marcarQuebrada(p.src)} />
            {i === MAX_MINIATURAS - 1 && extras > 0 && <span className="print-mais">+{extras}</span>}
          </button>
        ))}
      </div>

      <Modal
        opened={aberto !== null}
        onClose={() => setAberto(null)}
        title={nome}
        size="min(1100px, 96vw)"
        fullScreen={celular}
        centered
        padding={0}
        closeButtonProps={{ 'aria-label': t('projetos.fechar') }}
        classNames={{ content: 'prints-modal', header: 'prints-modal-topo', title: 'prints-modal-titulo', body: 'prints-modal-corpo', close: 'prints-modal-fechar' }}
      >
        {atual && (
          <div className="lb">
            <div className="lb-palco">
              {total > 1 && (
                <button type="button" className="lb-seta esquerda" aria-label={t('projetos.anterior')} onClick={() => setAberto((i) => (i - 1 + total) % total)}>
                  <IconChevronLeft size={26} aria-hidden="true" />
                </button>
              )}
              <img className="lb-imagem" src={atual.src} alt={textoAlt(atual)} />
              {total > 1 && (
                <button type="button" className="lb-seta direita" aria-label={t('projetos.proximo')} onClick={() => setAberto((i) => (i + 1) % total)}>
                  <IconChevronRight size={26} aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="lb-rodape" aria-live="polite">
              <span>{legenda(atual) ?? ''}</span>
              <span className="lb-contador">{Math.min(aberto, total - 1) + 1} / {total}</span>
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}