import { useLayoutEffect, useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { TemaContexto } from './contexto'
import './temas.css'

const CHAVE = 'portfolio-tema'

function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'claro' || salvo === 'escuro' || salvo === 'galo') return salvo
  } catch {
    /* sem acesso ao localStorage: segue para o padrão */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'claro' : 'escuro'
}

export default function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial)

  useLayoutEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      localStorage.setItem(CHAVE, tema)
    } catch {
      /* ignora */
    }
  }, [tema])

  return (
    <TemaContexto.Provider value={{ tema, mudarTema: setTema }}>
      <MantineProvider forceColorScheme={tema === 'claro' ? 'light' : 'dark'}>{children}</MantineProvider>
    </TemaContexto.Provider>
  )
}