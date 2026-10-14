import TelaGame from './TelaGame'
import Carrossel from './Carrossel'
import { WakaGrade, WakaLegenda, WakaBarras } from './WakaTimePainel'
import GloboHabilidades from './GloboHabilidades'
import useWakaTime from '../hooks/useWakaTime'

export default function Habilidades({ onVoltar }) {
  // Uma única consulta ao WakaTime, usada pelos três painéis
  const estado = useWakaTime()

  const slides = [
    { id: 'grade', titulo: 'Grade de linguagens', conteudo: <WakaGrade estado={estado} /> },
    { id: 'fatias', titulo: 'Fatias do tempo', conteudo: <WakaLegenda estado={estado} /> },
    { id: 'ranking', titulo: 'Ranking em barras', conteudo: <WakaBarras estado={estado} /> },
    { id: 'globo', titulo: 'Globo de habilidades', conteudo: <GloboHabilidades /> },
  ]

  return (
    <TelaGame titulo="Habilidades" fase="03" onVoltar={onVoltar}>
      <Carrossel slides={slides} rotulo="Habilidades" />
    </TelaGame>
  )
}