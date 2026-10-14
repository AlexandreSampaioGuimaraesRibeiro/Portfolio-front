import { useIdioma } from '../idioma/contexto'
import './BannerGame.css'

// Textos de cada idioma vêm de idioma/textos.js; os de cada tema são trocados pelo CSS
// (data-tema no <html>), então o banner muda na hora, sem recarregar a página.
export default function BannerGame({ jogador = 'Player 01', nivel, titulo, dica }) {
  const { t } = useIdioma()

  return (
    <div className="banner">
      <div className="banner-hud">
        <span>
          <span className="so-escuro">{t('banner.piloto')}</span>
          <span className="so-claro">{t('banner.guerreiro')}</span>{' '}
          <strong>{jogador}</strong>
        </span>

        <span className="banner-vidas">
          <span className="so-escuro" role="img" aria-label={t('banner.combustivel')}>▮ ▮ ▮ ▮ ▯</span>
          <span className="so-claro" role="img" aria-label={t('banner.esferas')}>● ● ● ● ● ● ●</span>
        </span>

        <span>{nivel ?? t('banner.nivel', { n: '02' })}</span>
      </div>

      <p className="banner-titulo">{titulo ?? t('banner.titulo')}</p>

      <p className="banner-start">▶ {dica ?? t('banner.dicaMenu')}</p>
    </div>
  )
}