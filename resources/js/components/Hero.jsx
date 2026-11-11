import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, FileText, KeyRound, MailCheck, MapPin, Mic, Pause, Play, UserPlus } from 'lucide-react'
import { descargarIcs, urlGoogleCalendar } from '../lib/calendario.js'
import { evento } from '../data/evento.js'
import { ponentes } from '../data/ponentes.js'
import { modalidades } from '../data/convocatoria.js'
import { afiche } from '../data/afiches.js'
import { VisorAfiche } from './Afiches.jsx'
import { RUTAS } from '../lib/rutas.js'
import { FranjaTejida } from './Andino.jsx'
import { useCarrusel } from './Carrusel.jsx'
import PaisajeHero from './PaisajeHero.jsx'

const INTERVALO = 7000

// Video o foto de Puno detrás del hero (si está configurado en evento.heroMedia)
function MediaHero() {
  const { video, poster } = evento.heroMedia ?? {}
  const [reducir, setReducir] = useState(false)

  useEffect(() => {
    setReducir(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (!video && !poster) return null
  return video && !reducir ? (
    <video className="absolute inset-0 h-full w-full object-cover" src={video} poster={poster ?? undefined} autoPlay muted loop playsInline preload="metadata" />
  ) : (
    poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
  )
}

// Fondo claro: foto o video si están configurados; si no, el paisaje ilustrado del altiplano de día.
// Un velo blanco a la izquierda asegura que el texto oscuro siempre se lea.
function FondoHero() {
  const conMedia = evento.heroMedia?.video || evento.heroMedia?.poster
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {conMedia ? <MediaHero /> : <PaisajeHero className="paralaje absolute inset-0 h-full w-full" />}
      <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/70 to-white/10 lg:via-white/55" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/80 to-transparent" />
    </div>
  )
}

const MESES = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, set: 8, sep: 8, oct: 9, nov: 10, dic: 11 }
const aFecha = (texto) => {
  const [d, m, a] = texto.split(' ')
  return new Date(Number(a), MESES[m.toLowerCase()] ?? 0, Number(d), 23, 59)
}

// ---------- Contenido visual de cada diapositiva (columna derecha) ----------

// Línea de tiempo de fechas importantes; la próxima fecha queda resaltada en dorado
function FechasImportantes() {
  const [hoy, setHoy] = useState(null)
  useEffect(() => setHoy(new Date()), [])
  const proxima = hoy ? evento.fechasImportantes.findIndex((f) => aFecha(f.fecha) >= hoy) : -1

  return (
    <div className="overflow-hidden rounded-2xl border border-white bg-white/85 shadow-[0_30px_60px_-30px_rgb(15_23_42/0.35)] backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crema text-rojizo-oscuro ring-1 ring-naranja/40">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-semibold text-oscuro">Fechas importantes</h2>
      </div>

      <ol className="relative px-6 py-3">
        <span className="absolute top-8 bottom-8 left-[3.25rem] w-px bg-slate-200" aria-hidden="true" />
        {evento.fechasImportantes.map((f, i) => {
          const [dia, mes] = f.fecha.split(' ')
          const activa = i === proxima
          const pasada = hoy !== null && (proxima === -1 || i < proxima)
          return (
            <li key={f.texto} className="relative flex items-center gap-4 py-2.5">
              <span
                className={`relative flex w-14 shrink-0 flex-col items-center rounded-lg py-1.5 ring-1 ${
                  activa ? 'bg-rojizo-oscuro text-white ring-rojizo-oscuro' : 'bg-white text-oscuro ring-slate-200'
                }`}
              >
                <span className="font-display text-2xl leading-none font-semibold">{dia}</span>
                <span className={`mt-0.5 text-[10px] font-bold tracking-wider uppercase ${activa ? 'text-naranja' : 'text-[#1d4ed8]'}`}>{mes}</span>
              </span>
              <span className={`text-[15px] leading-snug ${pasada ? 'text-slate-400' : 'text-slate-700'}`}>
                {f.texto}
                {activa && <span className="mt-0.5 block text-xs font-semibold text-[#1d4ed8]">Próxima fecha</span>}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50/80 px-6 py-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Agregar al calendario:
        </span>
        <a href={urlGoogleCalendar()} target="_blank" rel="noopener noreferrer" className="font-semibold text-azul-oscuro underline underline-offset-4 hover:text-rojizo-oscuro">
          Google
        </a>
        <button type="button" onClick={descargarIcs} className="font-semibold text-azul-oscuro underline underline-offset-4 hover:text-rojizo-oscuro">
          Outlook / Apple
        </button>
      </div>
    </div>
  )
}

// Mosaico de fotos de los ponentes centrales
function MosaicoPonentes() {
  const conFoto = ponentes.filter((p) => p.foto).slice(0, 6)
  const paises = [...new Set(ponentes.map((p) => p.pais))]
  return (
    <div className="relative">
      <ul className="grid grid-cols-3 gap-3">
        {conFoto.map((p, i) => (
          <li
            key={p.id}
            className={`overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_-24px_rgb(15_23_42/0.45)] ring-4 ring-white ${i % 2 ? 'translate-y-5' : ''}`}
          >
            <img src={p.foto} alt={p.nombre} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </li>
        ))}
      </ul>
      <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm whitespace-nowrap text-slate-700 shadow-elevada ring-1 ring-slate-100">
        <Mic className="h-4 w-4 text-rojizo-oscuro" aria-hidden="true" />
        <strong className="font-semibold text-oscuro">{ponentes.length} ponentes centrales</strong>
        <span className="text-slate-400">·</span>
        {paises.join(', ')}
      </div>
    </div>
  )
}

// Modalidad de presentación de la convocatoria
function TarjetaConvocatoria() {
  return (
    <div className="rounded-2xl border border-white bg-white/90 p-7 shadow-[0_30px_60px_-30px_rgb(15_23_42/0.35)] backdrop-blur-xl">
      <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Modalidad de presentación</p>
      <ul className="mt-4 space-y-3">
        {modalidades.map((m) => (
          <li key={m.valor} className="flex gap-4 rounded-xl bg-crema p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-rojizo-oscuro ring-1 ring-naranja/40">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-oscuro">{m.texto}</span>
              <span className="text-sm text-slate-600">{m.detalle}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-slate-600">
        Resumen de 250 palabras con la plantilla oficial. Recepción hasta el <strong className="text-oscuro">15 de noviembre</strong>.
      </p>
    </div>
  )
}

// Pasos para participar (inscripción gratuita)
function TarjetaPasos() {
  const pasos = [
    evento.inscripcionesAbiertas
      ? { Icono: UserPlus, titulo: 'Regístrate', texto: 'Completa el formulario con tus datos y tu categoría.' }
      : { Icono: UserPlus, titulo: 'Solicita tu inscripción', texto: 'Escríbenos por WhatsApp o correo con tus datos.' },
    evento.inscripcionesAbiertas
      ? { Icono: MailCheck, titulo: 'Recibe tu acceso', texto: 'Al instante te llega tu usuario, tu contraseña y el programa.' }
      : { Icono: MailCheck, titulo: 'Recibe tu acceso', texto: 'Te enviamos tu usuario, tu contraseña y el programa.' },
    { Icono: KeyRound, titulo: 'Ingresa al Aula virtual', texto: 'Consulta el programa, envía tu resumen y descarga tu certificado.' },
  ]
  return (
    <ol className="space-y-3">
      {pasos.map(({ Icono, titulo, texto }, i) => (
        <li
          key={titulo}
          className="flex items-center gap-4 rounded-2xl border border-white bg-white/85 p-5 shadow-[0_20px_40px_-26px_rgb(15_23_42/0.4)] backdrop-blur-xl"
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crema text-rojizo-oscuro ring-1 ring-naranja/40">
            <Icono className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rojizo-oscuro text-[11px] font-bold text-white">
              {i + 1}
            </span>
          </span>
          <span>
            <span className="block font-semibold text-oscuro">{titulo}</span>
            <span className="text-sm text-slate-600">{texto}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

// Afiche oficial a la derecha (en celular, debajo del texto); al tocarlo se abre en el visor de la página.
// La imagen se descarga recién cuando su diapositiva está por mostrarse (cargar), no al abrir la portada.
function Afiche({ a, onAbrir, cargar }) {
  return (
    <button
      type="button"
      onClick={() => onAbrir(a)}
      aria-label={`Ver en grande: ${a.titulo}`}
      className="group block w-full overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-28px_rgb(15_23_42/0.5)] ring-1 ring-white transition duration-500 hover:-translate-y-1"
    >
      {cargar ? (
        <img src={a.src} alt="" decoding="async" className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
      ) : (
        <span className="block aspect-video w-full bg-slate-100" />
      )}
    </button>
  )
}

// ---------- Diapositivas ----------
const DIAPOSITIVAS = [
  {
    id: 'congreso',
    etiqueta: 'El congreso',
    Visual: FechasImportantes,
  },
  {
    id: 'afiche-congreso',
    etiqueta: 'Afiche oficial',
    antetitulo: 'Afiche oficial',
    titulo: 'I Congreso Internacional',
    texto: '26 y 27 de noviembre de 2026 en Educación Continua de la UNA Puno, en modalidad presencial. Lo organizan seis instituciones académicas del Perú.',
    botones: [
      { texto: 'Ver el afiche', afiche: afiche('congreso'), principal: true },
      { texto: 'Ver los organizadores', href: '#comites' },
    ],
    afiche: afiche('congreso'),
  },
  {
    id: 'ponentes',
    etiqueta: 'Ponentes',
    antetitulo: 'Ponentes centrales',
    titulo: 'Investigadores y sabios originarios en diálogo',
    texto: 'Conferencias de especialistas de Argentina, México y el Perú sobre saberes andino-amazónicos, interculturalidad y universidad.',
    botones: [
      { texto: 'Conocer a los ponentes', href: '#ponentes', principal: true },
      { texto: 'Ver el programa', href: '#programa' },
    ],
    Visual: MosaicoPonentes,
  },
  {
    id: 'afiche-ponentes',
    etiqueta: 'Afiche ponentes',
    antetitulo: 'Afiche · ponentes centrales',
    titulo: 'Once ponentes de tres países',
    texto: 'Especialistas de Perú, Argentina y México en conferencias centrales y mesas temáticas.',
    botones: [
      { texto: 'Ver el afiche', afiche: afiche('ponentes'), principal: true },
      { texto: 'Conocer a los ponentes', href: '#ponentes' },
    ],
    afiche: afiche('ponentes'),
  },
  {
    id: 'convocatoria',
    etiqueta: 'Convocatoria',
    antetitulo: 'Convocatoria de ponencias',
    titulo: 'Presenta tu investigación',
    texto: 'Envía tu resumen por WhatsApp o correo electrónico hasta el 15 de noviembre. El Comité organizador evaluará cada trabajo.',
    botones: [
      { texto: 'Enviar mi resumen', href: '#convocatoria', principal: true },
      { texto: 'Inscribirme', href: RUTAS.inscripcion },
    ],
    Visual: TarjetaConvocatoria,
  },
  {
    id: 'afiche-ejes',
    etiqueta: 'Afiche ejes',
    antetitulo: 'Afiche · ejes temáticos',
    titulo: 'Seis ejes de diálogo',
    texto: 'Interculturalidad, Buen Vivir, universidad intercultural, descolonización, gestión sostenible y pluriculturalidad.',
    botones: [
      { texto: 'Ver el afiche', afiche: afiche('ejes'), principal: true },
      { texto: 'Ver los ejes', href: '#ejes' },
    ],
    afiche: afiche('ejes'),
  },
  {
    id: 'inscripcion',
    etiqueta: 'Inscripciones',
    antetitulo: 'Inscripción gratuita',
    titulo: 'Asegura tu participación',
    texto: evento.inscripcionesAbiertas
      ? 'Regístrate en dos minutos y participa en Educación Continua de la UNA Puno. Al instante te llega tu acceso al Aula virtual.'
      : 'Solicita tu inscripción gratuita por WhatsApp o correo y participa en Educación Continua de la UNA Puno.',
    botones: [
      { texto: 'Registrarme', href: RUTAS.inscripcion, principal: true },
      { texto: 'Ingresar al aula', href: RUTAS.cuenta },
    ],
    Visual: TarjetaPasos,
  },
]

// Entrada escalonada de la primera carga
const entrada = (ms) => ({ className: 'animate-aparecer', style: { animationDelay: `${ms}ms` } })

// Botones de la portada, con el mismo lenguaje que el botón del menú:
// principal en azul noche con la flecha en un bloque dorado; secundario blanco con borde fino. Misma altura y esquinas.
const claseBoton = (principal) =>
  principal
    ? 'group inline-flex h-14 items-center justify-between gap-5 rounded-lg bg-linear-to-br from-[#0b1f5c] to-[#1e3a8a] pr-2 pl-6 text-[0.9375rem] font-bold whitespace-nowrap text-white shadow-[0_16px_32px_-16px_rgb(11_31_92/0.85)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-16px_rgb(11_31_92/0.9)]'
    : 'group inline-flex h-14 items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white/85 px-6 text-[0.9375rem] font-bold whitespace-nowrap text-[#0b1f5c] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#0b1f5c] hover:bg-white'

function FlechaDorada() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-naranja text-[#0b1f5c] transition group-hover:bg-[#fcd34d]">
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
    </span>
  )
}

// Texto de la primera diapositiva: es el título principal (h1) de la página
function TextoCongreso() {
  return (
    <>
      <p {...entrada(120)}>
        <span className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-[#1d4ed8] uppercase">
          <span className="h-px w-10 bg-naranja" aria-hidden="true" />
          {evento.edicion}
        </span>
      </p>
      <h1 aria-label={evento.nombreCompleto} className="mt-4 text-[2.6rem] leading-[1.02] font-extrabold text-oscuro min-[400px]:text-5xl sm:text-6xl lg:text-[3.3rem] xl:text-[3.85rem]">
        {['Saberes', 'Andino-Amazónicos'].map((linea, i) => (
          <span key={linea} className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
            <span
              className={`block animate-subir ${i === 1 ? 'bg-linear-to-r from-[#1d4ed8] via-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent' : ''}`}
              style={{ animationDelay: `${200 + i * 160}ms` }}
            >
              {linea}
            </span>
          </span>
        ))}
      </h1>
      <div {...entrada(340)}>
        <p className="mt-5 max-w-xl font-display text-xl leading-snug font-semibold text-slate-700 sm:text-2xl">
          y Diálogo Intercultural en la Educación Superior Universitaria
        </p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">«{evento.lema}»</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-medium text-slate-700">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rojizo-oscuro px-3 py-1 text-sm font-semibold text-white">
            <MapPin className="h-4 w-4" aria-hidden="true" /> Presencial
          </span>
          <span>{evento.fechasTexto}</span>
          <span className="h-1 w-1 rounded-full bg-naranja" aria-hidden="true" />
          <span>{evento.sede}</span>
        </p>
      </div>
      <div data-apartar-flotantes className="mt-9 flex animate-aparecer flex-col gap-3 sm:flex-row" style={{ animationDelay: '460ms' }}>
        <a href="#convocatoria" className={claseBoton(true)}>
          Presenta tu ponencia
          <FlechaDorada />
        </a>
        <a href={RUTAS.inscripcion} className={claseBoton(false)}>
          <UserPlus className="h-[18px] w-[18px] text-[#1d4ed8]" aria-hidden="true" /> Inscríbete
        </a>
      </div>
    </>
  )
}

function TextoDiapositiva({ d, onAfiche }) {
  return (
    <>
      <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-[#1d4ed8] uppercase">
        <span className="h-px w-10 bg-naranja" aria-hidden="true" />
        {d.antetitulo}
      </p>
      <h2
        className={`mt-4 max-w-2xl leading-[1.05] font-extrabold text-oscuro ${d.afiche ? 'text-3xl sm:text-4xl xl:text-5xl' : 'text-4xl sm:text-5xl xl:text-6xl'}`}
      >
        {d.titulo}
      </h2>
      <p className={`max-w-xl text-lg leading-relaxed text-slate-600 ${d.afiche ? 'mt-4' : 'mt-6'}`}>{d.texto}</p>
      <div data-apartar-flotantes className={`flex flex-col gap-3 sm:flex-row ${d.afiche ? 'mt-7' : 'mt-9'}`}>
        {d.botones.map((b) => {
          const contenido = (
            <>
              {b.texto}
              {b.principal && <FlechaDorada />}
            </>
          )
          return b.afiche ? (
            <button key={b.texto} type="button" onClick={() => onAfiche(b.afiche)} className={claseBoton(b.principal)}>
              {contenido}
            </button>
          ) : (
            <a key={b.texto} href={b.href} className={claseBoton(b.principal)}>
              {contenido}
            </a>
          )
        })}
      </div>
    </>
  )
}

export default function Hero() {
  // Botón de pausa además de la pausa automática con el mouse encima (pauta de accesibilidad WCAG 2.2.2)
  const [detenido, setDetenido] = useState(false)
  const [verAfiche, setVerAfiche] = useState(null)
  const { actual, ir, siguiente, anterior, corriendo, contenedor } = useCarrusel({ total: DIAPOSITIVAS.length, intervalo: INTERVALO, detenido: detenido || !!verAfiche })
  // Diapositivas cuyo afiche ya se puede descargar: la actual y la siguiente (así está listo al llegar)
  const [cargadas, setCargadas] = useState(() => new Set([0, 1]))
  useEffect(() => {
    setCargadas((c) => (c.has(actual) && c.has((actual + 1) % DIAPOSITIVAS.length) ? c : new Set([...c, actual, (actual + 1) % DIAPOSITIVAS.length])))
  }, [actual])

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-[#eaf1ff]">
      <FondoHero />

      <div
        className="salida-hero contenedor px-4 pt-34 pb-8 sm:px-6 sm:pt-32 lg:pt-36"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Destacados del congreso"
        {...contenedor}
      >
        {/* Todas las diapositivas ocupan la misma celda: la altura no salta al cambiar */}
        <div className="grid">
          {DIAPOSITIVAS.map((d, i) => {
            const visible = i === actual
            return (
              <div
                key={d.id}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${DIAPOSITIVAS.length}: ${d.etiqueta}`}
                aria-hidden={!visible}
                inert={!visible}
                className={`grid items-center [grid-area:1/1] lg:grid-cols-12 ${d.afiche ? 'gap-6 lg:gap-12' : 'gap-12 lg:gap-16'} ${
                  visible ? 'z-10 opacity-100 transition-[opacity,transform] duration-700' : 'pointer-events-none translate-y-3 opacity-0 transition-[opacity,transform] duration-500'
                }`}
              >
                {d.afiche ? (
                  <>
                    <div className="lg:col-span-5">
                      <TextoDiapositiva d={d} onAfiche={setVerAfiche} />
                    </div>
                    <div className="lg:col-span-7">
                      <Afiche a={d.afiche} onAbrir={setVerAfiche} cargar={cargadas.has(i)} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-7">{i === 0 ? <TextoCongreso /> : <TextoDiapositiva d={d} />}</div>
                    <div className={`hidden lg:col-span-5 lg:block ${i === 0 ? 'animate-aparecer' : ''}`} style={i === 0 ? { animationDelay: '380ms' } : undefined}>
                      <d.Visual />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Controles: pestañas con nombre y barra de progreso, flechas y pausa */}
        <div className="mt-10 flex items-center gap-3 lg:mt-14">
          <div
            className="grid flex-1 gap-1.5 sm:gap-2.5"
            style={{ gridTemplateColumns: `repeat(${DIAPOSITIVAS.length}, minmax(0, 1fr))` }}
            role="tablist"
            aria-label="Elegir diapositiva"
          >
            {DIAPOSITIVAS.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={i === actual}
                aria-label={d.etiqueta}
                onClick={() => ir(i)}
                className="group/tab text-left focus-visible:outline-none"
              >
                <span className="relative block h-1 overflow-hidden rounded-full bg-slate-300/70">
                  {i === actual ? (
                    <span
                      key={`${actual}-${corriendo}`}
                      className="absolute inset-0 origin-left rounded-full bg-rojizo-oscuro"
                      style={corriendo ? { animation: `progreso ${INTERVALO}ms linear forwards` } : undefined}
                    />
                  ) : (
                    i < actual && <span className="absolute inset-0 rounded-full bg-rojizo-oscuro/35" />
                  )}
                </span>
                <span
                  className={`mt-2 hidden truncate text-xs font-semibold transition-colors group-focus-visible/tab:underline lg:block xl:text-sm ${
                    i === actual ? 'text-oscuro' : 'text-slate-500 group-hover/tab:text-oscuro'
                  }`}
                >
                  <span className="mr-1.5 text-[#1d4ed8] tabular-nums">0{i + 1}</span>
                  {d.etiqueta}
                </span>
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setDetenido((v) => !v)}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-oscuro transition hover:border-rojizo-oscuro sm:flex"
              aria-label={detenido ? 'Reanudar el carrusel' : 'Pausar el carrusel'}
            >
              {detenido ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={anterior}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-oscuro transition hover:border-rojizo-oscuro"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={siguiente}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-rojizo-oscuro text-white transition hover:bg-[#172f73]"
              aria-label="Diapositiva siguiente"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {evento.heroMedia?.credito && (
        <p className="absolute right-4 bottom-6 text-[11px] text-slate-500 sm:right-6">{evento.heroMedia.credito}</p>
      )}
      <FranjaTejida tejer={false} />
      <VisorAfiche afiche={verAfiche} onCerrar={() => setVerAfiche(null)} />
    </section>
  )
}
