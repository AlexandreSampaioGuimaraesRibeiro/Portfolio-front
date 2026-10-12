import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import './index.css'
import TemaProvider from './tema/TemaProvider'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      <App />
    </TemaProvider>
  </StrictMode>,
)