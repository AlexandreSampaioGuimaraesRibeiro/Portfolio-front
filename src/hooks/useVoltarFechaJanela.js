import { useEffect, useRef } from 'react'

// Com uma janela aberta (currículo, print ampliado), o botão voltar do navegador/celular
// fecha a janela em vez de sair da tela. Ao abrir, "empilha" uma entrada no histórico;
// se a janela for fechada de outro jeito (Esc, botão de fechar), essa entrada é desfeita.
export default function useVoltarFechaJanela(aberta, aoFechar) {
  const fechar = useRef(aoFechar)
  const empilhou = useRef(false)

  useEffect(() => {
    fechar.current = aoFechar
  })

  useEffect(() => {
    if (!aberta) return
    window.history.pushState({ ...(window.history.state ?? {}), janela: true }, '')
    empilhou.current = true

    const aoVoltar = () => {
      empilhou.current = false // o navegador já desfez a entrada
      fechar.current()
    }
    window.addEventListener('popstate', aoVoltar)

    return () => {
      window.removeEventListener('popstate', aoVoltar)
      if (empilhou.current) {
        empilhou.current = false
        window.history.back()
      }
    }
  }, [aberta])
}