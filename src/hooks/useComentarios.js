import { useEffect, useState } from 'react'
import { comentariosConfigurado, listarComentarios } from '../lib/comentarios'

// status: 'carregando' | 'pronto' | 'erro' | 'configurar'
// "recarregar" busca a lista de novo (usado logo depois de enviar, para o comentário aparecer)
export default function useComentarios() {
  const [estado, setEstado] = useState(() => ({
    status: comentariosConfigurado() ? 'carregando' : 'configurar',
    itens: [],
  }))
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    if (!comentariosConfigurado()) return
    let ativo = true
    listarComentarios()
      .then((itens) => ativo && setEstado({ status: 'pronto', itens }))
      .catch((erro) => {
        console.warn('Comentários:', erro)
        // numa nova tentativa que falha, mantém o que já estava na tela
        if (ativo) setEstado((atual) => (atual.itens.length > 0 ? atual : { status: 'erro', itens: [] }))
      })
    return () => {
      ativo = false
    }
  }, [versao])

  return { ...estado, recarregar: () => setVersao((v) => v + 1) }
}