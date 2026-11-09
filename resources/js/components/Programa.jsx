import { useRef, useState } from 'react'
import { CalendarX, MapPin, Star, User } from 'lucide-react'
import { programa as programaLocal } from '../data/programa.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'
import { LineaProgreso } from './Efectos.jsx'

const TIPOS = {
  conferencia: { texto: 'Conferencia magistral', corto: 'Conferencias', clase: 'bg-rojizo-oscuro/10 text-rojizo-oscuro ring-rojizo-oscuro/20', punto: 'bg-rojizo-oscuro' },
  mesa: { texto: 'Mesa temática', corto: 'Mesas', clase: 'bg-azul/10 text-azul-oscuro ring-azul/20', punto: 'bg-azul' },
  panel: { texto: 'Panel', corto: 'Paneles', clase: 'bg-slate-100 text-slate-700 ring-slate-200', punto: 'bg-rojizo' },
  cultural: { texto: 'Actividad cultural', corto: 'Cultural', clase: 'bg-slate-100 text-slate-700 ring-slate-200', punto: 'bg-slate-500' },
  campo: { texto: 'Visita de campo', corto: 'Visita de campo', clase: 'bg-slate-100 text-slate-700 ring-slate-200', punto: 'bg-slate-500' },
  general: { texto: 'General', corto: 'Generales', clase: 'bg-white text-slate-600 ring-slate-200', punto: 'bg-slate-300' },
}

const CLAVE_AGENDA = 'congreso-saberes-agenda'
const idActividad = (dia, a) => `${dia.id}|${a.hora}|${a.titulo}`

// "Mi agenda": actividades marcadas por el visitante, guardadas en su navegador
function useAgenda() {
  const [agenda, setAgenda] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(CLAVE_AGENDA) || '[]'))
    } catch {
      return new Set()
    }
  })

  const alternar = (id) =>
    setAgenda((previa) => {
      const nueva = new Set(previa)
      if (nueva.has(id)) nueva.delete(id)
      else nueva.add(id)
      try {
        localStorage.setItem(CLAVE_AGENDA, JSON.stringify([...nueva]))
      } catch {
        /* almacenamiento no disponible (modo privado, etc.) */
      }
      return nueva
    })

  return [agenda, alternar]
}

