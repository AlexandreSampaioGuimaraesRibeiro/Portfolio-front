import { Text, Badge, Group } from '@mantine/core'
import TelaGame from './TelaGame'

// Troque pelos seus projetos. "repo" e "demo" são opcionais.
const projetos = [
  { nome: 'Beework', descricao: 'Plataforma de serviços profissionais, desenvolvida como TCC.', tecnologias: ['Laravel', 'PHP'], repo: '' },
  { nome: 'MeepleShelf', descricao: 'Aplicação para organizar uma coleção de board games.', tecnologias: ['JavaScript', 'JSON Server'], repo: '' },
  { nome: 'TIAW2', descricao: 'App de autocontrole para apostas, com requisitos e fluxos modelados.', tecnologias: ['Web'], repo: '' },
  { nome: 'Este portfólio', descricao: 'Portfólio em tema de videogame, com menu navegável pelo teclado.', tecnologias: ['React', 'Mantine', 'Vite'], repo: '' },
]

export default function Projetos({ onVoltar }) {
  return (
    <TelaGame titulo="Projetos" fase="02" onVoltar={onVoltar}>
      <div className="jogo-grade">
        {projetos.map((p, i) => (
          <article key={p.nome} className={`jogo-cartao ${i % 2 ? 'vermelho' : ''}`}>
            <p className="jogo-etiqueta">{p.nome}</p>
            <Text c="dimmed" mb="md" style={{ lineHeight: 1.7 }}>{p.descricao}</Text>
            <Group gap="xs" mb="lg">
              {p.tecnologias.map((t) => (
                <Badge key={t} variant="outline" color="gray" radius={0} tt="none">{t}</Badge>
              ))}
            </Group>
            {p.repo && (
              <a className="jogo-botao" href={p.repo} target="_blank" rel="noreferrer">Ver código →</a>
            )}
          </article>
        ))}
      </div>
    </TelaGame>
  )
}