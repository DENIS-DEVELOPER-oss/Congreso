import { ArrowUpRight, Headset, Mail, MapPin, MessageCircle } from 'lucide-react'
import { canales, enlaceWhatsApp, evento } from '../data/evento.js'
import { RUTAS } from '../lib/rutas.js'
import { TituloSeccion } from './Andino.jsx'
import { BotonesWhatsApp, EnlacesCorreo } from './Canales.jsx'
import ListaRedes, { hayRedes } from './Redes.jsx'
import Reveal from './Reveal.jsx'

const CONSULTA = 'Hola, tengo una consulta sobre el Congreso Saberes Andino-Amazónicos.'

// Tarjeta de un dato de contacto: ícono, título y su contenido (uno o varios enlaces)
function Dato({ Icono, titulo, nota, children }) {
  return (
    <div className="tarjeta flex items-start gap-5 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-rojizo/10 text-rojizo-oscuro">
        <Icono className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{titulo}</p>
        {nota && <p className="mt-0.5 text-sm text-slate-500">{nota}</p>}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

export default function Contacto() {
  return (
    <section id="contacto" className="seccion">
      <div className="contenedor">
        <TituloSeccion etiqueta="Escríbenos" titulo="Contacto"
          descripcion="Para inscripciones, envío de resúmenes o cualquier consulta, escríbenos por WhatsApp o correo electrónico."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            <Reveal>
              <Dato Icono={MessageCircle} titulo="WhatsApp" nota="Inscripciones, resúmenes y consultas">
                <ul className="space-y-1.5">
                  {canales.whatsapp.map((w) => (
                    <li key={w.numero}>
                      <a href={enlaceWhatsApp(w.numero, CONSULTA)} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-semibold text-oscuro transition hover:text-rojizo-oscuro">
                        {w.texto}
                        <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-rojizo-oscuro" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Dato>
            </Reveal>
            <Reveal delay={100}>
              <Dato Icono={Mail} titulo="Correo electrónico">
                <EnlacesCorreo asunto="Consulta – Congreso Saberes Andino-Amazónicos" />
              </Dato>
            </Reveal>
            <Reveal delay={200}>
              <a href={evento.mapa.enlace} target="_blank" rel="noopener noreferrer" className="group block">
                <Dato Icono={MapPin} titulo="Sede presencial">
                  <span className="inline-flex items-center gap-2 font-semibold text-oscuro transition group-hover:text-rojizo-oscuro">
                    {evento.sede}
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-rojizo-oscuro" aria-hidden="true" />
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">{evento.sedeDireccion}</span>
                </Dato>
              </a>
            </Reveal>

            {hayRedes && (
              <Reveal delay={300} className="rounded-lg border border-black/5 bg-crema p-6">
                <h3 className="font-bold">Síguenos en redes sociales</h3>
                <p className="mt-1 text-sm text-slate-600">Novedades, transmisiones y galería del congreso.</p>
                <ListaRedes className="mt-4" />
              </Reveal>
            )}
          </div>

          <Reveal delay={150} className="lg:col-span-3">
            {/* Ayuda para conectarse: bloque oscuro como acento */}
            <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-[#0b1f5c] p-7 text-white shadow-elevada sm:p-10">
              <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-naranja/20 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-azul/40 blur-3xl" />
              </div>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-naranja ring-1 ring-white/15">
                  <Headset className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-3xl font-extrabold">¿Problemas para ingresar al aula?</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-white/75">
                  Te ayudamos a recuperar tu contraseña, consultar el programa o enviar tu resumen. Respondemos por WhatsApp y correo durante los días del congreso.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  {['¿No te llegó el correo? Revisa spam o pide una contraseña nueva en el aula.', 'En la sede, tu asistencia se registra con tu código o tu DNI.', 'Ten a la mano tu DNI: es tu usuario.'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-naranja" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BotonesWhatsApp mensaje="Hola, necesito ayuda con el Aula virtual del Congreso Saberes Andino-Amazónicos." segundo="oscuro" className="sm:flex-nowrap" />
                <a href={RUTAS.cuenta} className="btn border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10">
                  Ir al Aula virtual
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Mapa de la sede presencial */}
        <Reveal className="mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-suave">
            <iframe
              src={evento.mapa.embed}
              title={`Mapa: ${evento.sede}, ${evento.ciudad}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full border-0 sm:h-96"
            />
            <div className="flex flex-col gap-3 border-t border-black/5 p-5 sm:absolute sm:bottom-4 sm:left-4 sm:max-w-sm sm:rounded-xl sm:border sm:bg-white/95 sm:shadow-elevada sm:backdrop-blur">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rojizo-oscuro" aria-hidden="true" />
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">Sede presencial</span>
                  <span className="block font-bold text-oscuro">{evento.sede}</span>
                  <span className="block text-sm text-slate-600">{evento.sedeDireccion}</span>
                </span>
              </p>
              <a href={evento.mapa.enlace} target="_blank" rel="noopener noreferrer" className="btn-primario self-start">
                Cómo llegar <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
