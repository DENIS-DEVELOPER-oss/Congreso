import { useState } from 'react'
import { Mail, Plus } from 'lucide-react'
import { preguntas } from '../data/faq.js'
import { evento } from '../data/evento.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

export default function Preguntas() {
  const [abierta, setAbierta] = useState(0)

  return (
    <section id="preguntas" className="seccion trama-clara bg-crema">
      <div className="contenedor grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <TituloSeccion etiqueta="Ayuda" titulo="Preguntas frecuentes"
        />
          <Reveal className="-mt-6 rounded-lg bg-white p-6 shadow-suave">
            <p className="font-bold">¿No encuentras tu respuesta?</p>
            <p className="mt-1 text-sm text-slate-600">Escríbenos y te responderemos a la brevedad.</p>
            <a href={`mailto:${evento.correo}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-azul-oscuro hover:text-rojizo-oscuro">
              <Mail className="h-4 w-4" aria-hidden="true" /> {evento.correo}
            </a>
          </Reveal>
        </div>

        <ul className="space-y-3 lg:col-span-8">
          {preguntas.map((p, i) => {
            const abierto = abierta === i
            return (
              <Reveal as="li" key={p.pregunta} delay={Math.min(i, 4) * 60}>
                <div className={`rounded-lg border bg-white shadow-suave transition duration-300 ${abierto ? 'border-naranja/40' : 'border-black/5 hover:border-black/10'}`}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-boton-${i}`}
                      aria-expanded={abierto}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setAbierta(abierto ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left font-display font-bold sm:p-6"
                    >
                      {p.pregunta}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                          abierto ? 'rotate-45 bg-rojizo-oscuro text-white' : 'bg-crema text-rojizo-oscuro'
                        }`}
                        aria-hidden="true"
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-boton-${i}`}
                    inert={!abierto}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-6 leading-relaxed text-slate-600 sm:px-6">{p.respuesta}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
