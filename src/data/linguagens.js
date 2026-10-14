import { FaJava } from 'react-icons/fa'
import {
  SiJavascript, SiTypescript, SiReact, SiPhp, SiLaravel, SiHtml5, SiCss, SiPython,
  SiJson, SiMarkdown, SiC, SiCplusplus, SiGnubash,
} from 'react-icons/si'
import { IconCode, IconDatabase } from '@tabler/icons-react'

// Ícone e cor de cada linguagem (a chave é o nome do WakaTime em minúsculas)
const LINGUAGENS = {
  javascript: { Icone: SiJavascript, cor: '#F7DF1E' },
  jsx: { Icone: SiReact, cor: '#61DAFB' },
  typescript: { Icone: SiTypescript, cor: '#3178C6' },
  tsx: { Icone: SiReact, cor: '#61DAFB' },
  java: { Icone: FaJava, cor: '#ED8B00' },
  php: { Icone: SiPhp, cor: '#777BB4' },
  blade: { Icone: SiLaravel, cor: '#FF2D20' },
  'blade template': { Icone: SiLaravel, cor: '#FF2D20' },
  html: { Icone: SiHtml5, cor: '#E34F26' },
  css: { Icone: SiCss, cor: '#1572B6' },
  python: { Icone: SiPython, cor: '#3776AB' },
  json: { Icone: SiJson, cor: '#CBCB41' },
  markdown: { Icone: SiMarkdown, cor: '#8B93A1' },
  c: { Icone: SiC, cor: '#A8B9CC' },
  'c++': { Icone: SiCplusplus, cor: '#00599C' },
  bash: { Icone: SiGnubash, cor: '#4EAA25' },
  sql: { Icone: IconDatabase, cor: '#4DA3FF' },
}

export const infoLinguagem = (nome) =>
  LINGUAGENS[nome.toLowerCase()] ?? { Icone: IconCode, cor: '#9EA3AD' }