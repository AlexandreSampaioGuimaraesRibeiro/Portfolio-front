import { useEffect } from 'react'
import { Container } from '@mantine/core'
import AlternarTema from './components/AlternarTema'
import AlternarIdioma from './components/AlternarIdioma'
import CenaCeu from './components/CenaCeu'
import MenuPrincipal from './components/MenuPrincipal'
import SobreMim from './components/SobreMim'
import Projetos from './components/Projetos'
import Habilidades from './components/Habilidades'
import Comentarios from './components/Comentarios'
import Contato from './components/Contato'
import useRota, { ROTAS } from './hooks/useRota'
import { useIdioma } from './idioma/contexto'

const telas = {
  sobre: SobreMim,
  projetos: Projetos,
  habilidades: Habilidades,
  comentarios: Comentarios,
  contato: Contato,
}

export default function App() {
  const { rota, irPara, voltar } = useRota()
  const { t } = useIdioma()
  const Tela = telas[rota]

  // título da aba (aparece também na lista do botão voltar)
  const titulo = Tela ? t('menu.itens')[ROTAS.indexOf(rota)].titulo : t('banner.titulo')
  useEffect(() => {
    document.title = `${titulo} · Alexandre Ribeiro`
  }, [titulo])

  return (
    <>
      <CenaCeu />
      <Container size={1200} className="tema-barra">
        <AlternarIdioma />
        <AlternarTema />
      </Container>
      {Tela ? <Tela onVoltar={voltar} /> : <MenuPrincipal onSelect={irPara} />}
    </>
  )
}