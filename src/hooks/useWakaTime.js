import { useEffect, useState } from 'react'
import { buscarEstatisticas, usuarioConfigurado, WakaPendente } from '../lib/wakatime'

// status: 'carregando' | 'pronto' | 'pendente' | 'erro' | 'configurar'
export default function useWakaTime() {
  const [estado, setEstado] = useState(() => ({
    status: usuarioConfigurado() ? 'carregando' : 'configurar',
  }))

  useEffect(() => {
    if (!usuarioConfigurado()) return
    let ativo = true
    buscarEstatisticas()
      .then((dados) => ativo && setEstado({ status: 'pronto', dados }))
      .catch((erro) => {
        console.warn('WakaTime:', erro)
        if (ativo) setEstado({ status: erro instanceof WakaPendente ? 'pendente' : 'erro', detalhe: erro?.message })
      })
    return () => {
      ativo = false
    }
  }, [])

  return estado
}