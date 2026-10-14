import { infoTecnologia } from '../data/tecnologias'
import './Tecnologia.css'

// Etiqueta de tecnologia: quadradinho escuro com o ícone + o nome
export default function Tecnologia({ nome }) {
  const { Icone, cor } = infoTecnologia(nome)
  return (
    <span className="tec" translate="no">
      <span className="tec-icone">
        <Icone size={20} color={cor} aria-hidden="true" />
      </span>
      {nome}
    </span>
  )
}