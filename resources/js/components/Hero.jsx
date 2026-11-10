import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, FileText, KeyRound, MailCheck, Mic, Pause, Play, UserPlus, Video } from 'lucide-react'
import { descargarIcs, urlGoogleCalendar } from '../lib/calendario.js'
import { evento } from '../data/evento.js'
import { ponentes } from '../data/ponentes.js'
import { modalidades } from '../data/convocatoria.js'
import { afiche } from '../data/afiches.js'
import { RUTAS } from '../lib/rutas.js'
import { FranjaTejida } from './Andino.jsx'
import { useCarrusel } from './Carrusel.jsx'
import { Magnetico } from './Efectos.jsx'
import PaisajeHero from './PaisajeHero.jsx'

const INTERVALO = 7000

const INSTITUCIONES = [
  { titulo: 'Universidad Nacional del Altiplano', detalle: 'Puno · Perú' },
  { titulo: 'IIDSA', detalle: 'Instituto de Investigaciones para el Desarrollo Social Andino' },
  { titulo: 'Facultad de Ciencias Sociales', detalle: 'Escuela Profesional de Sociología' },
]

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

// Modalidades de presentación de la convocatoria
function TarjetaConvocatoria() {
  return (
    <div className="rounded-2xl border border-white bg-white/90 p-7 shadow-[0_30px_60px_-30px_rgb(15_23_42/0.35)] backdrop-blur-xl">
      <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Modalidades de presentación</p>
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
        Resumen de 250 palabras con la plantilla oficial. Recepción hasta el <strong className="text-oscuro">20 de noviembre</strong>.
      </p>
    </div>
  )
}

// Pasos para participar (inscripción gratuita)
function TarjetaPasos() {
  const pasos = [
    { Icono: UserPlus, titulo: 'Regístrate', texto: 'Completa el formulario con tus datos y tu categoría.' },
    { Icono: MailCheck, titulo: 'Recibe tu acceso', texto: 'Al instante te llega tu usuario, tu contraseña y el programa con Google Meet.' },
    { Icono: KeyRound, titulo: 'Ingresa al Aula virtual', texto: 'Únete por Google Meet, envía tu resumen y descarga tu certificado.' },
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

// Afiche oficial a la derecha (en celular, debajo del texto); al tocarlo se abre en grande
function Afiche({ a }) {
  return (
    <a
      href={a.src}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-28px_rgb(15_23_42/0.5)] ring-1 ring-white transition duration-500 hover:-translate-y-1"
    >
      <img src={a.src} alt={`${a.titulo}: ${a.texto}`} decoding="async" className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
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
    texto: '26 y 27 de noviembre de 2026 en el campus de la UNA Puno, en modalidad presencial y virtual. Inscripción gratuita.',
    botones: [
      { texto: 'Ver el afiche', href: afiche('congreso').src, principal: true, externo: true },
      { texto: 'Todos los afiches', href: '#afiches' },
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
      { texto: 'Ver el afiche', href: afiche('ponentes').src, principal: true, externo: true },
      { texto: 'Conocer a los ponentes', href: '#ponentes' },
    ],
    afiche: afiche('ponentes'),
  },
  {
    id: 'convocatoria',
    etiqueta: 'Convocatoria',
    antetitulo: 'Convocatoria de ponencias',
    titulo: 'Presenta tu investigación',
    texto: 'Regístrate y envía tu resumen desde el Aula virtual con el usuario que te enviaremos por correo. El comité científico evaluará cada trabajo.',
    botones: [
      { texto: 'Registrarme', href: RUTAS.inscripcion, principal: true },
      { texto: 'Leer las bases', href: '#convocatoria' },
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
      { texto: 'Ver el afiche', href: afiche('ejes').src, principal: true, externo: true },
      { texto: 'Ver los ejes', href: '#ejes' },
    ],
    afiche: afiche('ejes'),
  },
  {
    id: 'inscripcion',
    etiqueta: 'Inscripciones',
    antetitulo: evento.inscripcionesAbiertas ? 'Inscripción gratuita' : 'Inscripción gratuita · muy pronto',
    titulo: 'Asegura tu participación',
    texto: 'Regístrate en dos minutos y participa en el campus UNA Puno o por Google Meet. Al instante te llega tu acceso al Aula virtual.',
    botones: [
      { texto: 'Registrarme', href: RUTAS.inscripcion, principal: true },
      { texto: 'Ingresar al aula', href: RUTAS.cuenta },
    ],
    Visual: TarjetaPasos,
  },
]

// Entrada escalonada de la primera carga
const entrada = (ms) => ({ className: 'animate-aparecer', style: { animationDelay: `${ms}ms` } })

const claseBoton = (principal) =>
  principal
    ? 'group btn-primario shadow-[0_12px_32px_-12px_rgb(30_58_138/0.6)]'
    : 'btn border border-slate-300 bg-white/80 text-oscuro backdrop-blur-sm hover:border-rojizo-oscuro hover:text-rojizo-oscuro'

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
            <Video className="h-4 w-4" aria-hidden="true" /> Presencial y virtual
          </span>
          <span>{evento.fechasTexto}</span>
          <span className="h-1 w-1 rounded-full bg-naranja" aria-hidden="true" />
          <span>Campus UNA Puno</span>
        </p>
      </div>
      <div data-apartar-flotantes className="mt-9 flex animate-aparecer flex-col gap-3 sm:flex-row" style={{ animationDelay: '460ms' }}>
        <Magnetico href={RUTAS.inscripcion} className={claseBoton(true)}>
          Inscríbete ahora
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Magnetico>
        <Magnetico href={RUTAS.cuenta} className={claseBoton(false)}>
          Aula virtual
        </Magnetico>
      </div>
    </>
  )
}

