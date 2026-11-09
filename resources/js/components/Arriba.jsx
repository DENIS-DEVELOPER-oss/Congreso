import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useApartarFlotantes } from '../hooks/useApartarFlotantes.js'

const RADIO = 20
const CIRCUNFERENCIA = 2 * Math.PI * RADIO

// Botón para volver arriba con un anillo que muestra cuánto se ha leído de la página.
// Aparece después de la portada, encima del botón de WhatsApp.
export default function Arriba() {
  const [progreso, setProgreso] = useState(0)
  const [visibleScroll, setVisible] = useState(false)
  const apartar = useApartarFlotantes()
  const visible = visibleScroll && !apartar

  useEffect(() => {
    let raf = 0
    const actualizar = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgreso(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      setVisible(window.scrollY > window.innerHeight * 0.8)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(actualizar)
    }
    actualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Volver al inicio de la página"
      tabIndex={visible ? 0 : -1}
      className={`group fixed right-[22px] bottom-24 z-40 hidden h-11 w-11 sm:flex items-center justify-center rounded-full bg-white text-oscuro shadow-elevada transition duration-500 hover:-translate-y-0.5 sm:right-[30px] sm:bottom-[6.5rem] ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="22" cy="22" r={RADIO} fill="none" strokeWidth="2" className="stroke-slate-200" />
        <circle
          cx="22"
          cy="22"
          r={RADIO}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-rojizo-oscuro"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={CIRCUNFERENCIA * (1 - progreso)}
        />
      </svg>
      <ArrowUp className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
    </button>
  )
}
