import { Container, Group, Text, UnstyledButton, Kbd } from '@mantine/core'
import useAtalhosJogo from '../hooks/useAtalhosJogo'
import { useIdioma } from '../idioma/contexto'
import BannerGame from './BannerGame'
import './TelaGame.css'

const NOME = 'Alexandre Ribeiro' // troque pelo seu nome

// Moldura padrão de todas as telas: banner de jogo, botão voltar e rodapé
export default function TelaGame({ titulo, fase, onVoltar, children }) {
  const { t } = useIdioma()
  useAtalhosJogo({ onVoltar })

  return (
    <Container size={1200} className="jogo-pagina">
      <BannerGame titulo={titulo} nivel={t('banner.fase', { n: fase })} dica={t('banner.dicaTela')} />

      <UnstyledButton className="jogo-voltar" onClick={onVoltar}>
        <span aria-hidden="true">←</span> {t('tela.voltar')} <Kbd>Y</Kbd>
      </UnstyledButton>

      <main className="jogo-conteudo">{children}</main>

      <Group className="jogo-rodape" justify="space-between">
        <Text size="xs" c="dimmed">© {new Date().getFullYear()} {NOME}</Text>
        <Text size="xs" c="dimmed">{t('geral.rodape')}</Text>
      </Group>
    </Container>
  )
}