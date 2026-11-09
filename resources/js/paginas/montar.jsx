import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import '../lib/analitica.js'

// Monta una página del sitio en el #root de su HTML
export function montar(Pagina) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Pagina />
    </StrictMode>,
  )
}
