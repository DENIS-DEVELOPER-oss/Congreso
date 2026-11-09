// "Así funciona el congreso": sección oscura que explica la modalidad presencial y virtual
import { ArrowRight, BadgeCheck, Landmark, MonitorPlay, Video } from 'lucide-react'
import { RUTAS } from '../lib/rutas.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

const PASOS = [
  {
    Icono: Landmark,
    titulo: 'Presencial en el campus',
    texto: 'Conferencias y mesas temáticas en el campus de la UNA Puno. Tu asistencia se registra con tu código o tu DNI.',
  },
  {
    Icono: Video,
    titulo: 'Virtual por Google Meet',
    texto: 'Las sesiones se transmiten en vivo. Ingresa con tu nombre completo o el correo de tu inscripción para registrar tu asistencia.',
  },
  {
    Icono: MonitorPlay,
    titulo: 'Aula virtual',
    texto: 'Al registrarte recibes tu usuario y una contraseña temporal. Ahí tienes el programa, los enlaces y el envío de resúmenes.',
  },
  {
    Icono: BadgeCheck,
    titulo: 'Certificado digital',
    texto: 'Con código QR de verificación. Lo descargas desde el aula al cumplir la asistencia mínima.',
  },
]

export default function ComoFunciona() {
  return (
    <section id="modalidad" className="relative isolate overflow-hidden bg-[#081a4d] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* Retícula de puntos y luces suaves */}
        <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-azul/30 blur-3xl" />
        <div className="absolute -right-24 -bottom-40 h-96 w-96 rounded-full bg-naranja/15 blur-3xl" />
      </div>

      <div className="seccion">
        <div className="contenedor">
          <TituloSeccion
            claro
            etiqueta="Presencial y virtual"
            titulo="Así funciona el congreso"
            descripcion="Asiste al campus de la Universidad Nacional del Altiplano o participa en línea desde cualquier lugar. La inscripción es gratuita y todo lo que necesitas está en el Aula virtual."
          />

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map(({ Icono, titulo, texto }, i) => (
              <Reveal as="li" key={titulo} delay={i * 90}>
                <div className="tarjeta-oscura group h-full p-6">
                  <span className="absolute top-5 right-5 font-display text-sm font-bold text-white/25">0{i + 1}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-naranja/15 text-naranja ring-1 ring-naranja/25 transition duration-500 group-hover:bg-naranja group-hover:text-[#081a4d]">
                    <Icono className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold">{titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{texto}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={RUTAS.inscripcion} className="group btn bg-naranja text-[#081a4d] shadow-[0_10px_30px_-10px_rgb(251_191_36/0.6)] hover:-translate-y-0.5 hover:bg-[#fcd34d]">
              Registrarme
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={RUTAS.cuenta} className="btn border border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10">
              Ya tengo usuario: ingresar al aula
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
