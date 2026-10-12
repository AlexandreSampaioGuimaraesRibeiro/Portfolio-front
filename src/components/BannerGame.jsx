import './BannerGame.css'

// Os textos de cada tema são trocados pelo CSS (data-tema no <html>),
// então o banner muda na hora, sem precisar recarregar a página.
export default function BannerGame({
  jogador = 'Player 01',
  nivel = 'Nível 02',
  titulo = 'Portfólio',
  dica = 'Pressione Enter ou X para começar',
}) {
  return (
    <div className="banner">
      <div className="banner-hud">
        <span>
          <span className="so-escuro">Piloto</span>
          <span className="so-claro">Guerreiro</span>{' '}
          <strong>{jogador}</strong>
        </span>

        <span className="banner-vidas">
          <span className="so-escuro" role="img" aria-label="combustível: 4 de 5">▮ ▮ ▮ ▮ ▯</span>
          <span className="so-claro" role="img" aria-label="7 esferas">● ● ● ● ● ● ●</span>
        </span>

        <span>{nivel}</span>
      </div>

      <p className="banner-titulo">{titulo}</p>

      <p className="banner-start">▶ {dica}</p>
    </div>
  )
}