function Chip({ activo, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
        activo ? 'bg-tierra text-white shadow-suave' : 'bg-white text-slate-600 ring-1 ring-black/10 hover:ring-black/20'
      }`}
    >
      {children}
    </button>
  )
}

export default function Programa() {
  const programa = programaLocal
  const [seleccion, setActivo] = useState(0)
  const [filtro, setFiltro] = useState('todos')
  const [soloAgenda, setSoloAgenda] = useState(false)
  const [agenda, alternarAgenda] = useAgenda()
  const activo = Math.min(seleccion, programa.length - 1)
  const tabsRef = useRef([])

  // Navegación con flechas entre pestañas (patrón ARIA tabs)
  const onKeyDown = (e) => {
    let siguiente = null
    if (e.key === 'ArrowRight') siguiente = (activo + 1) % programa.length
    if (e.key === 'ArrowLeft') siguiente = (activo - 1 + programa.length) % programa.length
    if (e.key === 'Home') siguiente = 0
    if (e.key === 'End') siguiente = programa.length - 1
    if (siguiente !== null) {
      e.preventDefault()
      setActivo(siguiente)
      tabsRef.current[siguiente]?.focus()
    }
  }

  const dia = programa[activo]
  const tiposPresentes = [...new Set(programa.flatMap((d) => d.actividades.map((a) => a.tipo)))].filter((t) => TIPOS[t])
  const enAgenda = (d) => d.actividades.filter((a) => agenda.has(idActividad(d, a))).length
  const totalAgenda = programa.reduce((n, d) => n + enAgenda(d), 0)

  const actividades = dia.actividades.filter(
    (a) => (filtro === 'todos' || a.tipo === filtro) && (!soloAgenda || agenda.has(idActividad(dia, a))),
  )

  return (
    <section id="programa" className="seccion">
      <div className="contenedor">
        <TituloSeccion etiqueta="Agenda" titulo="Programa"
          descripcion="Programa preliminar, sujeto a cambios. Los horarios están en hora de Perú (UTC-5). Puede marcar con una estrella las actividades a las que piensa asistir."
        />

        {/* Control segmentado con indicador deslizante */}
        <Reveal className="mx-auto mb-6 max-w-2xl">
          <div role="tablist" aria-label="Días del congreso" className="relative grid rounded-lg bg-slate-100 p-1.5 ring-1 ring-black/5" style={{ gridTemplateColumns: `repeat(${programa.length}, 1fr)` }}>
            <span
              className="absolute top-1.5 bottom-1.5 left-1.5 rounded-md bg-white shadow-suave ring-1 ring-black/5 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{ width: `calc((100% - 12px) / ${programa.length})`, transform: `translateX(${activo * 100}%)` }}
              aria-hidden="true"
            />
            {programa.map((d, i) => {
              const marcadas = enAgenda(d)
              return (
                <button
                  key={d.id}
                  ref={(el) => (tabsRef.current[i] = el)}
                  role="tab"
                  type="button"
                  id={`tab-${d.id}`}
                  aria-selected={activo === i}
                  aria-controls={`panel-${d.id}`}
                  tabIndex={activo === i ? 0 : -1}
                  onClick={() => setActivo(i)}
                  onKeyDown={onKeyDown}
                  className="relative z-10 rounded-md px-2 py-3 text-center transition-colors"
                >
                  <span className={`block font-display text-sm font-extrabold sm:text-base ${activo === i ? 'text-rojizo-oscuro' : 'text-slate-600'}`}>
                    {d.dia}
                    {marcadas > 0 && (
                      <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-naranja px-1 align-middle text-[11px] text-tierra">
                        <span className="sr-only">, en tu agenda: </span>
                        {marcadas}
                      </span>
                    )}
                  </span>
                  <span className={`block text-xs ${activo === i ? 'text-slate-700' : 'text-slate-500'}`}>
                    <span className="sm:hidden">{d.fecha.replace(/^\S+\s/, '')}</span>
                    <span className="hidden sm:inline">{d.fecha}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Filtros */}
        <Reveal className="-mx-4 mb-10 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-auto sm:max-w-4xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0" role="group" aria-label="Filtrar actividades">
          <Chip activo={filtro === 'todos'} onClick={() => setFiltro('todos')}>
            Todas
          </Chip>
          {tiposPresentes.map((t) => (
            <Chip key={t} activo={filtro === t} onClick={() => setFiltro(t)}>
              <span className={`h-2 w-2 rounded-full ${TIPOS[t].punto}`} aria-hidden="true" />
              {TIPOS[t].corto}
            </Chip>
          ))}
          <Chip activo={soloAgenda} onClick={() => setSoloAgenda((v) => !v)}>
            <Star className={`h-4 w-4 ${soloAgenda ? 'fill-naranja text-naranja' : ''}`} aria-hidden="true" />
            Mi agenda ({totalAgenda})
          </Chip>
        </Reveal>

        <div
          role="tabpanel"
          id={`panel-${dia.id}`}
          aria-labelledby={`tab-${dia.id}`}
          tabIndex={0}
          className="mx-auto max-w-4xl rounded-xl focus-visible:outline-offset-8"
        >
          <p className="sr-only" aria-live="polite">
            {actividades.length} actividades mostradas
          </p>

          {actividades.length === 0 ? (
            <div className="trama-clara flex animate-aparecer flex-col items-center rounded-xl bg-crema px-6 py-14 text-center">
              <CalendarX className="h-10 w-10 text-naranja" aria-hidden="true" />
              <p className="mt-4 font-display text-lg font-bold">
                {soloAgenda ? 'Aún no marcaste actividades para este día' : 'No hay actividades de este tipo este día'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {soloAgenda ? 'Toca la ★ de una actividad para agregarla a tu agenda.' : 'Prueba con otro filtro u otro día.'}
              </p>
            </div>
          ) : (
            <ol key={`${dia.id}-${filtro}-${soloAgenda}`} className="relative">
              <LineaProgreso className="top-8 bottom-8 left-[7px] z-10 w-0.5 rounded-full bg-rojizo-oscuro sm:left-[95px]" />
              {actividades.map((a, i) => {
                const tipo = TIPOS[a.tipo] ?? TIPOS.general
                const primero = i === 0
                const ultimo = i === actividades.length - 1
                const id = idActividad(dia, a)
                const marcada = agenda.has(id)
                return (
                  <li key={id} className="group/fila flex animate-aparecer gap-4 sm:gap-6" style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="hidden w-16 shrink-0 pt-6 text-right sm:block">
                      <time className="font-display text-lg font-extrabold text-oscuro transition-colors duration-300 group-hover/fila:text-rojizo-oscuro">{a.hora}</time>
                    </div>

                    {/* Línea de tiempo */}
                    <div className="relative flex w-4 shrink-0 justify-center" aria-hidden="true">
                      <span className={`absolute w-px bg-slate-200 ${primero ? 'top-8' : 'top-0'} ${ultimo ? 'h-8' : 'bottom-0'}`} />
                      <span className={`relative z-20 mt-[26px] h-3.5 w-3.5 rounded-full border-[3px] border-white ring-1 ring-black/10 transition-transform duration-300 group-hover/fila:scale-125 ${tipo.punto}`} />
                    </div>

                    <div className="min-w-0 flex-1 pb-4">
                      <article
                        className={`tarjeta group p-5 pr-14 sm:p-6 sm:pr-16 ${marcada ? 'border-azul/60 ring-1 ring-azul/30' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => alternarAgenda(id)}
                          aria-pressed={marcada}
                          aria-label={`${marcada ? 'Quitar de' : 'Agregar a'} mi agenda: ${a.titulo}`}
                          className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-md transition ${
                            marcada ? 'bg-naranja/15 text-naranja' : 'text-slate-300 hover:bg-crema hover:text-naranja'
                          }`}
                        >
                          <Star className={`h-5 w-5 transition-transform ${marcada ? 'scale-110 fill-current' : ''}`} />
                        </button>
                        <div className="flex flex-wrap items-center gap-2">
                          <time className="rounded-md bg-tierra px-2 py-0.5 font-display text-xs font-bold text-white sm:hidden">{a.hora}</time>
                          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${tipo.clase}`}>{tipo.texto}</span>
                        </div>
                        <h3 className="mt-3 text-lg leading-snug font-bold text-oscuro transition-colors group-hover:text-rojizo-oscuro">
                          {a.titulo}
                        </h3>
                        <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-600 sm:flex-row sm:gap-6">
                          <span className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            <span className="sr-only">Ponente:</span> {a.ponente}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            <span className="sr-only">Lugar:</span> {a.lugar}
                          </span>
                        </div>
                      </article>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
