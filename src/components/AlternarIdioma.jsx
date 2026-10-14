import { useEffect } from 'react'
import { Kbd, UnstyledButton } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useIdioma } from '../idioma/contexto'
import './AlternarTema.css'

const OPCOES = [
  { id: 'pt', rotulo: 'PT', nome: 'Português', tecla: 'p' },
  { id: 'en', rotulo: 'EN', nome: 'English', tecla: 'i' },
]

export default function AlternarIdioma() {
  const { idioma, mudarIdioma, t } = useIdioma()

  // P = português, I = inglês (ignora digitação em campos)
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      const opcao = OPCOES.find((o) => o.tecla === e.key.toLowerCase())
      if (opcao) mudarIdioma(opcao.id)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [mudarIdioma])

  return (
    <div className="tema-seletor" role="group" aria-label={t('idioma.grupo')}>
      {OPCOES.map(({ id, rotulo, nome, tecla }) => (
        <UnstyledButton
          key={id}
          className={`tema-opcao ${idioma === id ? 'ativo' : ''}`}
          aria-pressed={idioma === id}
          aria-label={nome}
          lang={id}
          onClick={() => mudarIdioma(id)}
        >
          <IconLanguage size={16} aria-hidden="true" />
          {rotulo}
          <Kbd size="xs">{tecla.toUpperCase()}</Kbd>
        </UnstyledButton>
      ))}
    </div>
  )
}