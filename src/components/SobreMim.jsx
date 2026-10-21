import { useState } from 'react'
import { Title, Text, Group } from '@mantine/core'
import TelaGame from './TelaGame'
import Tecnologia from './Tecnologia'
import CurriculoModal from './CurriculoModal'
import { useIdioma } from '../idioma/contexto'
import './SobreMim.css'

// Os textos (resumo, formação...) ficam em idioma/textos.js, nos dois idiomas.
// Os PDFs do currículo ficam em config/curriculo.js.
const tags = ['Java', 'Spring Boot', 'React', 'Laravel']

export default function SobreMim({ onVoltar }) {
  const { t } = useIdioma()
  const [curriculoAberto, setCurriculoAberto] = useState(false)

  return (
    <TelaGame titulo={t('sobre.titulo')} fase="01" onVoltar={onVoltar}>
      <Title order={1} className="sobre-titulo">{t('sobre.manchete')}</Title>

      <div className="sobre-corpo">
        <section className="jogo-cartao">
          <p className="jogo-etiqueta">player.profile</p>
          <Title order={2} fw={400} size="h2">{t('sobre.resumoTitulo')}</Title>
          <Text c="dimmed" className="sobre-resumo">{t('sobre.resumo')}</Text>
          <Group gap="xs" my="lg">
            {tags.map((nome) => (
              <Tecnologia key={nome} nome={nome} />
            ))}
          </Group>
          <button type="button" className="jogo-botao" style={{ cursor: 'pointer' }} onClick={() => setCurriculoAberto(true)}>
            {t('sobre.curriculo')} →
          </button>
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

      <CurriculoModal aberto={curriculoAberto} aoFechar={() => setCurriculoAberto(false)} />
    </TelaGame>
  )
}