import { Title, Text, Badge, Group } from '@mantine/core'
import TelaGame from './TelaGame'
import './SobreMim.css'

// Troque pelos seus dados
const resumo =
  'Estudante de Engenharia de Software na PUC Minas, em Belo Horizonte. Desenvolvo projetos acadêmicos e pessoais com Java, React e PHP, e gosto de transformar uma ideia em algo que funciona de ponta a ponta.'
const curriculo = '/curriculo.pdf' // coloque o arquivo em public/curriculo.pdf
const tags = ['Java', 'Spring Boot', 'React', 'Laravel']

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
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" color="gray" size="lg" radius={0} tt="none">{tag}</Badge>
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