import TelaGame from './TelaGame'
import Carrossel from './Carrossel'
import { WakaGrade, WakaLegenda, WakaBarras } from './WakaTimePainel'
import GloboHabilidades from './GloboHabilidades'
import useWakaTime from '../hooks/useWakaTime'
import { useIdioma } from '../idioma/contexto'

export default function Habilidades({ onVoltar }) {
  const { t } = useIdioma()
  // Uma única consulta ao WakaTime, usada pelos três painéis
  const estado = useWakaTime()

  const slides = [
    { id: 'grade', titulo: t('habilidades.paineis.grade'), conteudo: <WakaGrade estado={estado} /> },
    { id: 'fatias', titulo: t('habilidades.paineis.fatias'), conteudo: <WakaLegenda estado={estado} /> },
    { id: 'ranking', titulo: t('habilidades.paineis.ranking'), conteudo: <WakaBarras estado={estado} /> },
    { id: 'globo', titulo: t('habilidades.paineis.globo'), conteudo: <GloboHabilidades /> },
  ]

  return (
    <TelaGame titulo={t('habilidades.titulo')} fase="03" onVoltar={onVoltar}>
      <Carrossel slides={slides} rotulo={t('habilidades.titulo')} />
    </TelaGame>
  )
}