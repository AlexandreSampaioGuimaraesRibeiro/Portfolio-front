import { Title, Text, Group } from '@mantine/core'
import { FaJava } from 'react-icons/fa'
import { SiSpringboot, SiReact, SiLaravel } from 'react-icons/si'
import TelaGame from './TelaGame'
import './SobreMim.css'

// Troque pelos seus dados
const resumo =
  'Estudante de Engenharia de Software na PUC Minas, em Belo Horizonte. Desenvolvo projetos acadêmicos e pessoais com Java, React e PHP, e gosto de transformar uma ideia em algo que funciona de ponta a ponta.'
const curriculo = 'public/curriculo/Curriculo_Portugues.pdf'
const curriculoIngles = 'public/curriculo/Curriculo_Ingles.pdf'
const tags = [
  { nome: 'Java', Icone: FaJava, cor: '#ED8B00' },
  { nome: 'Spring Boot', Icone: SiSpringboot, cor: '#6DB33F' },
  { nome: 'React', Icone: SiReact, cor: '#61DAFB' },
  { nome: 'Laravel', Icone: SiLaravel, cor: '#FF2D20' },
]

const formacao = [
  { periodo: 'Em andamento', titulo: 'Engenharia de Software', detalhe: 'PUC Minas · Bacharelado' },
  { periodo: 'Projetos', titulo: 'Aplicações acadêmicas e pessoais', detalhe: 'Back-end, front-end e banco de dados' },
  { periodo: 'Sempre', titulo: 'Aprendizado contínuo', detalhe: 'Cursos, documentação e prática diária' },
]

export default function SobreMim({ onVoltar }) {
  return (
    <TelaGame titulo="Sobre mim" fase="01" onVoltar={onVoltar}>
      <Title order={1} className="sobre-titulo">
        Aprendendo na prática, construindo de verdade.
      </Title>

      <div className="sobre-corpo">
        <section className="jogo-cartao">
          <p className="jogo-etiqueta">player.profile</p>
          <Title order={2} fw={400} size="h2">Um breve resumo</Title>
          <Text c="dimmed" className="sobre-resumo">{resumo}</Text>
          <Group gap="xs" my="lg">
            {tags.map(({ nome, Icone, cor }) => (
              <span key={nome} className="sobre-tag">
                <span className="sobre-tag-icone">
                  <Icone size={20} color={cor} aria-hidden="true" />
                </span>
                {nome}
              </span>
            ))}
          </Group>
          <a className="jogo-botao" href={curriculo} target="_blank" rel="noreferrer">Abrir currículo completo →</a>
        </section>

        <section>
          <p className="jogo-etiqueta">formacao.log</p>
          {formacao.map((item) => (
            <div className="sobre-linha" key={item.titulo}>
              <span className="sobre-periodo">{item.periodo}</span>
              <div>
                <Text size="lg">{item.titulo}</Text>
                <Text size="sm" c="dimmed">{item.detalhe}</Text>
              </div>
            </div>
          ))}
        </section>
      </div>
    </TelaGame>
  )
}