// Franja azul bajo la portada, como el pie de los afiches: sede, fecha, inscripción gratuita y países de los ponentes,
// y debajo la cuenta regresiva hasta la inauguración
import { CalendarDays, MapPin, Tag } from 'lucide-react'
import { evento } from '../data/evento.js'
import { ponentes } from '../data/ponentes.js'
import Banderas from './Banderas.jsx'
import Temporizador from './Temporizador.jsx'

export default function Cifras() {
  // Perú primero, como en los afiches
  const paises = [...new Set(ponentes.map((p) => p.pais))].sort((a, b) => (b === 'Perú') - (a === 'Perú'))

  return (
    <section aria-label="Datos del congreso" className="relative isolate overflow-hidden bg-[#0b1f5c] text-white">
      {/* Línea superior amarilla, como en los afiches */}
      <span className="block h-1 bg-linear-to-r from-naranja via-[#f59e0b] to-naranja" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-24 left-1/4 h-56 w-96 rounded-full bg-azul/30 blur-3xl" />
        <div className="absolute -bottom-24 right-1/5 h-56 w-80 rounded-full bg-naranja/10 blur-3xl" />
      </div>

      <div className="contenedor px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 py-6 text-sm font-semibold sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-5 w-5 text-white/80" aria-hidden="true" /> {evento.sede}, Perú
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-white/80" aria-hidden="true" /> {evento.fechasTexto}
          </span>
          {evento.inscripcionGratuita !== false && (
            <span className="inline-flex items-center gap-2 text-naranja">
              <Tag className="h-5 w-5" aria-hidden="true" /> Inscripción gratuita
            </span>
          )}
          <span className="inline-flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.14em] text-white/70 uppercase">Ponentes de</span>
            <Banderas paises={paises} />
          </span>
        </div>

        <Temporizador />
      </div>
    </section>
  )
}
