// Ejes temáticos oficiales en tarjetas numeradas (descripción opcional)
import { BookOpen, Landmark, Layers, Mountain, Scale, Sprout, TrendingUp, Users } from 'lucide-react'
import { ejes as ejesLocales } from '../data/ejes.js'
import { useDatos } from '../hooks/useDatos.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

// Íconos que se pueden indicar en el campo "icono" del eje; si no tiene, se asigna uno por orden
const ICONOS = { Mountain, BookOpen, Users, Sprout, Scale, TrendingUp, Landmark, Layers }
const POR_ORDEN = [Mountain, BookOpen, Users, Sprout, Scale, TrendingUp, Landmark, Layers]
const COLORES = ['bg-rojizo-oscuro text-white', 'bg-azul text-white', 'bg-naranja text-[#0b1f5c]']

export default function Ejes() {
  const ejes = useDatos('/api/ejes', ejesLocales)
  return (
    <section id="ejes" className="seccion trama-clara bg-crema">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Investigación"
          titulo="Ejes temáticos"
          accion={{ texto: 'Leer la convocatoria', href: '#convocatoria' }}
          descripcion="Las ponencias se reciben en los ejes siguientes. Al enviar su resumen, cada autor indica en cuál se ubica su trabajo."
        />
        {/* Como en el afiche: círculos numerados que alternan azul, azul claro y amarillo */}
        <ol className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {ejes.map((eje, i) => {
            const Icono = ICONOS[eje.icono] ?? POR_ORDEN[i % POR_ORDEN.length]
            return (
              <Reveal as="li" key={eje.id} delay={(i % 2) * 80}>
                <article className="tarjeta group flex h-full items-start gap-4 p-5 sm:gap-5 sm:p-6">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-extrabold shadow-md transition duration-500 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-2xl ${COLORES[i % COLORES.length]}`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-etiqueta text-xs font-bold tracking-[0.14em] text-[#1d4ed8] uppercase">
                      <Icono className="h-4 w-4" aria-hidden="true" /> Eje {i + 1} · Mesa de trabajo {i + 1}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg leading-snug font-bold text-oscuro">{eje.titulo}</h3>
                    {eje.descripcion && (
                      <div className="mt-3 border-t border-slate-200/80 pt-3">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">Subtemas clave</p>
                        <ul className="mt-2 space-y-1.5">
                          {eje.descripcion
                            .split('\n')
                            .filter((x) => x.trim())
                            .map((x) => (
                              <li key={x} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-naranja" aria-hidden="true" />
                                {x}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
