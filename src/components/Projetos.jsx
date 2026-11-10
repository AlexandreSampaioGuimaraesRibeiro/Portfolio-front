import { Text, Group } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import TelaGame from './TelaGame'
import Tecnologia from './Tecnologia'
import PrintsProjeto from './PrintsProjeto'
import useWakaTime from '../hooks/useWakaTime'
import { formatarDuracao } from '../lib/wakatime'
import { useIdioma } from '../idioma/contexto'
import './Projetos.css'

// As descrições ficam em idioma/textos.js (projetos.descricoes), na mesma ordem desta lista.
//  - repo: link do código (o botão só aparece se estiver preenchido)
//  - wakatime: nome do projeto no WakaTime. Use null nos projetos feitos antes de usar o WakaTime.
//  - horas: (opcional) horas informadas por você. Tem prioridade sobre o WakaTime.
//  - badge: (opcional) imagem do badge do WakaTime, usada quando não há horas nem dados da API.
//  - prints: imagens em public/img/projetos/
const projetos = [
  {
    nome: 'BeeWork',
    tecnologias: ['Laravel', 'PHP'],
    repo: 'https://github.com/AlexandreSampaioGuimaraesRibeiro/TCC',
    wakatime: null,
    prints: ['/img/beeWork/Print_01_BeeWork.png',],
  },
  {
    nome: 'MeepleShelf',
    tecnologias: ['JavaScript', 'JSON Server'],
    repo: 'https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2026-1-ti1-7620100-meepleshelf',
    wakatime: null,
    prints: ['/img/meepleShelf/Print_01_meepleshelf.png', 
      '/img/meepleShelf/Print_02_meepleshelf.png' , 
      '/img/meepleShelf/Print_03_meepleshelf.png',
      '/img/meepleShelf/Print_04_meepleshelf.png'],
  },
  {
    nome: 'Breaking Bet',
    tecnologias: ['React', 'Mantine', 'Vite'],
    repo: 'https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti2-7587100-breaking-bet',
    wakatime: 'plf-es-2026-2-ti2-7587100-breaking-bet',
    badge:
      'https://wakatime.com/badge/user/acc8534a-d626-49d6-a547-13e31d679ecf/project/4145749d-3464-4753-9566-264c31100eca.svg',
    prints: ['/img/breakingBet/Print_01_breakingBet.png',
      '/img/breakingBet/Print_02_breakingBet.png',
      '/img/breakingBet/Print_03_breakingBet.png',
      '/img/breakingBet/Print_04_breakingBet.png',
      '/img/breakingBet/Print_05_breakingBet.png',
      '/img/breakingBet/Print_06_breakingBet.png',
      '/img/breakingBet/Print_07_breakingBet.png',
      '/img/breakingBet/Print_08_breakingBet.png',
      '/img/breakingBet/Print_09_breakingBet.png',],
  },
  {
    nome: 'Portfolio',
    tecnologias: ['React', 'Mantine', 'Vite'],
    repo: 'https://github.com/AlexandreSampaioGuimaraesRibeiro/Portfolio-front',
    wakatime: 'Portfolio-front',
    badge: 'https://wakatime.com/badge/user/acc8534a-d626-49d6-a547-13e31d679ecf/project/817e18ee-7f6a-4335-9afe-9da340e798d9.svg',
    prints: ['/img/portfolio/Print_01_portfolio.png',
      '/img/portfolio/Print_02_portfolio.png',
      '/img/portfolio/Print_03_portfolio.png',
      '/img/portfolio/Print_04_portfolio.png',
      '/img/portfolio/Print_05_portfolio.png',
      '/img/portfolio/Print_06_portfolio.png',],
  },
]

// Tempo programado no projeto: horas manuais > WakaTime > badge > frase explicativa
function Horas({ projeto, estado }) {
  const { t } = useIdioma()

  let segundos = null
  if (projeto.horas != null) {
    segundos = projeto.horas * 3600
  } else if (projeto.wakatime && estado.status === 'pronto') {
    const achado = (estado.dados.projetos ?? []).find(
      (p) => p.nome.toLowerCase() === projeto.wakatime.toLowerCase(),
    )
    segundos = achado ? achado.segundos : null
  }

  if (segundos != null) {
    return (
      <p className="proj-horas">
        <IconClock size={18} aria-hidden="true" />
        <span className="proj-horas-rotulo">{t('projetos.horas')}</span>
        <strong>{formatarDuracao(segundos)}</strong>
      </p>
    )
  }

  if (projeto.badge) {
    return (
      <p className="proj-horas">
        <img src={projeto.badge} alt={`${t('projetos.horas')} · ${projeto.nome}`} loading="lazy" />
      </p>
    )
  }

  if (!projeto.wakatime) return <p className="proj-horas vazio">{t('projetos.semHoras')}</p>
  return (
    <p className="proj-horas vazio">
      {estado.status === 'carregando' ? '…' : t('projetos.indisponivel')}
    </p>
  )
}

export default function Projetos({ onVoltar }) {
  const { t } = useIdioma()
  const estado = useWakaTime()
  const descricoes = t('projetos.descricoes')

  return (
    <TelaGame titulo={t('projetos.titulo')} fase="02" onVoltar={onVoltar}>
      <div className="jogo-grade">
        {projetos.map((p, i) => (
          <article key={p.nome} className={`jogo-cartao ${i % 2 ? 'vermelho' : ''}`}>
            <p className="jogo-etiqueta">{p.nome}</p>
            <PrintsProjeto nome={p.nome} prints={p.prints} />
            <Text c="dimmed" mb="md" style={{ lineHeight: 1.7 }}>{descricoes[i]}</Text>
            <Horas projeto={p} estado={estado} />
            <Group gap="xs" mb="lg">
              {p.tecnologias.map((tec) => (
                <Tecnologia key={tec} nome={tec} />
              ))}
            </Group>
            {p.repo && (
              <a className="jogo-botao" href={p.repo} target="_blank" rel="noreferrer">
                {t('projetos.verCodigo')} →
              </a>
            )}
          </article>
        ))}
      </div>
    </TelaGame>
  )
}