import { Text, Group } from '@mantine/core'
import TelaGame from './TelaGame'
import Tecnologia from './Tecnologia'
import { useIdioma } from '../idioma/contexto'

// Troque pelos seus projetos. "repo" é o link do código (o botão só aparece se estiver preenchido).
// As descrições ficam em idioma/textos.js (projetos.descricoes), na mesma ordem desta lista.
const projetos = [
  { nome: 'Beework', tecnologias: ['Laravel', 'PHP'], repo: '' },
  { nome: 'MeepleShelf', tecnologias: ['JavaScript', 'JSON Server'], repo: '' },
  { nome: 'TIAW2', tecnologias: ['Web'], repo: '' },
  { nome: 'Portfolio', tecnologias: ['React', 'Mantine', 'Vite'], repo: '' },
]

export default function Projetos({ onVoltar }) {
  const { t } = useIdioma()
  const descricoes = t('projetos.descricoes')

  return (
    <TelaGame titulo={t('projetos.titulo')} fase="02" onVoltar={onVoltar}>
      <div className="jogo-grade">
        {projetos.map((p, i) => (
          <article key={p.nome} className={`jogo-cartao ${i % 2 ? 'vermelho' : ''}`}>
            <p className="jogo-etiqueta">{p.nome}</p>
            <Text c="dimmed" mb="md" style={{ lineHeight: 1.7 }}>{descricoes[i]}</Text>
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