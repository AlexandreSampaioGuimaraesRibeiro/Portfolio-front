// Comentários guardados no Supabase (banco de dados na nuvem), pela API REST.
// A chave "publishable" pode ficar no site: quem protege os dados são as regras do banco
// (veja supabase/comentarios.sql): visitantes só enviam e só leem os comentários aprovados.
const URL_BASE = import.meta.env.VITE_SUPABASE_URL
const CHAVE = import.meta.env.VITE_SUPABASE_KEY

export const comentariosConfigurado = () => Boolean(URL_BASE && CHAVE)

// Mesma regra do banco (supabase/comentarios.sql): bloqueia links, endereços de site e e-mails
const PADRAO_LINK = /(https?|ftp):|www\.|mailto:|\S\.(com|net|org|br|io|dev|app|me|xyz|info|biz|co|ly|gl|tk|ru|cn|top|site|online|shop|link|click|store|club|vip)(\b|\/)/i
export const temLink = (texto) => PADRAO_LINK.test(texto)

export async function listarComentarios() {
  const resposta = await fetch(
    `${URL_BASE}/rest/v1/comentarios?select=id,nome,mensagem,criado_em&order=criado_em.desc&limit=50`,
    { headers: { apikey: CHAVE } },
  )
  if (!resposta.ok) throw new Error(`Comentários: o servidor respondeu ${resposta.status}`)
  return resposta.json()
}

export async function enviarComentario({ nome, mensagem }) {
  const resposta = await fetch(`${URL_BASE}/rest/v1/comentarios`, {
    method: 'POST',
    headers: { apikey: CHAVE, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ nome, mensagem }),
  })
  if (!resposta.ok) {
    // o banco recusou o texto (regra de links): o código 23514 é "check constraint"
    const corpo = await resposta.json().catch(() => ({}))
    const erro = new Error(`Comentários: o servidor respondeu ${resposta.status}`)
    erro.rejeitado = corpo.code === '23514'
    throw erro
  }
}