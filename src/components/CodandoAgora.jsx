import { useEffect, useState } from 'react'
import { IconClock, IconDeviceDesktop, IconFolder, IconGitBranch, IconSun } from '@tabler/icons-react'
import { infoLinguagem } from '../data/linguagens'
import useCodandoAgora from '../hooks/useCodandoAgora'
import { useIdioma } from '../idioma/contexto'
import { formatarDuracao, formatarHa, formatarHora } from '../lib/wakatime'
import './CodandoAgora.css'

// Relógio de 30 em 30 s, para o "há 2 min" não ficar parado entre as buscas
function useAgora() {
  const [agora, setAgora] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setAgora(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])
  return agora
}

export default function CodandoAgora() {
  const estado = useCodandoAgora()
  const agora = useAgora()
  const { t, idioma } = useIdioma()
  const locale = idioma === 'en' ? 'en-US' : 'pt-BR'

  // Carregando, erro ou sem token: o cartão não aparece
  if (estado.status !== 'ok') return null

  const { active, last, todaySeconds } = estado.dados
  const nome = last?.isPublic ? last.project : t('codando.privado')

  /* ---------- Parado: uma linha discreta ---------- */
  if (!active) {
    return (
      <section className="codando parado" aria-label={t('codando.rotulo')}>
        <span className="codando-status">
          <span className="codando-ponto" aria-hidden="true" />
          {t('codando.parado')}
        </span>
        <span className="codando-parado-texto">
          {last ? (
            <>
              {t('codando.ultimaAtividade', { quando: formatarHa(last.at, t, agora) })}{' '}
              <strong>{nome}</strong>
              {last.language && ` · ${last.language}`}
            </>
          ) : (
            t('codando.nenhuma')
          )}
          {todaySeconds >= 60 && ` · ${t('codando.hoje', { duracao: formatarDuracao(todaySeconds) })}`}
        </span>
      </section>
    )
  }

  /* ---------- Codando: cartão completo ---------- */
  const { cor } = infoLinguagem(last.language ?? '')
  const sessaoSegundos = (last.at - last.sessionStart) / 1000

  return (
    <section className="codando" aria-label={t('codando.rotulo')} aria-live="polite">
      <div className="codando-topo">
        <span className="codando-status">
          <span className="codando-ponto" aria-hidden="true" />
          {t('codando.rotulo')}
        </span>
        <span className="codando-ha">
          {t('codando.ultimoSinal', { quando: formatarHa(last.at, t, agora) })}
        </span>
      </div>

      <p className="codando-projeto">
        <IconFolder size={18} aria-hidden="true" />
        <strong>{nome}</strong>
        {last.branch && (
          <span className="codando-branch">
            <IconGitBranch size={14} aria-hidden="true" />
            {last.branch}
          </span>
        )}
      </p>

      <ul className="codando-info">
        {last.language && (
          <li>
            <span className="codando-cor" style={{ background: cor }} aria-hidden="true" />
            {last.language}
          </li>
        )}
        {last.editor && (
          <li>
            <IconDeviceDesktop size={14} aria-hidden="true" />
            {last.editor}
          </li>
        )}
        {sessaoSegundos >= 60 && (
          <li>
            <IconClock size={14} aria-hidden="true" />
            {t('codando.sessao', {
              duracao: formatarDuracao(sessaoSegundos),
              hora: formatarHora(last.sessionStart, locale),
            })}
          </li>
        )}
        {last.projectTodaySeconds >= 60 && (
          <li>
            <IconSun size={14} aria-hidden="true" />
            {t('codando.hojeProjeto', { duracao: formatarDuracao(last.projectTodaySeconds) })}
          </li>
        )}
      </ul>
    </section>
  )
}