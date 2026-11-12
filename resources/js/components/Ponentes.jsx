import { useEffect, useRef, useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, Image, Mic, Presentation } from 'lucide-react'
import { ponentes as ponentesLocales } from '../data/ponentes.js'
import { afiche } from '../data/afiches.js'
import { VisorAfiche } from './Afiches.jsx'
import { TituloSeccion } from './Andino.jsx'
import { useCarrusel } from './Carrusel.jsx'
import Modal from './Modal.jsx'
import Bandera from './Bandera.jsx'
import Reveal from './Reveal.jsx'

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rojizo/10 px-3 py-1 text-xs font-bold tracking-wide text-rojizo-oscuro uppercase">
          <Mic className="h-3.5 w-3.5" aria-hidden="true" /> {ponente.magistral ? 'Conferencista magistral' : 'Ponente central'}
        </span>
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" /> {ponente.institucion}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <Bandera pais={ponente.pais} className="h-[11px] w-4" /> {ponente.pais}
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

// Cuántas tarjetas se ven a cada lado de la central: 2 en pantallas medianas y grandes, 1 en celulares
function useLadosVisibles() {
  const [lados, setLados] = useState(2)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const medir = () => setLados(mq.matches ? 2 : 1)
    medir()
    mq.addEventListener('change', medir)
    return () => mq.removeEventListener('change', medir)
  }, [])
  return lados
}

// Posición de cada tarjeta según su distancia a la central (d = 0): se corre a un lado, se achica,
// gira en perspectiva y queda detrás. Desplazamiento en % del ancho de la tarjeta.
const POSICION = {
  0: { x: 0, escala: 1, giro: 0, z: 0 },
  1: { x: 74, escala: 0.86, giro: 16, z: -120 },
  2: { x: 132, escala: 0.72, giro: 24, z: -240 },
}

