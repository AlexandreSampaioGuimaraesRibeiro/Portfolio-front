import { useEffect, useState } from 'react'
import { Kbd } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import './Carrossel.css'

// slides: [{ id, titulo, conteudo }]
// Navegação: botões, bolinhas ou setas ← → do teclado
export default function Carrossel({ slides, rotulo = 'Painéis' }) {
  const [ativo, setAtivo] = useState(0)
  const total = slides.length
  const ir = (indice) => setAtivo(((indice % total) + total) % total)

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setAtivo((i) => (i + 1) % total)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setAtivo((i) => (i - 1 + total) % total)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [total])

  return (
    <section className="carrossel" aria-roledescription="carrossel" aria-label={rotulo}>
      <div className="carrossel-topo">
        <button type="button" className="jogo-botao vazado" onClick={() => ir(ativo - 1)} aria-label="Painel anterior">
          <IconChevronLeft size={18} aria-hidden="true" />
          <Kbd>←</Kbd>
        </button>

        <div className="carrossel-titulo" aria-live="polite">
          <strong>{slides[ativo].titulo}</strong>
        </div>

        <button type="button" className="jogo-botao vazado" onClick={() => ir(ativo + 1)} aria-label="Próximo painel">
          <Kbd>→</Kbd>
          <IconChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="carrossel-janela">
        <div className="carrossel-trilho" style={{ transform: `translateX(-${ativo * 100}%)` }}>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`carrossel-slide ${i === ativo ? 'ativo' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}: ${slide.titulo}`}
            >
              {slide.conteudo}
            </div>
          ))}
        </div>
      </div>

      <div className="carrossel-pontos" role="group" aria-label="Escolher painel">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={`carrossel-ponto ${i === ativo ? 'ativo' : ''}`}
            aria-label={`Ir para ${slide.titulo}`}
            aria-current={i === ativo}
            onClick={() => ir(i)}
          />
        ))}
      </div>
    </section>
  )
}