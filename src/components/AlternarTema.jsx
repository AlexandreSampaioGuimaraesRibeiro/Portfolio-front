import { useEffect } from 'react'
import { Kbd, UnstyledButton } from '@mantine/core'
import { IconBallFootball, IconMoon, IconSun } from '@tabler/icons-react'
import { useTema } from '../tema/contexto'
import { useIdioma } from '../idioma/contexto'
import './AlternarTema.css'

const OPCOES = [
  { id: 'escuro', chave: 'tema.noturno', tecla: 'n', Icone: IconMoon },
  { id: 'claro', chave: 'tema.claro', tecla: 'd', Icone: IconSun },
  { id: 'galo', chave: 'tema.galo', tecla: 'g', Icone: IconBallFootball },
]

export default function AlternarTema() {
  const { tema, mudarTema } = useTema()
  const { t } = useIdioma()

  // N = noturno, D = claro, G = galo (ignora digitação em campos)
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
    <div className="tema-seletor" role="group" aria-label={t('tema.grupo')}>
      {OPCOES.map(({ id, chave, tecla, Icone }) => (
        <UnstyledButton
          key={id}
          className={`tema-opcao ${tema === id ? 'ativo' : ''}`}
          aria-pressed={tema === id}
          onClick={() => mudarTema(id)}
        >
          <Icone size={16} aria-hidden="true" />
          {t(chave)}
          <Kbd size="xs">{tecla.toUpperCase()}</Kbd>
        </UnstyledButton>
      ))}
    </div>
  )
}