// Banda oscura de llamada a la acción, antes de las preguntas frecuentes
import { ArrowRight, Video } from 'lucide-react'
import { evento } from '../data/evento.js'
import { RUTAS } from '../lib/rutas.js'
import Reveal from './Reveal.jsx'

export default function Llamado() {
  return (
    <section aria-labelledby="titulo-llamado" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Reveal className="contenedor">
        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#081a4d] via-[#163a9e] to-[#1e3a8a] px-6 py-12 text-white shadow-elevada sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-14">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-naranja/25 blur-3xl" />
          </div>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-naranja uppercase ring-1 ring-white/15">
              <Video className="h-3.5 w-3.5" aria-hidden="true" /> {evento.modalidad} · {evento.fechasTexto}
            </p>
            <h2 id="titulo-llamado" className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">
              Participa en Puno o desde cualquier lugar del mundo
            </h2>
            <p className="mt-3 text-white/75">
              {evento.inscripcionesAbiertas
                ? 'La inscripción es gratuita: regístrate en dos minutos y recibe al instante tu acceso al Aula virtual, con el programa y los enlaces de Google Meet.'
                : 'La inscripción es gratuita: solicítala por WhatsApp o correo y te enviaremos tu acceso al Aula virtual, con el programa y los enlaces de Google Meet.'}
            </p>
          </div>
          <div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0">
            <a href={RUTAS.inscripcion} className="group btn bg-naranja text-[#081a4d] hover:-translate-y-0.5 hover:bg-[#fcd34d]">
              {evento.inscripcionesAbiertas ? 'Registrarme ahora' : 'Solicitar inscripción'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={RUTAS.cuenta} className="btn border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10">
              Ingresar al aula
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
