import { useState } from 'react'
import { Text, TextInput, Textarea, Title } from '@mantine/core'
import emailjs from '@emailjs/browser'
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconBrandInstagram } from '@tabler/icons-react'
import TelaGame from './TelaGame'
import { useIdioma } from '../idioma/contexto'
import './Contato.css'

// Troque o e-mail e o usuário do Instagram pelos seus
const contatos = [
  { nome: 'E-mail', href: 'mailto:lexandre.guimaraes@gmail.com', Icone: IconMail },
  { nome: 'GitHub', href: 'https://github.com/AlexandreSampaioGuimaraesRibeiro', Icone: IconBrandGithub },
  { nome: 'LinkedIn', href: 'https://linkedin.com/in/alexandre-sampaio-guimarães-ribeiro-417760410', Icone: IconBrandLinkedin },
  { nome: 'Instagram', href: 'https://instagram.com/seu_usuario', Icone: IconBrandInstagram },
]

// Valores vindos do arquivo .env (veja o .env.example)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_DONO = import.meta.env.VITE_EMAILJS_TEMPLATE_DONO
const TEMPLATE_RESPOSTA = import.meta.env.VITE_EMAILJS_TEMPLATE_RESPOSTA
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const VAZIO = { nome: '', email: '', mensagem: '' }
const emailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)

export default function Contato({ onVoltar }) {
  const { t } = useIdioma()
  const [campos, setCampos] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [status, setStatus] = useState('parado') // parado | enviando | enviado | erro
  const [isca, setIsca] = useState('') // campo escondido: só robôs preenchem

  const mudar = (campo) => (e) => setCampos((c) => ({ ...c, [campo]: e.target.value }))

  // Guardamos a chave do erro (não o texto), assim a mensagem acompanha o idioma
  function validar() {
    const novos = {}
    if (!campos.nome.trim()) novos.nome = 'nome'
    if (!emailValido(campos.email.trim())) novos.email = 'email'
    if (campos.mensagem.trim().length < 10) novos.mensagem = 'mensagem'
    return novos
  }
  const erro = (campo) => (erros[campo] ? t(`contato.erros.${erros[campo]}`) : undefined)

  async function enviar(e) {
    e.preventDefault()
    if (status === 'enviando') return

    const novos = validar()
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    if (isca) { // robô: finge que deu certo e não envia nada
      setStatus('enviado')
      return
    }

    setStatus('enviando')
    const params = {
      nome: campos.nome.trim(),
      email: campos.email.trim(),
      mensagem: campos.mensagem.trim(),
    }
    const opcoes = { publicKey: PUBLIC_KEY }

    try {
      // 1) e-mail para você
      await emailjs.send(SERVICE_ID, TEMPLATE_DONO, params, opcoes)
    } catch {
      setStatus('erro')
      return
    }

    try {
      // 2) resposta automática para quem escreveu (o template já é bilíngue)
      await emailjs.send(SERVICE_ID, TEMPLATE_RESPOSTA, params, opcoes)
    } catch {
      console.warn('A mensagem chegou até você, mas a resposta automática falhou.')
    }

    setCampos(VAZIO)
    setStatus('enviado')
  }

  const classes = { input: 'contato-input', label: 'contato-label' }

  return (
    <TelaGame titulo={t('contato.tela')} fase="04" onVoltar={onVoltar}>
      <div className="contato-grade">
        <section>
          <Title order={1} className="contato-titulo">{t('contato.titulo')}</Title>
          <Text c="dimmed" className="contato-texto">{t('contato.texto')}</Text>
          <div className="contato-links">
            {contatos.map(({ nome, href, Icone }) => (
              <a
                key={nome}
                className="jogo-botao vazado"
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                <Icone size={18} stroke={2} aria-hidden="true" />
                {nome}
              </a>
            ))}
          </div>
        </section>

        <form className="jogo-cartao contato-form" onSubmit={enviar} noValidate>
          <p className="jogo-etiqueta">{t('contato.etiqueta')}</p>

          <TextInput label={t('contato.nome')} placeholder={t('contato.nomePh')} value={campos.nome} onChange={mudar('nome')} error={erro('nome')} maxLength={80} autoComplete="name" classNames={classes} />
          <TextInput label={t('contato.email')} placeholder={t('contato.emailPh')} type="email" value={campos.email} onChange={mudar('email')} error={erro('email')} maxLength={120} autoComplete="email" mt="md" classNames={classes} />
          <Textarea label={t('contato.mensagem')} placeholder={t('contato.mensagemPh')} value={campos.mensagem} onChange={mudar('mensagem')} error={erro('mensagem')} maxLength={2000} autosize minRows={5} mt="md" classNames={classes} />

          <input type="text" name="empresa" className="contato-isca" tabIndex={-1} autoComplete="off" aria-hidden="true" value={isca} onChange={(e) => setIsca(e.target.value)} />

          <button type="submit" className="jogo-botao contato-enviar" disabled={status === 'enviando'}>
            {status === 'enviando' ? t('contato.enviando') : `${t('contato.enviar')} →`}
          </button>

          <p role="status" className={`contato-aviso ${status}`}>
            {status === 'enviado' && t('contato.ok')}
            {status === 'erro' && t('contato.falha')}
          </p>
        </form>
      </div>
    </TelaGame>
  )
}