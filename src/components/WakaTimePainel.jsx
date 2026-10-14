import { IconDots } from '@tabler/icons-react'
import { infoLinguagem } from '../data/linguagens'
import { useIdioma } from '../idioma/contexto'
import {
  formatarDataCompleta, formatarDuracao, formatarPercent, traduzirIntervalo, usuarioLimpo,
} from '../lib/wakatime'
import './WakaTimePainel.css'

// Tradução + números e datas no formato do idioma atual
function useFormato() {
  const { t, idioma } = useIdioma()
  const locale = idioma === 'en' ? 'en-US' : 'pt-BR'
  return {
    t,
    idioma,
    locale,
    pct: (n) => formatarPercent(n, locale),
    numero: (n) => n.toLocaleString(locale),
  }
}

// Junta o que passa do limite em uma única linha "Outras"
function limitar(linguagens, limite, t) {
  const topo = linguagens.slice(0, limite)
  const resto = linguagens.slice(limite)
  if (resto.length === 0) return topo
  const soma = (campo) => resto.reduce((total, l) => total + l[campo], 0)
  return [
    ...topo,
    { nome: t('waka.outras', { n: resto.length }), segundos: soma('segundos'), percent: soma('percent'), resto: true },
  ]
}

const estilo = (item) =>
  item.resto ? { Icone: IconDots, cor: '#9EA3AD' } : infoLinguagem(item.nome)

// Cartão comum aos três painéis: título, período e os avisos de carregando/erro
function Moldura({ etiqueta, estado, children }) {
  const { t, idioma, locale } = useFormato()
  const { status, dados, detalhe } = estado

  if (status !== 'pronto') {
    return (
      <section className="jogo-cartao">
        <p className="jogo-etiqueta">{etiqueta}</p>
        <p className={`waka-status ${status}`} role="status">{t(`waka.mensagens.${status}`)}</p>
        {detalhe && <p className="waka-detalhe">{t('waka.detalhe')} {detalhe}</p>}
      </section>
    )
  }

  const periodo =
    dados.desde && dados.intervalo.toLowerCase() === 'all time'
      ? t('waka.desde', { data: formatarDataCompleta(dados.desde, locale) })
      : traduzirIntervalo(dados.intervalo, idioma)

  return (
    <section className="jogo-cartao">
      <p className="jogo-etiqueta">{etiqueta}</p>
      <p className="waka-sub">
        {periodo} ·{' '}
        <a href={`https://wakatime.com/@${usuarioLimpo()}`} target="_blank" rel="noreferrer">
          wakatime.com/@{usuarioLimpo()}
        </a>
      </p>
      {dados.linguagens.length > 0 ? children(dados) : <p className="waka-status">{t('waka.semLinguagens')}</p>}
    </section>
  )
}

/* ---------- 1) Grade: indicadores + um cartão com anel por linguagem ---------- */
function Indicadores({ dados }) {
  const { t, pct, numero } = useFormato()
  const editor = dados.editores[0]
  const itens = [
    { rotulo: t('waka.total'), valor: formatarDuracao(dados.totalSegundos), nota: t('waka.emLinguagens', { n: dados.linguagens.length }) },
    { rotulo: t('waka.media'), valor: formatarDuracao(dados.mediaDiaria), nota: t('waka.diasComCodigo') },
    dados.diasAtivos != null && {
      rotulo: t('waka.dias'),
      valor: numero(dados.diasAtivos),
      nota: dados.diasTotais ? t('waka.deDias', { n: numero(dados.diasTotais) }) : '',
    },
    editor && { rotulo: t('waka.editor'), valor: editor.nome, nota: t('waka.doTempo', { p: pct(editor.percent) }) },
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
  const { pct } = useFormato()
  const { Icone, cor } = estilo(item)
  return (
    <li
      className="waka-celula"
      style={{ '--i': indice, '--cor': cor, '--falta': 100 - item.percent }}
    >
      <div
        className="waka-anel"
        role="img"
        aria-label={`${item.nome}: ${formatarDuracao(item.segundos)}, ${pct(item.percent)}`}
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
      <span className="waka-pct">{pct(item.percent)}</span>
    </li>
  )
}

export function WakaGrade({ estado }) {
  const { t } = useFormato()
  return (
    <Moldura etiqueta="wakatime.grade" estado={estado}>
      {(dados) => (
        <>
          <Indicadores dados={dados} />
          <ul className="waka-grade">
            {limitar(dados.linguagens, 11, t).map((item, i) => (
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
  const { t, pct } = useFormato()
  return (
    <Moldura etiqueta="wakatime.fatias" estado={estado}>
      {(dados) => {
        const itens = limitar(dados.linguagens, 10, t)
        return (
          <>
            <p className="waka-resumo">
              <strong>{formatarDuracao(dados.totalSegundos)}</strong> {t('waka.noTotal')}{' '}
              <strong>{formatarDuracao(dados.mediaDiaria)}</strong> {t('waka.porDia')}
            </p>

            <div className="waka-fatias" aria-hidden="true">
              {itens.map((item) => (
                <span
                  key={item.nome}
                  className="waka-fatia"
                  style={{ flexGrow: item.segundos, background: estilo(item).cor }}
                  title={`${item.nome} · ${formatarDuracao(item.segundos)} · ${pct(item.percent)}`}
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
function Linha({ item, indice }) {
  const { pct } = useFormato()
  const { Icone, cor } = estilo(item)
  return (
    <li className="waka-linha" style={{ '--pct': `${Math.min(100, Math.max(0, item.percent))}%`, '--i': indice }}>
      <span className="waka-icone">
        <Icone size={22} color={cor} aria-hidden="true" />
      </span>
      <div className="waka-corpo">
        <div className="waka-cabeca">
          <span className="waka-nome">{item.nome}</span>
          <span className="waka-tempo">{formatarDuracao(item.segundos)}</span>
          <span className="waka-pct">{pct(item.percent)}</span>
        </div>
        <div className="xp" aria-hidden="true">
          <div className="xp-fill" />
        </div>
      </div>
    </li>
  )
}

export function WakaBarras({ estado }) {
  const { t } = useFormato()
  return (
    <Moldura etiqueta="wakatime.ranking" estado={estado}>
      {(dados) => {
        const itens = limitar(dados.linguagens, 8, t)
        return (
          <ul className="waka-lista">
            {itens.map((item, i) => (
              <Linha key={item.nome} item={item} indice={i} />
            ))}
          </ul>
        )
      }}
    </Moldura>
  )
}