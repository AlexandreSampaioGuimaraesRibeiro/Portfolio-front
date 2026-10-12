import './BannerGame.css'

export default function BannerGame({
  jogador = 'Player 01',
  nivel = 'Nível 02',
  titulo = 'Portfólio',
  dica = 'Pressione Enter para começar',
}) {
  return (
    <div className="banner">
      <div className="banner-hud">
        <span>1UP <strong>{jogador}</strong></span>
        <span className="banner-vidas" role="img" aria-label="3 vidas">♥ ♥ ♥</span>
        <span>{nivel}</span>
      </div>

      <p className="banner-titulo">{titulo}</p>

      <p className="banner-start">▶ {dica}</p>
    </div>
  )
}