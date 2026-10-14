import { IconDots } from '@tabler/icons-react'
import { infoLinguagem } from '../data/linguagens'
import {
  formatarDataCompleta, formatarDuracao, formatarPercent, traduzirIntervalo, usuarioLimpo,
} from '../lib/wakatime'
import './WakaTimePainel.css'

const MENSAGENS = {
  carregando: 'Carregando suas estatísticas...',
  pendente: 'O WakaTime ainda está calculando seus dados. Tente de novo em alguns minutos.',
  erro: 'Não foi possível carregar os dados do WakaTime agora. Confira se o seu perfil está público.',
  configurar: 'Defina o seu usuário em src/config/wakatime.js para ver as estatísticas.',
}

// Junta o que passa do limite em uma única linha "Outras"
function limitar(linguagens, limite) {
  const topo = linguagens.slice(0, limite)
  const resto = linguagens.slice(limite)
  if (resto.length === 0) return topo
  const soma = (campo) => resto.reduce((total, l) => total + l[campo], 0)
  return [
    ...topo,
    { nome: `Outras (${resto.length})`, segundos: soma('segundos'), percent: soma('percent'), resto: true },
  ]
}

const estilo = (item) =>
  item.resto ? { Icone: IconDots, cor: '#9EA3AD' } : infoLinguagem(item.nome)

// Cartão comum aos três painéis: título, período e os avisos de carregando/erro
function Moldura({ etiqueta, estado, children }) {
  const { status, dados, detalhe } = estado

  if (status !== 'pronto') {
    return (
      <section className="jogo-cartao">
        <p className="jogo-etiqueta">{etiqueta}</p>
        <p className={`waka-status ${status}`} role="status">{MENSAGENS[status]}</p>
        {detalhe && <p className="waka-detalhe">Detalhe técnico: {detalhe}</p>}
      </section>
    )
  }

  const periodo =
    dados.desde && dados.intervalo.toLowerCase() === 'all time'
      ? `Desde ${formatarDataCompleta(dados.desde)}`
      : traduzirIntervalo(dados.intervalo)

  return (
    <section className="jogo-cartao">
      <p className="jogo-etiqueta">{etiqueta}</p>
      <p className="waka-sub">
        {periodo} ·{' '}
        <a href={`https://wakatime.com/@${usuarioLimpo()}`} target="_blank" rel="noreferrer">
          wakatime.com/@{usuarioLimpo()}
        </a>
      </p>
      {dados.linguagens.length > 0 ? (
        children(dados)
      ) : (
        <p className="waka-status">
          O WakaTime não está compartilhando suas linguagens. Ative nas configurações do perfil.
        </p>
      )}
    </section>
  )
}

/* ---------- 1) Grade: indicadores + um cartão com anel por linguagem ---------- */
function Indicadores({ dados }) {
  const editor = dados.editores[0]
  const itens = [
    { rotulo: 'Tempo total', valor: formatarDuracao(dados.totalSegundos), nota: `em ${dados.linguagens.length} linguagens` },
    { rotulo: 'Média diária', valor: formatarDuracao(dados.mediaDiaria), nota: 'nos dias com código' },
    dados.diasAtivos != null && {
      rotulo: 'Dias ativos',
      valor: dados.diasAtivos.toLocaleString('pt-BR'),
      nota: dados.diasTotais ? `de ${dados.diasTotais.toLocaleString('pt-BR')} dias` : '',
    },
    editor && { rotulo: 'Editor', valor: editor.nome, nota: `${formatarPercent(editor.percent)} do tempo` },
  ].filter(Boolean)

  return (
    <ul className="waka-kpis">
      {itens.map((i) => (
        <li key={i.rotulo} className="waka-kpi">
          <span className="waka-kpi-rotulo">{i.rotulo}</span>
          <strong className="waka-kpi-valor">{i.valor}</strong>
          <span className="waka-kpi-nota">{i.nota}</span>
        </li>
      ))}
    </ul>
  )
}

