import dns from 'node:dns'
import tls from 'node:tls'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { WAKATIME } from './src/config/wakatime.js'

// O WakaTime não libera CORS: o navegador chama /api/wakatime/... e o servidor
// local busca em wakatime.com/api/v1/users/<usuario>/... (API pública, sem chave).
//   • npm run dev / npm run preview → este middleware
//   • Vercel                        → rewrite do vercel.json (troque o usuário lá também)
const WAKATIME_API = process.env.WAKATIME_API ?? 'https://wakatime.com/api/v1'

// Rede com IPv6 quebrado: tenta IPv4 primeiro
dns.setDefaultResultOrder?.('ipv4first')

// Rede/VPN/antivírus que inspeciona HTTPS: o navegador confia no certificado
// (está no Keychain do Mac), mas o Node não. Junta os certificados do sistema
// aos do Node (Node 22.19+ / 24.5+; em versões antigas não faz nada).
try {
  if (tls.getCACertificates && tls.setDefaultCACertificates) {
    tls.setDefaultCACertificates([
      ...tls.getCACertificates('default'),
      ...tls.getCACertificates('system'),
    ])
  }
} catch {
  /* segue com os certificados padrão do Node */
}

function motivo(erro) {
  const causa = erro?.cause ?? erro
  return [causa?.code, causa?.message].filter(Boolean).join(': ') || String(erro)
}

function wakatimeLocal() {
  const middleware = async (req, res, next) => {
    if (!req.url.startsWith(`${WAKATIME.base}/`)) return next()
    const caminho = req.url.slice(WAKATIME.base.length) // ex.: /stats/all_time
    const usuario = encodeURIComponent(WAKATIME.usuario.trim().replace(/^@/, ''))
    const url = `${WAKATIME_API}/users/${usuario}${caminho}`
    try {
      const resposta = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': req.headers['user-agent'] ?? 'Mozilla/5.0',
        },
        signal: AbortSignal.timeout(20000),
      })
      res.statusCode = resposta.status
      res.setHeader('Content-Type', resposta.headers.get('content-type') ?? 'application/json')
      res.end(Buffer.from(await resposta.arrayBuffer()))
    } catch (erro) {
      const texto = motivo(erro)
      console.error(`[wakatime] não consegui acessar ${url} → ${texto}`)
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: `Servidor local não acessou o wakatime.com (${texto})` }))
    }
  }
  return {
    name: 'wakatime-local',
    configureServer: (server) => { server.middlewares.use(middleware) },
    configurePreviewServer: (server) => { server.middlewares.use(middleware) },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wakatimeLocal()], // mantenha os seus plugins como estão
})
