import { IconCode, IconWorld } from '@tabler/icons-react'
import { SiJson } from 'react-icons/si'
import { HABILIDADES } from './habilidadesGlobo'

// Ícone e cor de cada tecnologia (Java, React, Laravel...). Reaproveita a lista do globo
// e acrescenta o que só aparece nos projetos. Para incluir outra, adicione uma linha em EXTRAS.
const EXTRAS = {
  'JSON Server': { Icone: SiJson, cor: '#CBCB41' },
  Web: { Icone: IconWorld, cor: '#4DA3FF' },
}

const CATALOGO = {
  ...Object.fromEntries(HABILIDADES.map(({ nome, Icone, cor }) => [nome, { Icone, cor }])),
  ...EXTRAS,
}

export const infoTecnologia = (nome) => CATALOGO[nome] ?? { Icone: IconCode, cor: '#9EA3AD' }