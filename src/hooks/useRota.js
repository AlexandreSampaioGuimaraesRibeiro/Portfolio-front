import { useCallback, useEffect, useState } from 'react'

// Telas do site (a ordem é a mesma de "menu.itens" em idioma/textos.js). O endereço de cada uma
// é "#/nome", então o botão voltar do navegador e do celular funciona, e dá para compartilhar o link.
export const ROTAS = ['sobre', 'projetos', 'habilidades', 'comentarios', 'contato']

const doEndereco = () => {
  const id = window.location.hash.replace(/^#\/?/, '')
  return ROTAS.includes(id) ? id : 'menu'
}

export default function useRota() {
  const [rota, setRota] = useState(doEndereco)

  // voltar/avançar do navegador (ou do celular), ou mexer no endereço à mão
  useEffect(() => {
    const aoMudar = () => setRota(doEndereco())
    window.addEventListener('popstate', aoMudar)
    window.addEventListener('hashchange', aoMudar)
    return () => {
      window.removeEventListener('popstate', aoMudar)
      window.removeEventListener('hashchange', aoMudar)
    }
  }, [])

  // ao trocar de tela, a página começa no topo
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [rota])

  const irPara = useCallback((id) => {
    if (!ROTAS.includes(id)) return
    window.history.pushState({ app: true }, '', `#/${id}`)
    setRota(id)
  }, [])

  // O "Voltar" do site faz o mesmo que o do navegador. Se a pessoa entrou direto por um link
  // de uma tela (não há página anterior do site), volta ao menu sem sair do site.
  const voltar = useCallback(() => {
    if (window.history.state?.app) {
      window.history.back()
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setRota('menu')
    }
  }, [])

  return { rota, irPara, voltar }
}