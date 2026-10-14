// Escala do velocímetro que contorna a foto no tema noturno: 0 a 240 km/h em 270 graus.
// Os números e as marcas são desenhados em SVG, então acompanham o tamanho do disco.
const CENTRO = 100
const VELOCIDADE_MAX = 240
const ZONA_VERMELHA = 180 // acima disso a escala fica vermelha

// Posição de um ponto da escala (valor em km/h, a certa distância do centro)
const ponto = (valor, raio) => {
  const graus = -135 + (valor / VELOCIDADE_MAX) * 270 // -135° = embaixo à esquerda, +135° = embaixo à direita
  const rad = ((graus - 90) * Math.PI) / 180
  return [CENTRO + raio * Math.cos(rad), CENTRO + raio * Math.sin(rad)]
}

const MARCAS = Array.from({ length: 25 }, (_, i) => i * 10) // uma marca a cada 10 km/h
const NUMEROS = MARCAS.filter((v) => v % 20 === 0) // número a cada 20 km/h

export default function Velocimetro() {
  return (
    <svg className="menu-velocimetro so-escuro" viewBox="0 0 200 200" aria-hidden="true">
      {MARCAS.map((v) => {
        const grande = v % 20 === 0
        const [x1, y1] = ponto(v, grande ? 77 : 82)
        const [x2, y2] = ponto(v, 87.5)
        return (
          <line
            key={v}
            x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)}
            stroke={v >= ZONA_VERMELHA ? 'var(--secundaria)' : 'var(--texto)'}
            strokeWidth={grande ? 1.6 : 0.8}
            strokeLinecap="round"
            opacity={grande ? 0.95 : 0.55}
          />
        )
      })}

      {NUMEROS.map((v) => {
        const [x, y] = ponto(v, 69.5)
        return (
          <text
            key={v}
            x={x.toFixed(2)} y={y.toFixed(2)}
            className="menu-velo-num"
            textAnchor="middle"
            dominantBaseline="central"
            fill={v >= ZONA_VERMELHA ? 'var(--secundaria)' : 'var(--texto)'}
          >
            {v}
          </text>
        )
      })}

      <text x="100" y="173" className="menu-velo-unid" textAnchor="middle" dominantBaseline="central">KM/H</text>

      {/* ponteiro: fica na faixa dos números, sem cobrir a foto */}
      <g className="menu-agulha">
        <polygon points="100,8 96.8,38 103.2,38" fill="var(--secundaria)" />
      </g>
    </svg>
  )
}