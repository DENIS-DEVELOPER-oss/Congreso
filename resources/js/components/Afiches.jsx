// Galería de afiches oficiales: miniaturas que se abren en grande, con descarga
import { useState } from 'react'
import { Download, Expand } from 'lucide-react'
import { afiches } from '../data/afiches.js'
import { TituloSeccion } from './Andino.jsx'
import Modal from './Modal.jsx'
import Reveal from './Reveal.jsx'

// Botón con la miniatura de un afiche; lo usan también Ponentes y Convocatoria
export function MiniaturaAfiche({ afiche, onAbrir, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onAbrir(afiche)}
      className={`group relative block w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_20px_45px_-28px_rgb(15_23_42/0.5)] ring-1 ring-slate-200 transition duration-500 hover:-translate-y-1 hover:ring-rojizo-oscuro/40 ${className}`}
      aria-label={`Ver en grande: ${afiche.titulo}`}
    >
      <img src={afiche.src} alt="" loading="lazy" className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rojizo-oscuro opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100">
        <Expand className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  )
}

// Visor del afiche en grande
export function VisorAfiche({ afiche, onCerrar }) {
  return (
    <Modal abierto={!!afiche} onCerrar={onCerrar} titulo={afiche?.titulo ?? ''} ancho="max-w-5xl">
      {afiche && (
        <>
          <img src={afiche.src} alt={`${afiche.titulo}: ${afiche.texto}`} className="w-full rounded-lg" />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">{afiche.texto}</p>
            <a href={afiche.src} download className="btn-primario shrink-0">
              <Download className="h-4 w-4" aria-hidden="true" /> Descargar afiche
            </a>
          </div>
        </>
      )}
    </Modal>
  )
}

export default function Afiches() {
  const [abierto, setAbierto] = useState(null)
  return (
    <section id="afiches" className="seccion">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Difusión"
          titulo="Afiches oficiales"
          descripcion="Compártelos en tus redes, grupos y con tu institución. Selecciona uno para verlo en grande y descargarlo."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {afiches.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 2) * 100}>
              <MiniaturaAfiche afiche={a} onAbrir={setAbierto} />
              <p className="mt-3 font-display text-lg font-bold text-oscuro">{a.titulo}</p>
              <p className="text-sm text-slate-600">{a.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
      <VisorAfiche afiche={abierto} onCerrar={() => setAbierto(null)} />
    </section>
  )
}
