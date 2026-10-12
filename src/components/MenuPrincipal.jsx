import { useEffect, useState } from 'react'
import { Container, Group, Stack, Title, Text, UnstyledButton, Kbd } from '@mantine/core'
import './MenuPrincipal.css'
import BannerGame from './BannerGame'
import useAtalhosJogo from '../hooks/useAtalhosJogo'
import { useTema } from '../tema/contexto'

const imagemPerfil_claro = '/img/perfil-claro.png'
const imagemPerfil_escuro = '/img/perfil-escuro.png'

const perfil = {
  nome: 'Alexandre S G Ribeiro',
  iniciais: 'AR',
  cargo: 'Estudante de Engenharia de Software',
}

const itens = [
  { id: 'sobre', titulo: 'Sobre', descricao: 'Conheça minha história, minha formação e como encaro o desenvolvimento de software.' },
  { id: 'projetos', titulo: 'Projetos', descricao: 'Veja o que já construí, com as tecnologias e o código de cada projeto.' },
  { id: 'habilidades', titulo: 'Habilidades', descricao: 'Linguagens, frameworks e ferramentas que uso no dia a dia.' },
  { id: 'contato', titulo: 'Contato', descricao: 'Fale comigo sobre estágio, projetos ou uma boa conversa sobre código.' },
]

export default function MenuPrincipal({ onSelect }) {
  const [ativo, setAtivo] = useState(0)
  const { tema } = useTema()
  const foto = tema === 'claro' ? imagemPerfil_claro : imagemPerfil_escuro

  useAtalhosJogo({ onConfirmar: () => onSelect(itens[ativo].id) })

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setAtivo((i) => (i + 1) % itens.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setAtivo((i) => (i - 1 + itens.length) % itens.length)
      } else if (e.key === 'Enter') {
        onSelect(itens[ativo].id)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [ativo, onSelect])

  return (
    <Container size={1200} className="menu-pagina">
      <BannerGame jogador="Alexandre" nivel="Nível 02" />
      <Group className="menu-topo" gap="md">
        <span className="menu-avatar">
          <img src={foto} alt="" />
        </span>
        <div>
          <Text fw={700} ff="monospace">{perfil.nome}</Text>
          <Text size="xs" c="dimmed">{perfil.cargo}</Text>
        </div>
      </Group>

      <Text className="menu-chamada">{perfil.nome} // {perfil.cargo}</Text>
      <Title order={1} className="menu-titulo">Menu Principal</Title>
      <Text size="xs" c="dimmed" className="menu-sub">Selecione seu próximo destino</Text>

      <div className="menu-corpo">
        <Stack gap="sm" className="menu-lista" role="menu">
          {itens.map((item, i) => (
            <UnstyledButton
              key={item.id}
              role="menuitem"
              className={`menu-item ${i === ativo ? 'ativo' : ''}`}
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              onClick={() => onSelect(item.id)}
            >
              <span className="menu-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu-nome">{item.titulo}</span>
              {i === ativo && <span aria-hidden="true">›</span>}
            </UnstyledButton>
          ))}
        </Stack>

        <div className="menu-orbita" aria-hidden="true">
          <div className="menu-disco">
            <img className="menu-foto" src={foto} alt={`Foto de ${perfil.nome}`} />
          </div>
        </div>
      </div>

      <div className="menu-descricao" aria-live="polite">
        <span>{String(ativo + 1).padStart(2, '0')}</span>
        <Text>{itens[ativo].descricao}</Text>
      </div>

      <Group className="menu-dicas" justify="space-between">
        <Text size="xs" ff="monospace" c="var(--destaque-forte)">Como navegar</Text>
        <Group gap="lg">
          <Group gap={6}><Kbd>↑</Kbd><Kbd>↓</Kbd><Text size="xs" c="dimmed">navegar</Text></Group>
          <Group gap={6}><Kbd>Enter</Kbd><Kbd>x</Kbd><Text size="xs" c="dimmed">confirmar</Text></Group>
          <Text size="xs" c="dimmed">ou passe o mouse e clique</Text>
        </Group>
      </Group>

      <Group className="menu-rodape" justify="space-between">
        <Text size="xs" c="dimmed">© {new Date().getFullYear()} {perfil.nome}</Text>
        <Text size="xs" c="dimmed">Estudar. Praticar. Publicar.</Text>
      </Group>
    </Container>
  )
}