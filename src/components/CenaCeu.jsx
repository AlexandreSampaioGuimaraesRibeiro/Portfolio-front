import './CenaCeu.css'

// Cena do tema claro: céu com nuvens e vento passando e o personagem flutuando sobre a nuvem.
// Tudo é animado só com CSS (transform), então fica leve. No tema noturno a cena fica escondida.
const NUVENS = [
  { top: '7%', larg: '26vw', dur: 95, atraso: -20, op: 0.9, x: '8%' },
  { top: '21%', larg: '16vw', dur: 140, atraso: -90, op: 0.75, x: '62%' },
  { top: '37%', larg: '30vw', dur: 80, atraso: -55, op: 0.85, x: '30%' },
  { top: '54%', larg: '20vw', dur: 120, atraso: -10, op: 0.7, x: '75%' },
  { top: '69%', larg: '34vw', dur: 70, atraso: -40, op: 0.8, x: '5%' },
  { top: '84%', larg: '18vw', dur: 110, atraso: -75, op: 0.65, x: '55%' },
]

// Riscos de vento: posição vertical, comprimento, duração e atraso (segundos)
const VENTOS = [
  { top: '6%', larg: 180, dur: 2.4, atraso: -0.4, op: 0.6 },
  { top: '14%', larg: 120, dur: 1.9, atraso: -1.3, op: 0.45 },
  { top: '24%', larg: 240, dur: 3.1, atraso: -2.2, op: 0.55 },
  { top: '33%', larg: 140, dur: 2.1, atraso: -0.9, op: 0.5 },
  { top: '42%', larg: 200, dur: 2.7, atraso: -1.7, op: 0.65 },
  { top: '51%', larg: 110, dur: 1.7, atraso: -0.2, op: 0.4 },
  { top: '60%', larg: 260, dur: 3.3, atraso: -2.8, op: 0.55 },
  { top: '68%', larg: 150, dur: 2.2, atraso: -1.1, op: 0.5 },
  { top: '76%', larg: 220, dur: 2.9, atraso: -0.6, op: 0.6 },
  { top: '84%', larg: 130, dur: 1.8, atraso: -1.5, op: 0.4 },
  { top: '91%', larg: 190, dur: 2.5, atraso: -2.4, op: 0.5 },
  { top: '47%', larg: 170, dur: 2.0, atraso: -1.0, op: 0.55 },
]

function Nuvem() {
  return (
    <svg viewBox="0 0 220 90" aria-hidden="true">
      <g fill="#fff">
        <circle cx="60" cy="56" r="26" />
        <circle cx="100" cy="40" r="34" />
        <circle cx="145" cy="52" r="28" />
        <circle cx="180" cy="62" r="20" />
        <rect x="40" y="56" width="160" height="26" rx="13" />
      </g>
    </svg>
  )
}

export default function CenaCeu() {
  return (
    <div className="cena-ceu" aria-hidden="true">
      {NUVENS.map((n, i) => (
        <div
          key={i}
          className="cena-nuvem"
          style={{ top: n.top, width: n.larg, opacity: n.op, '--dur': `${n.dur}s`, '--atraso': `${n.atraso}s`, '--x': n.x }}
        >
          <Nuvem />
        </div>
      ))}

      <div className="cena-personagem">
        <img src="/img/goku-nuvem.webp" alt="" draggable="false" />
      </div>

      {VENTOS.map((v, i) => (
        <span
          key={i}
          className="cena-vento"
          style={{ top: v.top, width: v.larg, opacity: v.op, '--dur': `${v.dur}s`, '--atraso': `${v.atraso}s` }}
        />
      ))}
    </div>
  )
}