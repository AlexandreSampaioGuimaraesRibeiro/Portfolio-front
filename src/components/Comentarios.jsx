import { useState } from 'react'
import { Text, TextInput, Textarea, Title } from '@mantine/core'
import TelaGame from './TelaGame'
import { useIdioma } from '../idioma/contexto'
import useComentarios from '../hooks/useComentarios'
import { enviarComentario, comentariosConfigurado, temLink } from '../lib/comentarios'
import './Comentarios.css'

const MAX_NOME = 60
const MAX_MENSAGEM = 500
const ESPERA_MS = 60_000 // intervalo mínimo entre dois comentários do mesmo navegador
const CHAVE_ULTIMO = 'portfolio-ultimo-comentario'

const enviouHaPouco = () => {
  try {
    return Date.now() - Number(localStorage.getItem(CHAVE_ULTIMO) ?? 0) < ESPERA_MS
  } catch {
    return false
  }
}
const registrarEnvio = () => {
  try {
    localStorage.setItem(CHAVE_ULTIMO, String(Date.now()))
  } catch {
    /* ignora */
  }
}

const inicial = (nome) => [...nome.trim()][0]?.toUpperCase() ?? '?'

export default function Comentarios({ onVoltar }) {
  const { t, idioma } = useIdioma()
  const lista = useComentarios()
  const locale = idioma === 'en' ? 'en-US' : 'pt-BR'

  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [isca, setIsca] = useState('') // campo escondido: só robôs preenchem
  const [erros, setErros] = useState({})
  const [status, setStatus] = useState('parado') // parado | enviando | enviado | erro | espere

  const erro = (campo) => (erros[campo] ? t(`comentarios.erros.${erros[campo]}`) : undefined)

  async function enviar(e) {
    e.preventDefault()
    if (status === 'enviando') return

    const novos = {}
    if (!nome.trim()) novos.nome = 'nome'
    else if (temLink(nome)) novos.nome = 'links'
    if (mensagem.trim().length < 3) novos.mensagem = 'mensagem'
    else if (temLink(mensagem)) novos.mensagem = 'links'
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    if (isca) { // robô: finge que deu certo e não envia nada
      setStatus('enviado')
      return
    }
    if (enviouHaPouco()) {
      setStatus('espere')
      return
    }

    setStatus('enviando')
    try {
      await enviarComentario({ nome: nome.trim(), mensagem: mensagem.trim() })
      registrarEnvio()
      setNome('')
      setMensagem('')
      setStatus('enviado')
      lista.recarregar() // o comentário já aparece na lista
    } catch (falha) {
      console.warn('Comentários:', falha)
      setStatus(falha?.rejeitado ? 'rejeitado' : 'erro')
    }
  }

  const classes = { input: 'contato-input', label: 'contato-label' }

  return (
    <TelaGame titulo={t('comentarios.tela')} fase="04" onVoltar={onVoltar}>
      <div className="com-grade">
        <section>
          <Title order={1} className="contato-titulo">{t('comentarios.titulo')}</Title>
          <Text c="dimmed" className="contato-texto">{t('comentarios.texto')}</Text>

          <form className="jogo-cartao" onSubmit={enviar} noValidate>
            <p className="jogo-etiqueta">{t('comentarios.etiquetaForm')}</p>

            <TextInput label={t('comentarios.nome')} placeholder={t('comentarios.nomePh')} value={nome} onChange={(e) => setNome(e.target.value)} error={erro('nome')} maxLength={MAX_NOME} autoComplete="name" classNames={classes} />
            <Textarea label={t('comentarios.mensagem')} placeholder={t('comentarios.mensagemPh')} value={mensagem} onChange={(e) => setMensagem(e.target.value)} error={erro('mensagem')} maxLength={MAX_MENSAGEM} autosize minRows={4} mt="md" classNames={classes} />
            <p className="com-contador">{t('comentarios.contador', { n: mensagem.length, max: MAX_MENSAGEM })}</p>

            <input type="text" name="site" className="contato-isca" tabIndex={-1} autoComplete="off" aria-hidden="true" value={isca} onChange={(e) => setIsca(e.target.value)} />

            <button type="submit" className="jogo-botao contato-enviar" disabled={status === 'enviando'}>
              {status === 'enviando' ? t('comentarios.enviando') : `${t('comentarios.enviar')} →`}
            </button>

            <p role="status" className={`contato-aviso ${status === 'enviado' ? 'enviado' : status === 'parado' ? '' : 'erro'}`}>
              {status === 'enviado' && t('comentarios.ok')}
              {status === 'erro' && t('comentarios.falha')}
              {status === 'rejeitado' && t('comentarios.rejeitado')}
              {status === 'espere' && t('comentarios.espere')}
            </p>
          </form>
        </section>

        <section>
          <p className="jogo-etiqueta">{t('comentarios.etiquetaLista')}</p>

          {lista.status === 'carregando' && <p className="com-status" role="status">{t('comentarios.carregando')}</p>}
          {lista.status === 'erro' && <p className="com-status erro" role="status">{t('comentarios.erroLista')}</p>}
          {lista.status === 'configurar' && !comentariosConfigurado() && <p className="com-status" role="status">{t('comentarios.configurar')}</p>}
          {lista.status === 'pronto' && lista.itens.length === 0 && <p className="com-status">{t('comentarios.vazio')}</p>}

          <ul className="com-lista">
            {lista.itens.map((c) => (
              <li key={c.id} className="com-item">
                <span className="com-avatar" aria-hidden="true">{inicial(c.nome)}</span>
                <div className="com-corpo">
                  <div className="com-cabeca">
                    <strong className="com-nome">{c.nome}</strong>
                    <time className="com-data" dateTime={c.criado_em}>
                      {new Date(c.criado_em).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                  </div>
                  <p className="com-texto">{c.mensagem}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </TelaGame>
  )
}