import { useEffect, useState } from 'react'
import { buscarCodandoAgora } from '../lib/wakatime'

const ATUALIZA_MS = 60 * 1000 // de minuto em minuto

export default function useCodandoAgora() {
  const [estado, setEstado] = useState({ status: 'carregando' })

  useEffect(() => {
    let ativo = true
    let timer = null

    const atualizar = () => {
      // Aba escondida: não gasta chamada à toa
      if (document.visibilityState === 'hidden') return
      buscarCodandoAgora().then((resultado) => {
        if (!ativo) return
        setEstado(resultado)
        // Sem token/rota: para de perguntar
        if (resultado.status === 'indisponivel' && timer) {
          clearInterval(timer)
          timer = null
        }
      })
    }

    atualizar()
    timer = setInterval(atualizar, ATUALIZA_MS)
    // Voltou para a aba: atualiza na hora
    document.addEventListener('visibilitychange', atualizar)

    return () => {
      ativo = false
      if (timer) clearInterval(timer)
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [])

  return estado
}