import { WAKATIME } from '../config/wakatime'

// O WakaTime responde 202 enquanto ainda está calculando as estatísticas
export class WakaPendente extends Error {}

let cache = null

// Aceita o usuário com ou sem o @ na frente
export const usuarioLimpo = () => WAKATIME.usuario.trim().replace(/^@/, '')

export const usuarioConfigurado = () =>
  Boolean(usuarioLimpo()) && usuarioLimpo() !== 'SEU_USUARIO'

const lista = (itens = []) =>
  itens.map((i) => ({ nome: i.name, segundos: i.total_seconds, percent: i.percent }))

function normalizar(d) {
  const total = d.total_seconds ?? 0
  const media = d.daily_average ?? 0
  return {
    totalSegundos: total,
    mediaDiaria: media,
    // a média do WakaTime considera só os dias com código: dá para estimar quantos foram
    diasAtivos: media > 0 ? Math.round(total / media) : null,
    diasTotais: d.days_including_holidays ?? null,
    desde: d.start ?? null,
    intervalo: d.human_readable_range ?? '',
    melhorDia: d.best_day ? { data: d.best_day.date, segundos: d.best_day.total_seconds } : null,
    linguagens: lista(d.languages),
    editores: lista(d.editors),
    projetos: lista(d.projects),
  }
}

// Busca uma vez por visita (as trocas de tela não repetem a chamada).
// Se o período escolhido não existir ou não estiver liberado, tenta os próximos.
export async function buscarEstatisticas() {
  if (cache) return cache
  // O usuário fica no rewrite (vercel.json) e no middleware (vite.config.js).
  // Só o período público do perfil funciona: os outros dão 400 no WakaTime.
  const url = `${WAKATIME.base}/stats/${WAKATIME.intervalo}`
  const resposta = await fetch(url) // erro de rede sobe direto
  if (resposta.status === 202) throw new WakaPendente()
  const tipo = resposta.headers.get('content-type') ?? ''
  if (!tipo.includes('json')) {
    throw new Error('A rota /api/wakatime não está ativa: confira o vite.config.js e reinicie o servidor.')
  }
  const corpo = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    throw new Error(`WakaTime respondeu ${resposta.status} em ${url}${corpo.error ? ` — ${corpo.error}` : ''}`)
  }
  cache = normalizar(corpo.data)
  return cache
}

/* ---------- "Codando agora" ---------- */
// Sem cache: a página pergunta de novo a cada minuto
let pedidoAgora = null

// Resultado: { status: 'ok', dados } | { status: 'indisponivel' } | { status: 'erro' }
export function buscarCodandoAgora() {
  // Se dois lugares pedirem ao mesmo tempo, fazemos uma chamada só
  if (pedidoAgora) return pedidoAgora

  pedidoAgora = (async () => {
    try {
      const resposta = await fetch('/api/codando', { headers: { Accept: 'application/json' } })
      const tipo = resposta.headers.get('content-type') ?? ''
      // Sem token ou sem a rota (site estático): o cartão simplesmente não aparece
      if (!tipo.includes('json') || resposta.status === 503) return { status: 'indisponivel' }
      if (!resposta.ok) return { status: 'erro' }

      const dados = await resposta.json()
      return typeof dados?.active === 'boolean' ? { status: 'ok', dados } : { status: 'erro' }
    } catch {
      return { status: 'erro' } // rede fora
    } finally {
      pedidoAgora = null // libera para a próxima rodada
    }
  })()

  return pedidoAgora
}

/* ---------- formatação em português ---------- */
export function formatarDuracao(segundos) {
  const minutos = Math.round(segundos / 60)
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export const formatarPercent = (n, locale = 'pt-BR') =>
  `${Number(n).toLocaleString(locale, { maximumFractionDigits: 1 })}%`

export const formatarData = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

export const formatarDataCompleta = (iso, locale = 'pt-BR') =>
  new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })

const INTERVALOS = {
  'last 7 days': 'Últimos 7 dias',
  'last 30 days': 'Últimos 30 dias',
  'last 6 months': 'Últimos 6 meses',
  'last year': 'Último ano',
  'all time': 'Todo o período',
}
// Em inglês, usa o texto original do WakaTime (ex.: "Last 7 Days")
export const traduzirIntervalo = (texto, idioma = 'pt') =>
  idioma === 'en' ? texto : INTERVALOS[texto.toLowerCase()] ?? texto

// "há 3 min" / "3 min ago": o texto vem da tradução
export function formatarHa(instante, t, agora = Date.now()) {
  const min = Math.floor((agora - instante) / 60000)
  if (min < 1) return t('codando.agoraMesmo')
  if (min < 60) return t('codando.haMin', { n: min })
  return t('codando.haH', { n: Math.floor(min / 60) })
}

// "06:56" em português, "6:56 AM" em inglês
export const formatarHora = (instante, locale = 'pt-BR') =>
  new Date(instante).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })