import { ArrowUpRight, Headset, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { evento } from '../data/evento.js'
import { RUTAS } from '../lib/rutas.js'
import { TituloSeccion } from './Andino.jsx'
import ListaRedes from './Redes.jsx'
import Reveal from './Reveal.jsx'

export default function Contacto() {
  const datos = [
    { Icono: Mail, titulo: 'Correo electrónico', texto: evento.correo, href: `mailto:${evento.correo}` },
    { Icono: Phone, titulo: 'Teléfono', texto: evento.telefono, href: `tel:${evento.telefono.replace(/\s/g, '')}` },
    {
      Icono: MapPin,
      titulo: 'Sede presencial',
      texto: `${evento.sede} · ${evento.ciudad}`,
      href: 'https://www.google.com/maps/search/?api=1&query=Universidad+Nacional+del+Altiplano+Puno',
      externo: true,
    },
  ]

  return (
    <section id="contacto" className="seccion">
      <div className="contenedor">
        <TituloSeccion etiqueta="Escríbenos" titulo="Contacto"
          descripcion="Para consultas sobre inscripciones, el Aula virtual o el envío de ponencias, escriba a la comisión organizadora."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            {datos.map(({ Icono, titulo, texto, href, externo }, i) => {
              const Contenedor = href ? 'a' : 'div'
              return (
                <Reveal key={titulo} delay={i * 100}>
                  <Contenedor
                    {...(href ? { href, ...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : {})}
                    className="tarjeta group flex items-center gap-5 p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-rojizo/10 text-rojizo-oscuro transition duration-300 group-hover:bg-rojizo-oscuro group-hover:text-white">
                      <Icono className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">{titulo}</span>
                      <span className="mt-0.5 block font-semibold [overflow-wrap:anywhere] text-oscuro">{texto}</span>
                    </span>
                    {href && (
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rojizo-oscuro"
                        aria-hidden="true"
                      />
                    )}
                  </Contenedor>
                </Reveal>
              )
            })}

            <Reveal delay={300} className="rounded-lg border border-black/5 bg-crema p-6">
              <h3 className="font-bold">Síguenos en redes sociales</h3>
              <p className="mt-1 text-sm text-slate-600">Novedades, transmisiones y galería del congreso.</p>
              <ListaRedes className="mt-4" />
            </Reveal>
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
                  Te ayudamos a recuperar tu contraseña, encontrar el enlace de Google Meet o enviar tu resumen. Respondemos por WhatsApp y correo durante los días del congreso.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  {['¿No te llegó el correo? Revisa spam o pide una contraseña nueva en el aula.', 'Ingresa a Google Meet con tu nombre completo para registrar tu asistencia.', 'Ten a la mano tu DNI: es tu usuario.'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-naranja" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`https://wa.me/${evento.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-[#0b1f5c] hover:bg-[#3ee07c]">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> Escribir por WhatsApp
                </a>
                <a href={RUTAS.cuenta} className="btn border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10">
                  Ir al Aula virtual
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
