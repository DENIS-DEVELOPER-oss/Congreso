// Afiche que aparece al entrar a la portada (una vez por visita). Al tocarlo lleva a Inscripciones;
// se cierra con la X, con Esc o tocando fuera del afiche.
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { RUTAS } from '../lib/rutas.js'

const CLAVE = 'anuncio-inicio-visto'
const RETRASO = 900 // ms: deja ver la portada un instante antes de mostrarlo

function yaVisto() {
  try {
    return sessionStorage.getItem(CLAVE) === '1'
  } catch {
    return false
  }
}

export default function AnuncioInicio() {
  const [abierto, setAbierto] = useState(false)
  const cerrarRef = useRef(null)

  useEffect(() => {
    // No aparece si la persona llegó buscando una sección concreta (/#programa)
    if (yaVisto() || window.location.hash.length > 1) return
    const t = setTimeout(() => setAbierto(true), RETRASO)
    return () => clearTimeout(t)
  }, [])

  const cerrar = () => {
    setAbierto(false)
    try {
      sessionStorage.setItem(CLAVE, '1')
    } catch {
      /* sin almacenamiento: volverá a salir en la próxima visita */
    }
  }

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e) => e.key === 'Escape' && cerrar()
    document.addEventListener('keydown', alTeclear)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = overflow
    }
  }, [abierto])

  if (!abierto) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Afiche del I Congreso Internacional Saberes Andino-Amazónicos"
      className="fixed inset-0 z-[70] flex animate-aparecer items-center justify-center bg-black/55 p-4"
      onClick={(e) => e.target === e.currentTarget && cerrar()}
    >
      <div className="relative">
        <button
          ref={cerrarRef}
          type="button"
          onClick={cerrar}
          aria-label="Cerrar afiche"
          className="absolute -top-3.5 -right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1f5c] text-white shadow-lg ring-2 ring-white transition hover:scale-105 hover:bg-rojizo-oscuro"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {/* Marco blanco alrededor del afiche, como los avisos de las webs universitarias */}
        <a href={RUTAS.inscripcion} onClick={cerrar} className="block rounded-sm bg-white p-2.5 shadow-[0_25px_60px_-15px_rgb(0_0_0/0.6)] sm:p-4">
          <img
            src="/media/afiches/afiche-vertical.jpg"
            width="900"
            height="1314"
            alt="Ponentes centrales del I Congreso Internacional Saberes Andino-Amazónicos: once ponentes de Argentina, México y el Perú. 26 y 27 de noviembre de 2026, Puno, evento presencial. ¡Inscríbete gratis!"
            className="block h-auto max-h-[calc(85dvh-2rem)] w-auto max-w-[calc(100vw-3.5rem)]"
          />
          <span className="sr-only">Ir a la inscripción</span>
        </a>
      </div>
    </div>
  )
}
