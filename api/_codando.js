// Lógica do "Codando agora". O token vem de fora e nunca sai do servidor.
const ATIVO_MIN = 10 // último sinal há até 10 min = "codando agora"
const PAUSA_MIN = 15 // pausa maior que 15 min encerra a sessão
const FUSO = 'America/Sao_Paulo'

// Projetos que aparecem pelo nome (com a branch). '*' = todos.
// Use o nome que o WakaTime mostra no dashboard.
const PROJETOS_PUBLICOS = ['Portfolio-front']
const ehPublico = (nome) =>
  PROJETOS_PUBLICOS.includes('*') || PROJETOS_PUBLICOS.includes(nome)

// Soma os intervalos entre heartbeats seguidos, ignorando pausas longas.
// "filtro" deixa contar só os heartbeats que interessam (ex.: de um projeto).
function somarTempo(batimentos, pausaSeg, filtro = () => true) {
  let total = 0
  for (let i = 1; i < batimentos.length; i++) {
    const intervalo = batimentos[i].time - batimentos[i - 1].time
    if (intervalo <= pausaSeg && filtro(batimentos[i])) total += intervalo
  }
  return total
}

// Traduz o user_agent_id do heartbeat no nome do editor ("VS Code", ...)
async function buscarEditores(token) {
  try {
    const resposta = await fetch('https://wakatime.com/api/v1/users/current/user_agents', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!resposta.ok) return new Map()
    const { data = [] } = await resposta.json()
    return new Map(data.map((u) => [u.id, u.editor]))
  } catch {
    return new Map() // sem a lista, o cartão só não mostra o editor
  }
}

export async function buscarCodando(token) {
  if (!token) return { status: 503, corpo: { error: 'missing_config' } }

  // Data de hoje no seu fuso, no formato AAAA-MM-DD
  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: FUSO })
  const [resposta, editores] = await Promise.all([
    fetch(`https://wakatime.com/api/v1/users/current/heartbeats?date=${hoje}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    buscarEditores(token),
  ])
  if (!resposta.ok) return { status: 502, corpo: { error: 'wakatime_error' } }

  const { data = [] } = await resposta.json()
  if (data.length === 0) {
    return { status: 200, corpo: { active: false, last: null, todaySeconds: 0 } }
  }

  // O WakaTime manda em segundos; o JavaScript trabalha em milissegundos
  const ultimo = data[data.length - 1]
  const agora = Date.now()
  const ultimoEm = ultimo.time * 1000
  const ativo = agora - ultimoEm <= ATIVO_MIN * 60 * 1000

  // Volta de trás para frente até achar uma pausa grande: ali começou a sessão
  let inicio = data.length - 1
  while (inicio > 0 && data[inicio].time - data[inicio - 1].time <= PAUSA_MIN * 60) {
    inicio--
  }

  const publico = ehPublico(ultimo.project)

  return {
    status: 200,
    corpo: {
      active: ativo,
      last: {
        project: publico ? ultimo.project : null,
        branch: publico ? ultimo.branch : null,
        language: ultimo.language,
        editor: editores.get(ultimo.user_agent_id) ?? null,
        at: ultimoEm,
        sessionStart: data[inicio].time * 1000,
        isPublic: publico,
        projectTodaySeconds: somarTempo(data, PAUSA_MIN * 60, (h) => h.project === ultimo.project),
      },
      todaySeconds: somarTempo(data, PAUSA_MIN * 60),
    },
  }
}