function TextoDiapositiva({ d }) {
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
        {d.botones.map((b) => (
          <a
            key={b.texto}
            href={b.href}
            {...(b.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={claseBoton(b.principal)}
          >
            {b.texto}
            {b.principal && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
          </a>
        ))}
      </div>
    </>
  )
}

export default function Hero() {
  // Botón de pausa además de la pausa automática con el mouse encima (pauta de accesibilidad WCAG 2.2.2)
  const [detenido, setDetenido] = useState(false)
  const { actual, ir, siguiente, anterior, corriendo, contenedor } = useCarrusel({ total: DIAPOSITIVAS.length, intervalo: INTERVALO, detenido })

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-[#eaf1ff]">
      <FondoHero />

      <div
        className="salida-hero contenedor px-4 pt-24 pb-8 sm:px-6 sm:pt-28 lg:pt-32"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Destacados del congreso"
        {...contenedor}
      >
        {/* Bloque institucional, igual que la cabecera de los afiches */}
        <div {...entrada(0)}>
          <ul className="flex flex-wrap items-stretch gap-x-4 gap-y-2 text-[11px] leading-tight sm:gap-x-5 sm:text-xs">
            {INSTITUCIONES.map((inst, i) => (
              <li key={inst.titulo} className={`flex items-center gap-4 sm:gap-5 ${i === 1 ? 'hidden md:flex' : ''}`}>
                {i > 0 && <span className="hidden h-8 w-px bg-rojizo-oscuro/25 sm:block" aria-hidden="true" />}
                <span>
                  <span className="block font-display font-extrabold tracking-wide text-rojizo-oscuro uppercase">{inst.titulo}</span>
                  <span className="block text-slate-600">{inst.detalle}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aviso destacado en forma de píldora */}
        <a
          {...entrada(60)}
          href={RUTAS.inscripcion}
          className="group mt-6 inline-flex max-w-full animate-aparecer items-center gap-3 rounded-full border border-rojizo-oscuro/15 bg-white/85 py-1.5 pr-4 pl-1.5 text-sm shadow-[0_8px_24px_-14px_rgb(15_23_42/0.45)] backdrop-blur transition hover:border-rojizo-oscuro/40"
        >
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rojizo-oscuro px-3 py-1 text-xs font-bold text-white">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-naranja opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-naranja" />
            </span>
            {evento.inscripcionesAbiertas ? 'Inscripciones abiertas' : 'Inscripciones muy pronto'}
          </span>
          <span className="truncate font-medium text-slate-700">
            <span className="hidden sm:inline">Inscripción gratuita · </span>
            {evento.fechasTexto}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-rojizo-oscuro transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>

        {/* Todas las diapositivas ocupan la misma celda: la altura no salta al cambiar */}
        <div className="mt-7 grid sm:mt-9">
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
                      <TextoDiapositiva d={d} />
                    </div>
                    <div className="lg:col-span-7">
                      <Afiche a={d.afiche} />
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
    </section>
  )
}
