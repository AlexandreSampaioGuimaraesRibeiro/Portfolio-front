import useAtalhosJogo from '../hooks/useAtalhosJogo'
import { Container, Group, Text, UnstyledButton, Kbd } from '@mantine/core'
import BannerGame from './BannerGame'
import './TelaGame.css'

const NOME = 'Alexandre Ribeiro' // troque pelo seu nome

// Moldura padrão de todas as telas: banner de jogo, botão voltar e rodapé
export default function TelaGame({ titulo, fase, onVoltar, children }) {
  useAtalhosJogo({ onVoltar })

  return (
    <Container size={1200} className="jogo-pagina">
      <BannerGame titulo={titulo} nivel={`Fase ${fase}`} dica="Pressione Y para voltar ao menu" />

      <UnstyledButton className="jogo-voltar" onClick={onVoltar}>
        <span aria-hidden="true">←</span> Menu principal <Kbd>Y</Kbd>
      </UnstyledButton>

      <main className="jogo-conteudo">{children}</main>

      <Group className="jogo-rodape" justify="space-between">
        <Text size="xs" c="dimmed">© {new Date().getFullYear()} {NOME}</Text>
        <Text size="xs" c="dimmed">Estudar. Praticar. Publicar.</Text>
      </Group>
    </Container>
  )
}