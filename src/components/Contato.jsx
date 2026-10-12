import { useState } from 'react'
import { Text, TextInput, Textarea, Title } from '@mantine/core'
import emailjs from '@emailjs/browser'
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconBrandInstagram } from '@tabler/icons-react'
import TelaGame from './TelaGame'
import './Contato.css'

// Troque o e-mail e o usuário do Instagram pelos seus
const contatos = [
  { nome: 'E-mail', href: 'mailto:lexandre.guimaraes@gmail.com', Icone: IconMail },
  { nome: 'GitHub', href: 'https://github.com/AlexandreSampaioGuimaraesRibeiro', Icone: IconBrandGithub },
  { nome: 'LinkedIn', href: 'https://linkedin.com/in/alexandre-sampaio-guimarães-ribeiro-417760410', Icone: IconBrandLinkedin },
  { nome: 'Instagram', href: 'https://www.instagram.com/_alexandresampaio_', Icone: IconBrandInstagram },
]

// Valores vindos do arquivo .env (veja o .env.example)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_DONO = import.meta.env.VITE_EMAILJS_TEMPLATE_DONO
const TEMPLATE_RESPOSTA = import.meta.env.VITE_EMAILJS_TEMPLATE_RESPOSTA
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const VAZIO = { nome: '', email: '', mensagem: '' }
const emailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)

export default function Contato({ onVoltar }) {
  const [campos, setCampos] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [status, setStatus] = useState('parado') // parado | enviando | enviado | erro
  const [isca, setIsca] = useState('') // campo escondido: só robôs preenchem

  const mudar = (campo) => (e) => setCampos((c) => ({ ...c, [campo]: e.target.value }))

  function validar() {
    const novos = {}
    if (!campos.nome.trim()) novos.nome = 'Informe seu nome.'
    if (!emailValido(campos.email.trim())) novos.email = 'Informe um e-mail válido.'
    if (campos.mensagem.trim().length < 10) novos.mensagem = 'Escreva pelo menos 10 caracteres.'
    return novos
  }

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
      // 2) resposta automática para quem escreveu
      await emailjs.send(SERVICE_ID, TEMPLATE_RESPOSTA, params, opcoes)
    } catch {
      console.warn('A mensagem chegou até você, mas a resposta automática falhou.')
    }

    setCampos(VAZIO)
    setStatus('enviado')
  }

  return (
    <TelaGame titulo="Contato" fase="04" onVoltar={onVoltar}>
      <div className="contato-grade">
        <section>
          <Title order={1} className="contato-titulo">Tem uma ideia ou uma vaga? Vamos conversar.</Title>
          <Text c="dimmed" className="contato-texto">
            Procuro uma oportunidade de estágio e adoro conversar sobre projetos. Envie uma mensagem pelo formulário ou escolha um canal.
          </Text>
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
          <p className="jogo-etiqueta">enviar mensagem</p>

          <TextInput label="Seu nome" placeholder="Como posso te chamar?" value={campos.nome} onChange={mudar('nome')} error={erros.nome} maxLength={80} autoComplete="name" classNames={{ input: 'contato-input', label: 'contato-label' }} />
          <TextInput label="Seu e-mail" placeholder="voce@email.com" type="email" value={campos.email} onChange={mudar('email')} error={erros.email} maxLength={120} autoComplete="email" mt="md" classNames={{ input: 'contato-input', label: 'contato-label' }} />
          <Textarea label="Sua mensagem" placeholder="Conte um pouco sobre sua ideia ou projeto..." value={campos.mensagem} onChange={mudar('mensagem')} error={erros.mensagem} maxLength={2000} autosize minRows={5} mt="md" classNames={{ input: 'contato-input', label: 'contato-label' }} />

          <input type="text" name="empresa" className="contato-isca" tabIndex={-1} autoComplete="off" aria-hidden="true" value={isca} onChange={(e) => setIsca(e.target.value)} />

          <button type="submit" className="jogo-botao contato-enviar" disabled={status === 'enviando'}>
            {status === 'enviando' ? 'Enviando...' : 'Enviar mensagem →'}
          </button>

          <p role="status" className={`contato-aviso ${status}`}>
            {status === 'enviado' && 'Mensagem enviada! Você vai receber um e-mail de confirmação. Respondo em até 3 dias úteis. (Se não chegar, verifique a caixa de spam.)'}
            {status === 'erro' && 'Não foi possível enviar agora. Tente de novo ou use um dos canais ao lado.'}
          </p>
        </form>
      </div>
    </TelaGame>
  )
}