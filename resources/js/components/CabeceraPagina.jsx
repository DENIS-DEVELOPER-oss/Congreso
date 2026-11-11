// Encabezado oscuro de las páginas internas: ruta de navegación, título, descripción y acciones.
import { CalendarDays, ChevronRight, Video } from 'lucide-react'
import { evento } from '../data/evento.js'
import { FranjaTejida, PatronRombos } from './Andino.jsx'

export default function CabeceraPagina({ titulo, descripcion, children }) {
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-linear-to-br from-[#eaf1ff] via-white to-crema">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <PatronRombos className="text-rojizo-oscuro opacity-[0.035]" />
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-naranja/15 blur-3xl" />
      </div>

      <div className="contenedor px-4 pt-36 pb-12 sm:px-6 sm:pt-40 sm:pb-14 lg:pb-16">
        <nav aria-label="Ruta de navegación">
          <ol className="flex items-center gap-1.5 text-sm text-slate-500">
            <li>
              <a href="/" className="transition hover:text-rojizo-oscuro">
                Inicio
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page" className="font-semibold text-oscuro">
              {titulo}
            </li>
          </ol>
        </nav>

        <h1 className="mt-5 animate-aparecer text-5xl leading-none font-semibold text-oscuro sm:text-6xl">{titulo}</h1>
        <span className="mt-5 flex items-center gap-2" aria-hidden="true">
          <span className="block h-px w-14 bg-naranja" />
          <span className="block h-1.5 w-1.5 rotate-45 bg-naranja" />
          <span className="block h-px w-5 bg-naranja/60" />
        </span>
        {descripcion && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{descripcion}</p>}

        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-rojizo-oscuro" aria-hidden="true" /> {evento.fechasTexto}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Video className="h-4 w-4 text-rojizo-oscuro" aria-hidden="true" /> {evento.modalidad}
          </span>
        </p>

        {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
      </div>
      <FranjaTejida tejer={false} />
    </section>
  )
}
