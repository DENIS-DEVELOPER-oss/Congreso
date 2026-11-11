// Franja azul bajo la portada, como el pie de los afiches: sede, fecha, inscripción gratuita y países de los ponentes,
// y debajo las cifras del congreso
import { CalendarDays, Globe2, Layers, MapPin, Mic, Tag } from 'lucide-react'
import { evento } from '../data/evento.js'
import { ejes as ejesLocales } from '../data/ejes.js'
import { ponentes } from '../data/ponentes.js'
import { useDatos } from '../hooks/useDatos.js'
import Banderas from './Banderas.jsx'
import Reveal from './Reveal.jsx'
import Temporizador from './Temporizador.jsx'

export default function Cifras() {
  const ejes = useDatos('/api/ejes', ejesLocales)
  // Perú primero, como en los afiches
  const paises = [...new Set(ponentes.map((p) => p.pais))].sort((a, b) => (b === 'Perú') - (a === 'Perú'))
  const cifras = [
    { Icono: Mic, numero: ponentes.length, texto: 'ponentes centrales' },
    { Icono: Globe2, numero: paises.length, texto: paises.length === 1 ? 'país representado' : 'países representados' },
    { Icono: CalendarDays, numero: 2, texto: 'días de conferencias y mesas' },
    { Icono: Layers, numero: ejes.length, texto: 'ejes temáticos' },
  ]

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

        <ul className="grid grid-cols-1 gap-3 py-8 min-[380px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {cifras.map(({ Icono, numero, texto }, i) => (
            <Reveal as="li" key={texto} delay={i * 80}>
              <div className="tarjeta-oscura group flex h-full items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-naranja/15 text-naranja ring-1 ring-naranja/25 transition group-hover:bg-naranja group-hover:text-[#0b1f5c] sm:h-12 sm:w-12">
                  <Icono className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-3xl leading-none font-extrabold text-white sm:text-4xl">{numero}</span>
                  <span className="mt-1 block text-xs leading-snug text-white/75 sm:text-sm">{texto}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
