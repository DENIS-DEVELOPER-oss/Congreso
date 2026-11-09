// Portada: accesos al registro y al Aula virtual (sesiones, resúmenes y certificados).
// Conserva los id #inscripcion y #certificados para que los enlaces antiguos sigan llegando aquí.
import { ArrowRight, Check, ClipboardList, KeyRound } from 'lucide-react'
import { evento } from '../data/evento.js'
import { RUTAS } from '../lib/rutas.js'
import { TituloSeccion } from './Andino.jsx'
import { Inclinable } from './Efectos.jsx'
import Reveal from './Reveal.jsx'

const PASOS = ['Regístrate con tus datos', 'Recibe al instante tu acceso al aula', 'Únete por Zoom desde donde estés']

export default function Accesos() {
  return (
    <section id="inscripcion" className="seccion trama-clara bg-crema">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Participa"
          titulo="Inscripción y Aula virtual"
          descripcion="Regístrese en la página y recibirá al instante, por correo, su acceso al Aula virtual: ahí realizará el resto de trámites y se unirá a las sesiones por Zoom."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <Inclinable max={4} as="div" className="tarjeta h-full p-7 sm:p-10">
              <div className="absolute -right-24 -bottom-24 -z-10 h-72 w-72 rounded-full bg-azul/10 blur-3xl" aria-hidden="true" />
              <span className="tarjeta-icono">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-4xl font-semibold text-oscuro sm:text-5xl">Inscripción</h3>
              <p className="mt-3 max-w-lg leading-relaxed text-slate-600">
                Asegura tu lugar en el congreso del {evento.fechasTexto}. Inscripción gratuita, con certificado y acceso a todas las actividades.
              </p>
              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {PASOS.map((p, i) => (
                  <li key={p} className="flex items-center gap-3 rounded-lg bg-crema px-4 py-3 text-sm text-slate-700 sm:flex-col sm:items-start sm:gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rojizo-oscuro font-display text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={RUTAS.inscripcion} className="group btn-primario">
                  Registrarme
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </Inclinable>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-2">
            <div id="certificados" className="tarjeta flex h-full scroll-mt-24 flex-col p-7 sm:p-10">
              <span className="tarjeta-icono">
                <KeyRound className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-4xl font-semibold text-oscuro sm:text-5xl">Aula virtual</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Ingresa con tu DNI o tu correo y la contraseña que recibiste al registrarte.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {['Únete a las sesiones por Zoom', 'Envía tus resúmenes', 'Descarga tu certificado'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a href={RUTAS.cuenta} className="group btn-secundario">
                  Ingresar al aula
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
