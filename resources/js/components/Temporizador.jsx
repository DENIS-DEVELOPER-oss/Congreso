// Cuenta regresiva hasta la inauguración (hora de Perú, evento.fechaInicio), con formato de «boleto»:
// la fecha en un bloque dorado y las cifras en un solo panel. Durante el congreso muestra «En curso»
// y, al terminar, un agradecimiento. Se dibuja solo en el navegador: el primer render no muestra números.
import { useEffect, useState } from 'react'
import { CalendarPlus, Radio } from 'lucide-react'
import { evento } from '../data/evento.js'
import { descargarIcs, urlGoogleCalendar } from '../lib/calendario.js'

const INICIO = new Date(evento.fechaInicio).getTime()
const FIN = new Date(evento.fechaFin).getTime()

// Fecha y hora de inicio en Perú, para el bloque dorado: 26 · NOV · 2026 · jueves · 8:00 a. m.
const enLima = (opciones) => new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', ...opciones }).format(INICIO)
const FECHA = {
  dia: enLima({ day: 'numeric' }),
  mes: enLima({ month: 'short' }).replace('.', '').toUpperCase(),
  anio: enLima({ year: 'numeric' }),
  semana: enLima({ weekday: 'long' }).replace(/^./, (c) => c.toUpperCase()),
  hora: enLima({ hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?a\.?\s?m\.?/i, ' a. m.').replace(/\s?p\.?\s?m\.?/i, ' p. m.'),
}

function partes(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [
    { valor: Math.floor(s / 86400), maximo: 30, unidad: 'Días', una: 'Día' },
    { valor: Math.floor((s % 86400) / 3600), maximo: 24, unidad: 'Horas', una: 'Hora' },
    { valor: Math.floor((s % 3600) / 60), maximo: 60, unidad: 'Minutos', una: 'Minuto' },
    { valor: s % 60, maximo: 60, unidad: 'Segundos', una: 'Segundo' },
  ]
}

function useAhora() {
  const [ahora, setAhora] = useState(null)
  useEffect(() => {
    setAhora(Date.now())
    const t = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return ahora
}

// Bloque dorado con la fecha, como el talón de un boleto
function BloqueFecha() {
  return (
    <div className="flex items-center justify-center gap-4 bg-naranja px-6 py-4 text-[#0b1f5c] sm:flex-col sm:gap-0 sm:px-8 sm:py-6">
      <span className="font-display text-5xl leading-none font-extrabold tabular-nums sm:text-6xl">{FECHA.dia}</span>
      <span className="flex flex-col sm:items-center">
        <span className="font-display text-lg leading-tight font-extrabold tracking-[0.2em] sm:mt-1">
          {FECHA.mes} · {FECHA.anio}
        </span>
        <span className="text-xs font-semibold opacity-80 sm:mt-1">
          {FECHA.semana} · {FECHA.hora}
        </span>
      </span>
    </div>
  )
}

// Anillo de 60 marcas: las doradas muestran lo que queda de cada unidad (como un reloj)
const MARCAS = 60
function Anillo({ valor, maximo, unidad, una }) {
  const activas = valor === null ? 0 : Math.round((Math.min(valor, maximo) / maximo) * MARCAS)
  return (
    <div className="flex w-full max-w-[7.5rem] flex-col items-center">
    <div className="relative aspect-square w-full">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        {Array.from({ length: MARCAS }, (_, i) => {
          const angulo = (i / MARCAS) * 2 * Math.PI
          const [cos, sin] = [Math.cos(angulo), Math.sin(angulo)]
          return (
            <line
              key={i}
              x1={50 + 41 * cos}
              y1={50 + 41 * sin}
              x2={50 + 48 * cos}
              y2={50 + 48 * sin}
              strokeWidth={i % 5 === 0 ? 2.6 : 1.8}
              strokeLinecap="round"
              className={`transition-colors duration-500 ${i < activas ? 'stroke-naranja' : 'stroke-white/15'}`}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl leading-none font-extrabold text-white tabular-nums min-[380px]:text-3xl sm:text-4xl">
          {valor === null ? '–' : valor}
        </span>
        <span className="mt-1 hidden text-[9px] font-bold tracking-[0.14em] text-white/70 uppercase min-[380px]:block sm:text-[10px]">
          {valor === 1 ? una : unidad}
        </span>
      </div>
    </div>
      {/* En pantallas muy chicas la unidad va debajo del anillo, para no tocar las marcas */}
      <span className="mt-1.5 text-[9px] font-bold tracking-[0.1em] text-white/70 uppercase min-[380px]:hidden">{valor === 1 ? una : unidad}</span>
    </div>
  )
}

export default function Temporizador() {
  const ahora = useAhora()
  const fase = ahora === null || ahora < INICIO ? 'antes' : ahora <= FIN ? 'durante' : 'despues'

  if (fase === 'despues') {
    return (
      <div className="border-b border-white/10 py-7 text-center">
        <p className="font-display text-xl font-extrabold sm:text-2xl">Gracias por participar en el {evento.edicion}</p>
        <p className="mt-1 text-sm text-white/75">Descarga tu certificado desde el Aula virtual.</p>
      </div>
    )
  }

  if (fase === 'durante') {
    return (
      <div className="flex flex-col items-center gap-2 border-b border-white/10 py-7 text-center sm:flex-row sm:justify-center sm:gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold tracking-[0.14em] text-red-300 uppercase ring-1 ring-red-400/30">
          <Radio className="h-4 w-4 animate-pulse" aria-hidden="true" /> En curso
        </span>
        <p className="font-display text-xl font-extrabold sm:text-2xl">El congreso se está realizando ahora</p>
      </div>
    )
  }

  const casillas = ahora === null ? partes(0).map((p) => ({ ...p, valor: null })) : partes(INICIO - ahora)
  const dias = casillas[0].valor

  return (
    <div className="border-b border-white/10 py-8">
      <div className="overflow-hidden rounded-2xl bg-white/[0.05] shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)] ring-1 ring-white/10 sm:flex">
        <BloqueFecha />

        <div className="flex flex-1 flex-col justify-center px-4 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col items-center justify-between gap-1 text-center sm:flex-row sm:text-left">
            <p className="text-xs font-bold tracking-[0.18em] text-naranja uppercase">Faltan para la inauguración</p>
            <p className="text-xs text-white/60">Hora de Perú (UTC−5)</p>
          </div>

          {/* Para lectores de pantalla basta con los días (no se anuncia cada segundo) */}
          <p className="sr-only">{dias === null ? '' : `Faltan ${dias} ${dias === 1 ? 'día' : 'días'} para el inicio del congreso.`}</p>
          <div className="mt-4 grid grid-cols-4 justify-items-center gap-2 sm:gap-5" aria-hidden="true">
            {casillas.map((c) => (
              <Anillo key={c.unidad} {...c} />
            ))}
          </div>
        </div>

        {/* Guardar en la agenda */}
        <div className="flex items-center justify-center gap-2 border-t border-white/10 px-4 py-4 sm:flex-col sm:items-stretch sm:border-t-0 sm:border-l sm:px-6">
          <p className="hidden text-[11px] font-semibold tracking-[0.14em] text-white/60 uppercase sm:block">Agéndalo</p>
          <a
            href={urlGoogleCalendar()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/20 px-2.5 py-2 text-xs font-semibold whitespace-nowrap text-white transition hover:border-naranja hover:text-naranja sm:gap-2 sm:px-3"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Google Calendar
          </a>
          <button
            type="button"
            onClick={descargarIcs}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/20 px-2.5 py-2 text-xs font-semibold whitespace-nowrap text-white transition hover:border-naranja hover:text-naranja sm:gap-2 sm:px-3"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Outlook / Apple
          </button>
        </div>
      </div>
    </div>
  )
}