// Carrusel en abanico (coverflow): la tarjeta central de frente y las vecinas giradas a los lados.
// Toca una lateral para traerla al centro y la central para ver el perfil; flechas, deslizar y teclado.
function CarruselPonentes({ ponentes, onAbrir }) {
  const total = ponentes.length
  const lados = useLadosVisibles()
  const { actual, ir, siguiente, anterior, contenedor } = useCarrusel({ total, intervalo: 4500 })
  // Un deslizamiento con el dedo no debe contar también como toque (abriría el perfil sin querer)
  const inicioX = useRef(null)
  const deslizo = useRef(false)
  const gestos = {
    onPointerDown: (e) => {
      inicioX.current = e.clientX
      deslizo.current = false
      contenedor.onPointerDown(e)
    },
    onPointerUp: (e) => {
      if (inicioX.current !== null && Math.abs(e.clientX - inicioX.current) > 10) deslizo.current = true
      inicioX.current = null
      contenedor.onPointerUp(e)
    },
    onClickCapture: (e) => {
      if (!deslizo.current) return
      deslizo.current = false
      e.preventDefault()
      e.stopPropagation()
    },
  }

  // Distancia circular: la última tarjeta queda a la izquierda de la primera
  const distancia = (i) => {
    let d = i - actual
    if (d > total / 2) d -= total
    if (d < -total / 2) d += total
    return d
  }

  return (
    <div
      {...contenedor}
      {...gestos}
      role="group"
      aria-roledescription="carrusel"
      aria-label="Ponentes centrales"
      className="relative mx-auto touch-pan-y select-none [--w:min(68vw,250px)] sm:[--w:270px] lg:[--w:300px] xl:[--w:320px]"
    >
      <p className="sr-only" aria-live="polite">
        Ponente {actual + 1} de {total}: {ponentes[actual]?.nombre}
      </p>

      {/* Escenario con perspectiva: alto de una tarjeta (3:4) y un margen para la sombra */}
      <div className="relative h-[calc(var(--w)*4/3+2.5rem)] overflow-hidden [perspective:1400px] md:overflow-visible">
        {ponentes.map((p, i) => {
          const d = distancia(i)
          const lejos = Math.abs(d)
          const visible = lejos <= lados
          const pos = POSICION[Math.min(lejos, 2)]
          const lado = Math.sign(d)
          const central = d === 0
          return (
            <button
              key={p.id}
              type="button"
              tabIndex={visible ? 0 : -1}
              aria-hidden={visible ? undefined : true}
              onClick={() => (central ? onAbrir(p) : ir(i))}
              aria-label={central ? `${p.nombre}: ver perfil` : `Mostrar a ${p.nombre}`}
              style={{
                transform: `translateX(${lado * pos.x}%) translateZ(${pos.z}px) rotateY(${-lado * pos.giro}deg) scale(${pos.escala})`,
                zIndex: 20 - lejos,
                opacity: visible ? 1 : 0,
              }}
              className={`group absolute top-4 left-[calc(50%-var(--w)/2)] aspect-[3/4] w-[var(--w)] overflow-hidden rounded-2xl bg-[#0b1f5c] text-left shadow-[0_30px_60px_-30px_rgb(11_31_92/0.65)] ring-1 ring-black/5 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)] focus-visible:ring-4 focus-visible:ring-naranja/70 focus-visible:outline-none motion-reduce:transition-none ${
                central ? 'cursor-zoom-in' : 'cursor-pointer brightness-[0.82] hover:brightness-95'
              } ${visible ? '' : 'pointer-events-none'}`}
            >
              <Foto ponente={p} />

              {/* Etiqueta superior, como en las publicaciones de redes */}
              <span className="absolute top-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2.5 rounded-full bg-white/95 py-1 pr-4 pl-1 shadow-[0_6px_18px_-8px_rgb(15_23_42/0.45)] ring-1 ring-black/5 backdrop-blur-sm">
                <img src="/insignias/web/congreso.png" alt="" className="h-8 w-8 shrink-0" />
                <span className="min-w-0 leading-none">
                  <span className="block truncate text-[9.5px] font-bold tracking-[0.14em] text-[#1e3a8a] uppercase">
                    {p.magistral ? 'Conferencista magistral' : 'Ponente central'}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                    <Bandera pais={p.pais} className="h-[9px] w-[13.5px]" />
                    {p.pais}
                  </span>
                </span>
              </span>

              {/* Nombre e institución sobre un degradado */}
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0b1f5c] via-[#0b1f5c]/80 to-transparent px-4 pt-16 pb-4 sm:px-5 sm:pb-5">
                <span className="mb-2 block h-0.5 w-8 rounded-full bg-naranja transition-all duration-500 group-hover:w-14" aria-hidden="true" />
                <span className="block font-display text-lg leading-tight font-bold text-white sm:text-xl">{p.nombre}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-snug text-white/80 sm:text-sm">{p.institucion}</span>
                <span
                  className={`mt-3 inline-flex items-center gap-1 text-xs font-bold text-naranja transition-all duration-500 ${central ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden="true"
                >
                  Ver perfil →
                </span>
              </span>
            </button>
          )
        })}

        {/* Flechas sobre las tarjetas laterales */}
        {[
          [anterior, ChevronLeft, 'Ponente anterior', 'left-1 md:left-[calc(50%-var(--w)*1.3)]'],
          [siguiente, ChevronRight, 'Ponente siguiente', 'right-1 md:right-[calc(50%-var(--w)*1.3)]'],
        ].map(([accion, Icono, etiqueta, lugar]) => (
          <button
            key={etiqueta}
            type="button"
            onClick={accion}
            aria-label={etiqueta}
            className={`absolute top-[calc(1rem+var(--w)*2/3)] z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-oscuro shadow-[0_8px_24px_-8px_rgb(15_23_42/0.5)] ring-1 ring-black/5 transition hover:scale-110 hover:text-rojizo-oscuro focus-visible:ring-4 focus-visible:ring-naranja/60 focus-visible:outline-none ${lugar}`}
          >
            <Icono className="h-5 w-5" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Posición: puntos y contador */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Elegir ponente">
          {ponentes.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === actual}
              aria-label={p.nombre}
              onClick={() => ir(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === actual ? 'w-7 bg-rojizo-oscuro' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>
        <span className="font-display text-sm font-bold text-slate-500 tabular-nums" aria-hidden="true">
          {String(actual + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
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
          descripcion="Investigadores, docentes y sabios originarios de Argentina, México y el Perú. Toque la tarjeta central para ver su reseña."
        />

        <Reveal>
          {ponentes.length > 0 && <CarruselPonentes ponentes={ponentes} onAbrir={setSeleccionado} />}
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
