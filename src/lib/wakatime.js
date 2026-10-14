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
  }
}

// Busca uma vez por visita (as trocas de tela não repetem a chamada).
// Se o período escolhido não existir ou não estiver liberado, tenta os próximos.
export async function buscarEstatisticas() {
  if (cache) return cache
  const usuario = encodeURIComponent(usuarioLimpo())
  const periodos = [...new Set([WAKATIME.intervalo, 'last_year', ''])]
  let ultimoErro = null

  for (const periodo of periodos) {
    const url = `${WAKATIME.base ?? '/wakatime-api'}/users/${usuario}/stats/${periodo}?is_including_today=true`
    const resposta = await fetch(url) // erro de rede/CORS sobe direto
    if (resposta.status === 202) throw new WakaPendente()
    if (resposta.ok) {
      if (!(resposta.headers.get('content-type') ?? '').includes('json')) {
        throw new Error('A rota /wakatime-api não está ativa: confira o proxy no vite.config.js e reinicie o servidor.')
      }
      const { data } = await resposta.json()
      cache = normalizar(data)
      return cache
    }
    ultimoErro = new Error(`WakaTime respondeu ${resposta.status} para ${url}`)
  }
  throw ultimoErro
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