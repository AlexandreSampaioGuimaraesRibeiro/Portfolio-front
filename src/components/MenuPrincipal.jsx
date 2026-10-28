import { useEffect, useState } from 'react'
import { Container, Group, Stack, Title, Text, UnstyledButton, Kbd } from '@mantine/core'
import './MenuPrincipal.css'
import BannerGame from './BannerGame'
import Velocimetro from './Velocimetro'
import useAtalhosJogo from '../hooks/useAtalhosJogo'
import { useTema } from '../tema/contexto'
import { useIdioma } from '../idioma/contexto'

// As fotos ficam em public/img/
const imagemPerfil_claro = '/img/perfil-claro.png'
const imagemPerfil_escuro = '/img/perfil-escuro.png'
const imagemPerfil_galo = '/img/perfil-galo.webp'

const perfil = {
  nome: 'Alexandre S G Ribeiro',
  iniciais: 'AR',
}

// Ordem igual à de "menu.itens" em idioma/textos.js
const IDS = ['sobre', 'projetos', 'habilidades', 'comentarios', 'contato']

export default function MenuPrincipal({ onSelect }) {
  const [ativo, setAtivo] = useState(0)
  const { tema } = useTema()
  const { t } = useIdioma()
  const foto = { claro: imagemPerfil_claro, galo: imagemPerfil_galo }[tema] ?? imagemPerfil_escuro
  const itens = t('menu.itens')
  const cargo = t('menu.cargo')

  useAtalhosJogo({ onConfirmar: () => onSelect(IDS[ativo]) })

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setAtivo((i) => (i + 1) % IDS.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setAtivo((i) => (i - 1 + IDS.length) % IDS.length)
      } else if (e.key === 'Enter') {
        onSelect(IDS[ativo])
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [ativo, onSelect])

  return (
    <Container size={1200} className="menu-pagina">
      <BannerGame jogador="Alexandre" nivel={t('banner.nivel', { n: '02' })} />
      <Group className="menu-topo" gap="md">
        <span className="menu-avatar">
          <img src={foto} alt="" />
        </span>
        <div>
          <Text fw={700} ff="monospace">{perfil.nome}</Text>
          <Text size="xs" c="dimmed">{cargo}</Text>
        </div>
      </Group>

      <Text className="menu-chamada">{perfil.nome} // {cargo}</Text>
      <Title order={1} className="menu-titulo">{t('menu.titulo')}</Title>
      <Text size="xs" c="dimmed" className="menu-sub">{t('menu.sub')}</Text>

      <div className="menu-corpo">
        <Stack gap="sm" className="menu-lista" role="menu">
          {itens.map((item, i) => (
            <UnstyledButton
              key={IDS[i]}
              role="menuitem"
              className={`menu-item ${i === ativo ? 'ativo' : ''}`}
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              onClick={() => onSelect(IDS[i])}
            >
              <span className="menu-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu-nome">{item.titulo}</span>
              {i === ativo && <span aria-hidden="true">›</span>}
            </UnstyledButton>
          ))}
        </Stack>

        <div className="menu-orbita" aria-hidden="true">
          <div className="menu-disco">
            <img className="menu-foto" src={foto} alt={t('menu.foto', { nome: perfil.nome })} />
            <Velocimetro />
          </div>
        </div>
      </div>

      <div className="menu-descricao" aria-live="polite">
        <span>{String(ativo + 1).padStart(2, '0')}</span>
        <Text>{itens[ativo].descricao}</Text>
      </div>

      <Group className="menu-dicas" justify="space-between">
        <Text size="xs" ff="monospace" c="var(--destaque-forte)">{t('menu.navegar')}</Text>
        <Group gap="lg">
          <Group gap={6}><Kbd>↑</Kbd><Kbd>↓</Kbd><Text size="xs" c="dimmed">{t('menu.navegarSetas')}</Text></Group>
          <Group gap={6}><Kbd>Enter</Kbd><Kbd>x</Kbd><Text size="xs" c="dimmed">{t('menu.confirmar')}</Text></Group>
          <Text size="xs" c="dimmed">{t('menu.ouMouse')}</Text>
        </Group>
      </Group>

      <Group className="menu-rodape" justify="space-between">
        <Text size="xs" c="dimmed">© {new Date().getFullYear()} {perfil.nome}</Text>
        <Text size="xs" c="dimmed">{t('geral.rodape')}</Text>
      </Group>
    </Container>
  )
}