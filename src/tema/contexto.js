import { createContext, useContext } from 'react'

export const TemaContexto = createContext({ tema: 'escuro', mudarTema: () => {} })

export const useTema = () => useContext(TemaContexto)