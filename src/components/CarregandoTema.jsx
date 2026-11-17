import { useIdioma } from '../idioma/contexto'
import './CarregandoTema.css'

// Carregamento de cada tema (as classes so-escuro / so-claro / so-galo mostram só a do tema atual):
//  - Noturno: um carro passando pela estrada
//  - Claro: o personagem passando de nuvem voadora, com nuvens e vento
//  - Galo: o escudo girando como uma moeda
function Carro() {
  return (
    <svg className="carr-carro" viewBox="0 0 200 80" aria-hidden="true">
      <defs>
        <linearGradient id="carr-feixe" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="carr-vidro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a4350" />
          <stop offset="1" stopColor="#0b1519" />
        </linearGradient>
      </defs>
      <polygon points="190,52 200,46 200,60" fill="url(#carr-feixe)" />
      <path d="M10 46 L3 42 L17 41 Z" fill="var(--sombra-botao)" />
      <path d="M8 60 L8 53 C8 49 12 47 19 46 L56 42 C66 33 80 28 98 28 L122 28 C134 28 144 33 152 42 L182 46 C190 48 194 51 194 55 L194 60 Z" fill="var(--destaque)" />
      <path d="M20 49 L182 49" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2" />
      <path d="M69 42 C75 35 85 31 98 31 L120 31 C128 31 136 35 142 42 Z" fill="url(#carr-vidro)" />
      <path d="M107 31 L107 42" stroke="var(--destaque)" strokeWidth="2" />
      {[46, 150].map((cx) => (
        <circle key={`arco-${cx}`} cx={cx} cy="60" r="16" fill="#050a0c" />
      ))}
      {[46, 150].map((cx) => (
        <g key={cx} className="carr-roda" style={{ transformBox: 'view-box', transformOrigin: `${cx}px 60px` }}>
          <circle cx={cx} cy="60" r="13" fill="#0b0b0c" />
          <circle cx={cx} cy="60" r="8" fill="#d6dde3" />
          <g stroke="#0b0b0c" strokeWidth="2">
            <line x1={cx} y1="53" x2={cx} y2="67" />
            <line x1={cx - 7} y1="60" x2={cx + 7} y2="60" />
            <line x1={cx - 5} y1="55" x2={cx + 5} y2="65" />
            <line x1={cx + 5} y1="55" x2={cx - 5} y2="65" />
          </g>
          <circle cx={cx} cy="60" r="2.4" fill="var(--secundaria)" />
        </g>
      ))}
      <path d="M184 49 L193 50 L193 54 L185 53 Z" fill="#fff" />
      <rect x="8" y="48" width="6" height="5" rx="1.5" fill="var(--secundaria)" />
    </svg>
  )
}

export default function CarregandoTema() {
  const { t } = useIdioma()

  return (
    <div className="carr" role="status" aria-live="polite">
      <div className="carr-palco" aria-hidden="true">
        <div className="so-escuro carr-cena carr-noturno">
          <span className="carr-estrada" />
          <Carro />
        </div>

        <div className="so-claro carr-cena carr-claro">
          {[0, 1, 2].map((i) => <span key={i} className={`carr-nuvem n${i}`} />)}
          <img className="carr-goku" src="/img/goku-nuvem.webp" alt="" draggable="false" />
          {[0, 1, 2, 3].map((i) => <span key={i} className={`carr-vento v${i}`} />)}
        </div>

        <div className="so-galo carr-cena carr-galo">
          <div className="carr-moeda">
            <img className="carr-face" src="/img/escudo-cam.webp" alt="" draggable="false" />
            <img className="carr-face carr-verso" src="/img/escudo-cam.webp" alt="" draggable="false" />
          </div>
        </div>
      </div>

      <p className="carr-texto">{t('curriculo.carregando')}</p>
    </div>
  )
}