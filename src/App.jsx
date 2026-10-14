import { useState } from 'react'
import { Container } from '@mantine/core'
import AlternarTema from './components/AlternarTema'
import AlternarIdioma from './components/AlternarIdioma'
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

  return (
    <>
      <Container size={1200} className="tema-barra">
        <AlternarIdioma />
        <AlternarTema />
      </Container>
      {Tela ? <Tela onVoltar={() => setTela('menu')} /> : <MenuPrincipal onSelect={setTela} />}
    </>
  )
}