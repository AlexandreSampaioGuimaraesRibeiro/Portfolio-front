import { lazy, Suspense } from 'react'
import { Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useIdioma } from '../idioma/contexto'
import useVoltarFechaJanela from '../hooks/useVoltarFechaJanela'
import CarregandoTema from './CarregandoTema'
import './CurriculoModal.css'

// O visualizador (react-pdf + pdf.js) é pesado: só é baixado na primeira vez que o currículo é aberto
const VisualizadorCurriculo = lazy(() => import('./VisualizadorCurriculo'))

export default function CurriculoModal({ aberto, aoFechar }) {
  const { t } = useIdioma()
  const celular = useMediaQuery('(max-width: 640px)')
  useVoltarFechaJanela(aberto, aoFechar) // o voltar do navegador/celular fecha o currículo

  return (
    <Modal
      opened={aberto}
      onClose={aoFechar}
      title={t('curriculo.titulo')}
      size="min(980px, 96vw)"
      fullScreen={celular}
      centered
      padding={0}
      classNames={{ content: 'cv-modal', header: 'cv-modal-topo', title: 'cv-modal-titulo', body: 'cv-modal-corpo', close: 'cv-modal-fechar' }}
    >
      <Suspense fallback={<CarregandoTema />}>
        <VisualizadorCurriculo />
      </Suspense>
    </Modal>
  )
}