// Mosaico de fotografías de saberes y rituales del altiplano (debajo de la Presentación).
// Cada foto se mueve lentamente; al tocarla se abre en grande y se puede pasar a la anterior o siguiente.
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { fotoSaber, miniSaber, saberes } from '../data/saberes.js'
import Modal from './Modal.jsx'
import Reveal from './Reveal.jsx'

function VisorSaber({ indice, onCambiar, onCerrar }) {
  const foto = indice === null ? null : saberes[indice]
  const total = saberes.length
  const mover = (paso) => onCambiar((indice + paso + total) % total)

  // Flechas del teclado para pasar de una foto a otra
  useEffect(() => {
    if (indice === null) return
    const alTeclear = (e) => {
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  return (
    <Modal abierto={!!foto} onCerrar={onCerrar} titulo={foto?.titulo ?? ''} ancho="max-w-4xl">
      {foto && (
        <>
          <div className="relative">
            <img src={fotoSaber(foto.id)} alt={`${foto.titulo}. ${foto.texto}`} className="mx-auto block max-h-[60dvh] w-auto max-w-full rounded-lg" />
            {[
              [-1, 'left-2', ChevronLeft, 'Foto anterior'],
              [1, 'right-2', ChevronRight, 'Foto siguiente'],
            ].map(([paso, lado, Icono, etiqueta]) => (
              <button
                key={paso}
                type="button"
                onClick={() => mover(paso)}
                aria-label={etiqueta}
                className={`absolute top-1/2 ${lado} flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-oscuro shadow-lg transition hover:bg-white hover:text-rojizo-oscuro`}
              >
                <Icono className="h-5 w-5" aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-600">{foto.texto}</p>
          <p className="mt-1 text-center text-xs text-slate-400" aria-live="polite">
            {indice + 1} de {total}
          </p>
        </>
      )}
    </Modal>
  )
}

export default function GaleriaSaberes() {
  const [abierta, setAbierta] = useState(null)

  return (
    <div className="mt-16 lg:mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-rojizo-oscuro uppercase">Saberes vivos</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-oscuro sm:text-3xl">Saberes y rituales del altiplano</h3>
        </div>
        <p className="text-sm text-slate-500">Toca una fotografía para verla en grande.</p>
      </div>

      {/* Todas del mismo tamaño y centradas: 4 por fila en computadora, 3 en tablet y 2 en celular */}
      <ul className="flex flex-wrap justify-center gap-3 *:w-[calc((100%-0.75rem)/2)] sm:gap-5 sm:*:w-[calc((100%-2.5rem)/3)] lg:*:w-[calc((100%-3.75rem)/4)]">
        {saberes.map((s, i) => (
          <Reveal as="li" key={s.id} delay={(i % 4) * 110}>
            <button
              type="button"
              onClick={() => setAbierta(i)}
              aria-label={`Ver en grande: ${s.titulo}`}
              className="group relative block w-full rounded-2xl bg-linear-to-br from-naranja via-[#93c5fd] to-[#1d4ed8] p-[2px] text-left shadow-[0_22px_45px_-28px_rgb(15_23_42/0.65)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_32px_60px_-26px_rgb(30_58_138/0.7)] focus-visible:ring-4 focus-visible:ring-naranja/60 focus-visible:outline-none motion-reduce:hover:translate-y-0"
            >
              <span className="relative isolate block aspect-[4/5] overflow-hidden rounded-[14px] bg-[#0b1f5c]">
                <img
                  src={miniSaber(s.id)}
                  srcSet={`${miniSaber(s.id)} 560w, ${fotoSaber(s.id)} 1000w`}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ animationDelay: `-${i * 3}s` }}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110 motion-safe:animate-acercar"
                />
                {/* Destello que cruza la foto al pasar el mouse */}
                <span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:left-[130%] group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#0b1f5c]/80 px-2.5 py-0.5 font-display text-xs font-bold tracking-wider text-naranja ring-1 ring-naranja/40 backdrop-blur-sm" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="absolute top-3 right-3 flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-white/90 text-rojizo-oscuro opacity-0 shadow transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0b1f5c] via-[#0b1f5c]/70 to-transparent px-3 pt-14 pb-3 sm:px-4 sm:pb-4">
                  <span className="mb-1.5 block h-0.5 w-8 origin-left rounded-full bg-naranja transition-all duration-500 group-hover:w-14" aria-hidden="true" />
                  <span className="block font-display text-sm leading-tight font-bold text-white sm:text-base">{s.titulo}</span>
                  {/* La descripción aparece al pasar el mouse (en pantallas táctiles se ve en el visor) */}
                  <span className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                    <span className="overflow-hidden text-xs leading-snug text-white/85 sm:text-sm">
                      <span className="block pt-1">{s.texto}</span>
                    </span>
                  </span>
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <VisorSaber indice={abierta} onCambiar={setAbierta} onCerrar={() => setAbierta(null)} />
    </div>
  )
}
