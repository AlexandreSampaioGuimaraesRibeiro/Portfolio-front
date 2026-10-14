import { createContext, useContext } from 'react'
import { criarT } from './traduzir'

export const IdiomaContexto = createContext({ idioma: 'pt', mudarIdioma: () => {}, t: criarT('pt') })

export const useIdioma = () => useContext(IdiomaContexto)