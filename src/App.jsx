import { useState } from 'react'
import MenuPrincipal from './components/MenuPrincipal'
import SobreMim from './components/SobreMim'
import Projetos from './components/Projetos'
import Habilidades from './components/Habilidades'
import Contato from './components/Contato'

const telas = {
  sobre: SobreMim,
  projetos: Projetos,
  habilidades: Habilidades,
  contato: Contato,
}

export default function App() {
  const [tela, setTela] = useState('menu')
  const Tela = telas[tela]

  if (!Tela) return <MenuPrincipal onSelect={setTela} />
  return <Tela onVoltar={() => setTela('menu')} />
}