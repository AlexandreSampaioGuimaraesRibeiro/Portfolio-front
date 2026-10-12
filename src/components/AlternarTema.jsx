import { useEffect } from 'react'
import { Kbd, UnstyledButton } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTema } from '../tema/contexto'
import './AlternarTema.css'

const OPCOES = [
  { id: 'escuro', rotulo: 'Noturno', tecla: 'c', Icone: IconMoon },
  { id: 'claro', rotulo: 'Claro', tecla: 'd', Icone: IconSun },
]

export default function AlternarTema() {
  const { tema, mudarTema } = useTema()

  // N = noturno, D = claro (ignora digitação em campos)
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      const opcao = OPCOES.find((o) => o.tecla === e.key.toLowerCase())
      if (opcao) mudarTema(opcao.id)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [mudarTema])

  return (
    <div className="tema-seletor" role="group" aria-label="Tema do site">
      {OPCOES.map(({ id, rotulo, tecla, Icone }) => (
        <UnstyledButton
          key={id}
          className={`tema-opcao ${tema === id ? 'ativo' : ''}`}
          aria-pressed={tema === id}
          onClick={() => mudarTema(id)}
        >
          <Icone size={16} aria-hidden="true" />
          {rotulo}
          <Kbd size="xs">{tecla.toUpperCase()}</Kbd>
        </UnstyledButton>
      ))}
    </div>
  )
}