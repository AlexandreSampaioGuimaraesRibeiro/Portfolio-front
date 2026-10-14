import { Title, Text, Group } from '@mantine/core'
import { FaJava } from 'react-icons/fa'
import { SiSpringboot, SiReact, SiLaravel } from 'react-icons/si'
import TelaGame from './TelaGame'
import { useIdioma } from '../idioma/contexto'
import './SobreMim.css'

// Os textos (resumo, formação...) ficam em idioma/textos.js, nos dois idiomas.
// Arquivos da pasta public/ são acessados sem "/public" no caminho.
const curriculo = '/curriculo/Curriculo_Portugues.pdf'
const curriculoIngles = '/curriculo/Curriculo_Ingles.pdf'

const tags = [
  { nome: 'Java', Icone: FaJava, cor: '#ED8B00' },
  { nome: 'Spring Boot', Icone: SiSpringboot, cor: '#6DB33F' },
  { nome: 'React', Icone: SiReact, cor: '#61DAFB' },
  { nome: 'Laravel', Icone: SiLaravel, cor: '#FF2D20' },
]

export default function SobreMim({ onVoltar }) {
  const { t, idioma } = useIdioma()

  return (
    <TelaGame titulo={t('sobre.titulo')} fase="01" onVoltar={onVoltar}>
      <Title order={1} className="sobre-titulo">{t('sobre.manchete')}</Title>

      <div className="sobre-corpo">
        <section className="jogo-cartao">
          <p className="jogo-etiqueta">player.profile</p>
          <Title order={2} fw={400} size="h2">{t('sobre.resumoTitulo')}</Title>
          <Text c="dimmed" className="sobre-resumo">{t('sobre.resumo')}</Text>
          <Group gap="xs" my="lg">
            {tags.map(({ nome, Icone, cor }) => (
              <span key={nome} className="sobre-tag" translate="no">
                <span className="sobre-tag-icone">
                  <Icone size={20} color={cor} aria-hidden="true" />
                </span>
                {nome}
              </span>
            ))}
          </Group>
          <a
            className="jogo-botao"
            href={idioma === 'en' ? curriculoIngles : curriculo}
            target="_blank"
            rel="noreferrer"
          >
            {t('sobre.curriculo')} →
          </a>
        </section>

        <section>
          <p className="jogo-etiqueta">formacao.log</p>
          {t('sobre.formacao').map((item) => (
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