import { useLayoutEffect, useMemo, useState } from 'react'
import { IdiomaContexto } from './contexto'
import { criarT } from './traduzir'

const CHAVE = 'portfolio-idioma'

function idiomaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'pt' || salvo === 'en') return salvo
  } catch {
    /* sem acesso ao localStorage: segue para o padrão */
  }
  // quem usa o navegador em português vê português; os demais veem inglês
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export default function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaInicial)

  useLayoutEffect(() => {
    document.documentElement.lang = idioma === 'en' ? 'en' : 'pt-BR'
    try {
      localStorage.setItem(CHAVE, idioma)
    } catch {
      /* ignora */
    }
  }, [idioma])

  const valor = useMemo(() => ({ idioma, mudarIdioma: setIdioma, t: criarT(idioma) }), [idioma])

  return <IdiomaContexto.Provider value={valor}>{children}</IdiomaContexto.Provider>
}