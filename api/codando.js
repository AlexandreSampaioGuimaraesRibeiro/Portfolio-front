import { buscarCodando } from './_codando.js'

export default async function handler(req, res) {
  const { status, corpo } = await buscarCodando(process.env.WAKATIME_ACCESS_TOKEN)
  res.setHeader('Cache-Control', 'no-store') // sempre dados frescos
  res.status(status).json(corpo)
}