import { useEffect, useMemo, useRef } from 'react'
import { HABILIDADES } from '../data/habilidadesGlobo'
import { useIdioma } from '../idioma/contexto'
import './GloboHabilidades.css'

const VELOCIDADE_AUTO = 0.004 // rotação automática (radianos por quadro)
const LIMITE_VERTICAL = 1.2

// Distribui os pontos de forma uniforme na superfície de uma esfera
function pontosNaEsfera(n) {
  const dourado = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2
    const raio = Math.sqrt(1 - y * y)
    return [Math.cos(dourado * i) * raio, y, Math.sin(dourado * i) * raio]
  })
}

const norm = ([x, y, z]) => {
  const m = Math.hypot(x, y, z)
  return [x / m, y / m, z / m]
}
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// Mesma rotação aplicada aos ícones: gira em Y e depois em X
const girar = ([x, y, z], cy, sy, cx, sx) => {
  const x1 = x * cy + z * sy
  const z1 = -x * sy + z * cy
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx]
}

// Estrelas da esfera: 4 estrelas em losango, repetidas nos 4 lados para sempre haver um grupo à vista.
// Cada vértice é um ponto na superfície da esfera, então elas giram e encolhem nas bordas de verdade.
const PADRAO = [[0, -0.5], [-0.5, 0], [0.5, 0], [0, 0.5]]
const ESTRELAS = [0, 1, 2, 3].flatMap((lado) =>
  PADRAO.map(([ox, oy]) => {
    const gama = (lado * Math.PI) / 2
    const b = [Math.sin(ox) * Math.cos(oy), Math.sin(oy), Math.cos(ox) * Math.cos(oy)]
    const centro = [b[0] * Math.cos(gama) + b[2] * Math.sin(gama), b[1], -b[0] * Math.sin(gama) + b[2] * Math.cos(gama)]
    const direita = norm(cruz(centro, [0, -1, 0]))
    const cima = cruz(direita, centro)
    const vertices = Array.from({ length: 10 }, (_, i) => {
      const ang = ((90 + i * 36) * Math.PI) / 180
      const rho = i % 2 ? 0.085 : 0.2
      const dx = Math.cos(ang) * rho
      const dy = Math.sin(ang) * rho
      return norm([
        centro[0] + direita[0] * dx + cima[0] * dy,
        centro[1] + direita[1] * dx + cima[1] * dy,
        centro[2] + direita[2] * dx + cima[2] * dy,
      ])
    })
    return { centro, vertices }
  }),
)

