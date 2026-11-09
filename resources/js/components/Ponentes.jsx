import { useState } from 'react'
import { Building2, Image, MapPin, Mic, Presentation } from 'lucide-react'
import { ponentes as ponentesLocales } from '../data/ponentes.js'
import { afiche } from '../data/afiches.js'
import { VisorAfiche } from './Afiches.jsx'
import { TituloSeccion } from './Andino.jsx'
import { CarruselTarjetas } from './Carrusel.jsx'
import Modal from './Modal.jsx'
import Reveal from './Reveal.jsx'
import { Inclinable } from './Efectos.jsx'

function iniciales(nombre) {
  return nombre
    .replace(/^(Dra?|Mg|Lic|Mtro|Mtra|Antrop)\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

function Foto({ ponente, className = '' }) {
  if (ponente.foto) {
    return (
      <img
        src={ponente.foto}
        alt={`Fotografía de ${ponente.nombre}`}
        loading="lazy"
        className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${className}`}
      />
    )
  }
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center bg-linear-to-br from-[#18233a] via-[#1f2d45] to-[#2c3d57] transition duration-700 group-hover:scale-105 ${className}`}
      role="img"
      aria-label={`Foto de ${ponente.nombre} (no disponible)`}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 font-display text-2xl font-semibold text-white/90 outline-1 outline-offset-4 outline-naranja/35 sm:h-24 sm:w-24 sm:text-4xl sm:outline-offset-[6px]"
        aria-hidden="true"
      >
        {iniciales(ponente.nombre)}
      </span>
    </div>
  )
}

function PerfilPonente({ ponente }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
      <div className="aspect-[4/5] overflow-hidden rounded-lg">
        <Foto ponente={ponente} />
      </div>
      <div>
        {ponente.magistral && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rojizo/10 px-3 py-1 text-xs font-bold text-rojizo-oscuro">
            <Mic className="h-3.5 w-3.5" aria-hidden="true" /> Conferencista magistral
          </span>
        )}
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" /> {ponente.institucion}
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" /> {ponente.pais}
        </p>
        {ponente.ponencia && (
          <div className="mt-5 rounded-md bg-crema p-4">
            <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
              <Presentation className="h-4 w-4" aria-hidden="true" /> Ponencia
            </p>
            <p className="mt-1 font-display font-bold">{ponente.ponencia}</p>
          </div>
        )}
        {ponente.bio && <p className="mt-5 leading-relaxed text-slate-700">{ponente.bio}</p>}
      </div>
    </div>
  )
}

export default function Ponentes() {
  const ponentes = ponentesLocales
  const [seleccionado, setSeleccionado] = useState(null)
  const [verAfiche, setVerAfiche] = useState(false)

  return (
    <section id="ponentes" className="seccion bg-white">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Conferencistas"
          accion={{ texto: 'Ver el programa', href: '#programa' }}
          titulo="Ponentes centrales"
          descripcion="Investigadores, docentes y sabios originarios de Argentina, México y el Perú. Seleccione un nombre para ver su reseña."
        />

        <Reveal>
          <CarruselTarjetas etiqueta="Ponentes centrales">
            {ponentes.map((p) => (
              <Inclinable
                key={p.id}
                max={4}
                className="tarjeta group h-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-rojizo-oscuro"
              >
                <div className={`relative overflow-hidden bg-crema ${p.foto ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                  <Foto ponente={p} />
                  {/* Marco de retrato que aparece al pasar el cursor */}
                  <span
                    className="pointer-events-none absolute inset-2 rounded-md border border-white/0 transition duration-500 group-hover:inset-3 group-hover:border-white/80"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-oscuro shadow-sm">
                    <MapPin className="h-3.5 w-3.5 text-rojizo-oscuro" aria-hidden="true" />
                    {p.pais}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-xl leading-snug font-semibold text-oscuro">
                    {/* El botón cubre toda la tarjeta (after:inset-0) */}
                    <button type="button" onClick={() => setSeleccionado(p)} className="text-left after:absolute after:inset-0 focus-visible:outline-none">
                      {p.nombre}
                      <span className="sr-only">: ver perfil</span>
                    </button>
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <span>{p.institucion}</span>
                  </p>
                  <p className="mt-3 text-xs font-semibold text-rojizo-oscuro transition group-hover:underline" aria-hidden="true">
                    Ver perfil →
                  </p>
                </div>
              </Inclinable>
            ))}
          </CarruselTarjetas>
        </Reveal>
        <Reveal className="mt-8 flex justify-center">
          <button type="button" onClick={() => setVerAfiche(true)} className="btn-secundario">
            <Image className="h-4 w-4" aria-hidden="true" /> Ver el afiche de ponentes
          </button>
        </Reveal>
      </div>
      <VisorAfiche afiche={verAfiche ? afiche('ponentes') : null} onCerrar={() => setVerAfiche(false)} />

      <Modal abierto={!!seleccionado} onCerrar={() => setSeleccionado(null)} titulo={seleccionado?.nombre ?? ''}>
        {seleccionado && <PerfilPonente ponente={seleccionado} />}
      </Modal>
    </section>
  )
}