function Celula({ item, indice }) {
  const { Icone, cor } = estilo(item)
  return (
    <li
      className="waka-celula"
      style={{ '--i': indice, '--cor': cor, '--falta': 100 - item.percent }}
    >
      <div
        className="waka-anel"
        role="img"
        aria-label={`${item.nome}: ${formatarDuracao(item.segundos)}, ${formatarPercent(item.percent)}`}
      >
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle className="waka-anel-trilho" cx="40" cy="40" r="34" />
          <circle className="waka-anel-valor" cx="40" cy="40" r="34" pathLength="100" transform="rotate(-90 40 40)" />
        </svg>
        <span className="waka-anel-icone">
          <Icone size={22} color={cor} aria-hidden="true" />
        </span>
      </div>
      <span className="waka-nome" title={item.nome}>{item.nome}</span>
      <span className="waka-tempo-forte">{formatarDuracao(item.segundos)}</span>
      <span className="waka-pct">{formatarPercent(item.percent)}</span>
    </li>
  )
}

export function WakaGrade({ estado }) {
  return (
    <Moldura etiqueta="wakatime.grade" estado={estado}>
      {(dados) => (
        <>
          <Indicadores dados={dados} />
          <ul className="waka-grade">
            {limitar(dados.linguagens, 11).map((item, i) => (
              <Celula key={item.nome} item={item} indice={i} />
            ))}
          </ul>
        </>
      )}
    </Moldura>
  )
}

/* ---------- 2) Fatias: uma barra dividida por linguagem + legenda ---------- */
export function WakaLegenda({ estado }) {
  return (
    <Moldura etiqueta="wakatime.fatias" estado={estado}>
      {(dados) => {
        const itens = limitar(dados.linguagens, 10)
        return (
          <>
            <p className="waka-resumo">
              <strong>{formatarDuracao(dados.totalSegundos)}</strong> no total · média de{' '}
              <strong>{formatarDuracao(dados.mediaDiaria)}</strong> por dia de código
            </p>

            <div className="waka-fatias" aria-hidden="true">
              {itens.map((item) => (
                <span
                  key={item.nome}
                  className="waka-fatia"
                  style={{ flexGrow: item.segundos, background: estilo(item).cor }}
                  title={`${item.nome} · ${formatarDuracao(item.segundos)} · ${formatarPercent(item.percent)}`}
                />
              ))}
            </div>

            <ul className="waka-legenda">
              {itens.map((item) => (
                <li key={item.nome}>
                  <span className="waka-ponto" style={{ background: estilo(item).cor }} aria-hidden="true" />
                  <span className="waka-nome">{item.nome}</span>
                  <span className="waka-tempo">{formatarDuracao(item.segundos)}</span>
                </li>
              ))}
            </ul>
          </>
        )
      }}
    </Moldura>
  )
}

/* ---------- 3) Ranking: barras de XP em blocos ---------- */
function Linha({ item, max, indice }) {
  const { Icone, cor } = estilo(item)
  return (
    <li className="waka-linha" style={{ '--pct': `${(item.segundos / max) * 100}%`, '--i': indice }}>
      <span className="waka-icone">
        <Icone size={22} color={cor} aria-hidden="true" />
      </span>
      <div className="waka-corpo">
        <div className="waka-cabeca">
          <span className="waka-nome">{item.nome}</span>
          <span className="waka-tempo">{formatarDuracao(item.segundos)}</span>
          <span className="waka-pct">{formatarPercent(item.percent)}</span>
        </div>
        <div className="xp" aria-hidden="true">
          <div className="xp-fill" />
        </div>
      </div>
    </li>
  )
}

export function WakaBarras({ estado }) {
  return (
    <Moldura etiqueta="wakatime.ranking" estado={estado}>
      {(dados) => {
        const itens = limitar(dados.linguagens, 8)
        const max = dados.linguagens[0]?.segundos || 1
        return (
          <ul className="waka-lista">
            {itens.map((item, i) => (
              <Linha key={item.nome} item={item} max={max} indice={i} />
            ))}
          </ul>
        )
      }}
    </Moldura>
  )
}