/* Centro do globo no tema NOTURNO: roda de carro, que gira junto com o globo */
function Roda() {
  const { t } = useIdioma()
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={t('globo.roda')}>
      <defs>
        <linearGradient id="roda-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1f4f9" />
          <stop offset="1" stopColor="#7d8696" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="#0c0d0f" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#2c2f35" strokeWidth="10" strokeDasharray="11 7" />
      <circle cx="100" cy="100" r="72" fill="#1a1c21" stroke="#2c2f35" strokeWidth="3" />
      <circle cx="100" cy="100" r="64" fill="#0f1013" stroke="var(--destaque)" strokeWidth="6" />
      {[0, 1, 2, 3, 4].map((k) => (
        <path
          key={k}
          d="M91 86 L84 40 Q100 31 116 40 L109 86 Z"
          fill="url(#roda-metal)"
          stroke="#0a0a0c"
          strokeWidth="2"
          transform={`rotate(${k * 72} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="19" fill="url(#roda-metal)" stroke="#0a0a0c" strokeWidth="3" />
      <circle cx="100" cy="100" r="8" fill="var(--secundaria)" />
    </svg>
  )
}

/* Centro do globo no tema CLARO: esfera laranja de quatro estrelas, que gira junto com o globo */
function Esfera({ refsEstrelas }) {
  const { t } = useIdioma()
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={t('globo.esfera')}>
      <defs>
        <radialGradient id="esfera-fundo" cx="32%" cy="28%" r="80%">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset=".55" stopColor="#ff8a00" />
          <stop offset="1" stopColor="#d46a00" />
        </radialGradient>
        <radialGradient id="esfera-sombra" cx="50%" cy="50%" r="50%">
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".3" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#esfera-fundo)" stroke="#14213d" strokeWidth="6" />
      {ESTRELAS.map((_, i) => (
        <polygon key={i} ref={(no) => { refsEstrelas.current[i] = no }} fill="#d62828" opacity="0" />
      ))}
      <circle cx="100" cy="100" r="92" fill="url(#esfera-sombra)" />
      <ellipse cx="66" cy="56" rx="22" ry="11" fill="#fff" opacity=".35" transform="rotate(-30 66 56)" />
    </svg>
  )
}

export default function GloboHabilidades() {
  const { t } = useIdioma()
  const palco = useRef(null)
  const itens = useRef([])
  const rodaRef = useRef(null)
  const escudoRef = useRef(null)
  const estrelasRef = useRef([])
  const pontos = useMemo(() => pontosNaEsfera(HABILIDADES.length), [])

  useEffect(() => {
    const el = palco.current
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const auto = reduzir ? 0 : VELOCIDADE_AUTO
    const e = { ay: 0, ax: -0.3, vy: auto, vx: 0, arrastando: false, pausado: false, moveu: false, visivel: true, x: 0, y: 0 }
    let raf

    function desenhar() {
      const raio = el.clientWidth * 0.5 * 0.84
      const [cy, sy, cx, sx] = [Math.cos(e.ay), Math.sin(e.ay), Math.cos(e.ax), Math.sin(e.ax)]
      pontos.forEach(([x, y, z], i) => {
        const item = itens.current[i]
        if (!item) return
        const x1 = x * cy + z * sy
        const z1 = -x * sy + z * cy
        const y2 = y * cx - z1 * sx
        const z2 = y * sx + z1 * cx
        const prof = (z2 + 1) / 2 // 0 = atrás, 1 = na frente
        item.style.transform = `translate(-50%, -50%) translate(${(x1 * raio).toFixed(1)}px, ${(y2 * raio).toFixed(1)}px) scale(${(0.55 + 0.6 * prof).toFixed(3)})`
        item.style.opacity = (0.3 + 0.7 * prof).toFixed(3)
        item.style.zIndex = String(Math.round(prof * 100))
      })

      // centro: a roda gira em torno do próprio eixo e a esfera vira junto com os ícones
      if (rodaRef.current) {
        rodaRef.current.style.transform = `perspective(900px) rotateX(${(e.ax * 0.6).toFixed(3)}rad) rotateZ(${e.ay.toFixed(3)}rad)`
      }
      if (escudoRef.current) {
        escudoRef.current.style.transform = `perspective(900px) rotateX(${(e.ax * 0.4).toFixed(3)}rad) rotateY(${e.ay.toFixed(3)}rad)`
      }
      ESTRELAS.forEach(({ centro, vertices }, i) => {
        const no = estrelasRef.current[i]
        if (!no) return
        const opacidade = Math.max(0, Math.min(1, (girar(centro, cy, sy, cx, sx)[2] - 0.1) * 5))
        if (opacidade === 0) {
          no.setAttribute('opacity', '0')
          return
        }
        const pontosSvg = vertices.map((v) => {
          const [x, y] = girar(v, cy, sy, cx, sx)
          return `${(100 + x * 92).toFixed(1)},${(100 + y * 92).toFixed(1)}`
        })
        no.setAttribute('points', pontosSvg.join(' '))
        no.setAttribute('opacity', opacidade.toFixed(2))
      })
    }

    function quadro() {
      if (e.visivel) {
        if (!e.arrastando) {
          const alvo = e.pausado ? 0 : auto
          e.ay += e.vy
          e.ax = Math.max(-LIMITE_VERTICAL, Math.min(LIMITE_VERTICAL, e.ax + e.vx))
          e.vy += (alvo - e.vy) * 0.03 // inércia que volta à rotação automática
          e.vx *= 0.94
        }
        desenhar()
      }
      raf = requestAnimationFrame(quadro)
    }

    const aoPressionar = (ev) => {
      e.arrastando = true
      e.moveu = false
      e.x = ev.clientX
      e.y = ev.clientY
    }
    const aoMover = (ev) => {
      if (!e.arrastando) return
      const dx = ev.clientX - e.x
      const dy = ev.clientY - e.y
      if (!e.moveu && Math.hypot(dx, dy) < 5) return
      if (!e.moveu) el.setPointerCapture?.(ev.pointerId) // só captura ao arrastar: o clique nos ícones continua funcionando
      e.moveu = true
      e.x = ev.clientX
      e.y = ev.clientY
      e.ay += dx * 0.008
      e.ax = Math.max(-LIMITE_VERTICAL, Math.min(LIMITE_VERTICAL, e.ax - dy * 0.008))
      e.vy = dx * 0.008
      e.vx = -dy * 0.008
    }
    const aoSoltar = () => { e.arrastando = false }
    const aoEntrar = (ev) => { if (ev.pointerType === 'mouse') e.pausado = true }
    const aoSair = () => { e.pausado = false }
    const aoFocar = () => { e.pausado = true }
    const aoDesfocar = () => { e.pausado = false }
    // um arrasto não deve contar como clique em um ícone
    const aoClicar = (ev) => {
      if (e.moveu) {
        ev.preventDefault()
        ev.stopPropagation()
        e.moveu = false
      }
    }

    el.addEventListener('pointerdown', aoPressionar)
    el.addEventListener('pointermove', aoMover)
    el.addEventListener('pointerup', aoSoltar)
    el.addEventListener('pointercancel', aoSoltar)
    el.addEventListener('pointerenter', aoEntrar)
    el.addEventListener('pointerleave', aoSair)
    el.addEventListener('focusin', aoFocar)
    el.addEventListener('focusout', aoDesfocar)
    el.addEventListener('click', aoClicar, true)

    // só anima enquanto o painel está visível na tela (o carrossel esconde os outros)
    const observador = new IntersectionObserver(([entrada]) => { e.visivel = entrada.isIntersecting })
    observador.observe(el)

    desenhar()
    raf = requestAnimationFrame(quadro)

    return () => {
      cancelAnimationFrame(raf)
      observador.disconnect()
      el.removeEventListener('pointerdown', aoPressionar)
      el.removeEventListener('pointermove', aoMover)
      el.removeEventListener('pointerup', aoSoltar)
      el.removeEventListener('pointercancel', aoSoltar)
      el.removeEventListener('pointerenter', aoEntrar)
      el.removeEventListener('pointerleave', aoSair)
      el.removeEventListener('focusin', aoFocar)
      el.removeEventListener('focusout', aoDesfocar)
      el.removeEventListener('click', aoClicar, true)
    }
  }, [pontos])

  return (
    <section className="jogo-cartao globo">
      <p className="jogo-etiqueta">skills.globo</p>

      <div className="globo-palco" ref={palco}>
        <div className="globo-nucleo">
          <span className="so-escuro" ref={rodaRef}><Roda /></span>
          <span className="so-claro"><Esfera refsEstrelas={estrelasRef} /></span>
          <span className="so-galo" ref={escudoRef}>
            <img className="escudo-face" src="/img/escudo-cam.webp" alt={t('globo.escudo')} draggable="false" />
            <img className="escudo-face escudo-verso" src="/img/escudo-cam.webp" alt="" aria-hidden="true" draggable="false" />
          </span>
        </div>

        {HABILIDADES.map(({ nome, Icone, cor, link }, i) => (
          <a
            key={nome}
            ref={(no) => { itens.current[i] = no }}
            className="globo-item"
            href={link}
            target="_blank"
            rel="noreferrer"
            draggable="false"
            aria-label={t('globo.saibaMais', { nome })}
          >
            <span className="globo-icone">
              <Icone size={28} color={cor} aria-hidden="true" />
            </span>
            <span className="globo-nome">{nome}</span>
          </a>
        ))}
      </div>

      <p className="globo-dica">{t('globo.dica')}</p>
    </section>
  )
}