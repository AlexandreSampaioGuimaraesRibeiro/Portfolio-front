import { TEXTOS } from './textos'

const buscar = (objeto, caminho) =>
  caminho.split('.').reduce((atual, chave) => (atual == null ? undefined : atual[chave]), objeto)

// t('menu.titulo') ou t('banner.nivel', { n: '02' }). Se faltar em inglês, usa o português.
export function criarT(idioma) {
  return (chave, variaveis) => {
    const valor = buscar(TEXTOS[idioma], chave) ?? buscar(TEXTOS.pt, chave) ?? chave
    if (typeof valor !== 'string' || !variaveis) return valor
    return valor.replace(/\{(\w+)\}/g, (_, nome) => variaveis[nome] ?? `{${nome}}`)
  }
}