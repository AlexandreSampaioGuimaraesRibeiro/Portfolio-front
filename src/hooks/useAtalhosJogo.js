import { useEffect } from 'react'

const INTERATIVOS = 'a[href], button:not([disabled]), [role="menuitem"]'
const CAMPOS = 'input, textarea, select, [contenteditable="true"]'

// Atalhos de teclado do site:
//   Y -> voltar ao menu (se onVoltar existir)
//   X -> confirmar: chama onConfirmar (se existir) ou clica no item selecionado (em foco)
export default function useAtalhosJogo({ onVoltar, onConfirmar } = {}) {
  useEffect(() => {
    const aoTeclar = (e) => {
      // ignora Ctrl/Cmd/Alt, tecla segurada e digitação em campos de texto
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (e.target.closest?.(CAMPOS)) return

      const tecla = e.key.toLowerCase()

      if (tecla === 'y' && onVoltar) {
        onVoltar()
      } else if (tecla === 'x') {
        if (onConfirmar) {
          onConfirmar()
          return
        }
        const atual = document.activeElement
        if (atual?.matches?.(INTERATIVOS)) {
          atual.click()
        } else {
          // nada selecionado: seleciona o primeiro botão/link da tela
          document.querySelector(`main a[href], main button:not([disabled])`)?.focus()
        }
      }
    }

    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onVoltar, onConfirmar])
}
