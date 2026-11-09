// Elementos decorativos andinos inspirados en el arte textil de Taquile y los aguayos:
// chakana, rombos escalonados, franja tejida, cordillera y encabezado de sección.
import { useId } from 'react'
import Reveal from './Reveal.jsx'

// Colores fijos para los SVG (iguales a la paleta de index.css)
const C = {
  rojizo: '#2563eb',
  naranja: '#fbbf24',
  azul: '#2563eb',
  crema: '#f1f6ff',
  tierra: '#0b1f5c',
}

// Cruz andina escalonada en una cuadrícula de 10x10 con agujero central.
const CHAKANA_PATH =
  'M4 0H6V2H8V4H10V6H8V8H6V10H4V8H2V6H0V4H2V2H4Z M5 3.8A1.2 1.2 0 1 0 5 6.2A1.2 1.2 0 1 0 5 3.8Z'

// useId puede devolver caracteres no válidos dentro de url(#...)
const useSvgId = () => 'p' + useId().replace(/[^a-zA-Z0-9_-]/g, '')

// Rombo escalonado (como los del tejido) centrado en cx,cy con k escalones de tamaño s.
function rombo(cx, cy, k, s = 2) {
  const h = s / 2
  const r = k * s + h
  const q = [[h, -r]]
  for (let i = 1; i <= k; i++) {
    q.push([h + (i - 1) * s, -r + i * s], [h + i * s, -r + i * s])
  }
  const abajoDer = [...q].reverse().map(([x, y]) => [x, -y])
  const abajoIzq = q.map(([x, y]) => [-x, -y])
  const arribaIzq = [...q].reverse().map(([x, y]) => [-x, y])
  return [...q, ...abajoDer, ...abajoIzq, ...arribaIzq].map(([x, y]) => `${cx + x},${cy + y}`).join(' ')
}

export function Chakana({ className = 'h-6 w-6', title }) {
  return (
    <svg
      viewBox="0 0 10 10"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={CHAKANA_PATH} fillRule="evenodd" />
    </svg>
  )
}

// Chakana solo con contorno, para fondos grandes.
export function ChakanaContorno({ className = '' }) {
  return (
    <svg viewBox="-0.5 -0.5 11 11" className={className} fill="none" stroke="currentColor" strokeWidth="0.06" aria-hidden="true">
      <path d="M4 0H6V2H8V4H10V6H8V8H6V10H4V8H2V6H0V4H2V2H4Z" />
      <path d="M4.4 0.8H5.6V2.4H7.6V4.4H9.2V5.6H7.6V7.6H5.6V9.2H4.4V7.6H2.4V5.6H0.8V4.4H2.4V2.4H4.4Z" />
      <circle cx="5" cy="5" r="1.2" />
    </svg>
  )
}

// Patrón de rombos escalonados para fondos (usar con opacidad baja y currentColor).
export function PatronRombos({ className = '' }) {
  const id = useSvgId()
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <polygon points={rombo(28, 28, 5)} fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points={rombo(28, 28, 2)} fill="currentColor" />
          <rect x="0" y="0" width="3" height="3" fill="currentColor" />
          <rect x="53" y="53" width="3" height="3" fill="currentColor" />
          <rect x="53" y="0" width="3" height="3" fill="currentColor" />
          <rect x="0" y="53" width="3" height="3" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Franja tejida horizontal (borde de sección): sobria, un solo motivo de rombo escalonado.
// escala 1 = 12px de alto. tejer: se "teje" al entrar en pantalla con el scroll.
export function FranjaTejida({ className = '', escala = 1, tejer = true }) {
  const id = useSvgId()
  const alto = 12 * escala
  return (
    <svg
      className={`block w-full ${tejer ? 'franja-tejiendo' : ''} ${className}`}
      style={{ height: alto }}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="24" height="12" patternUnits="userSpaceOnUse" patternTransform={`scale(${escala})`}>
          <rect width="24" height="12" fill="#1e3a8a" />
          <rect y="1.5" width="24" height="0.75" fill={C.naranja} opacity="0.7" />
          <rect y="9.75" width="24" height="0.75" fill={C.naranja} opacity="0.7" />
          <polygon points={rombo(6, 6, 1, 1.5)} fill={C.crema} />
          <rect x="17.25" y="5.25" width="1.5" height="1.5" fill={C.naranja} />
        </pattern>
      </defs>
      <rect width="100%" height={alto} fill={`url(#${id})`} />
    </svg>
  )
}

// Silueta de la cordillera y la orilla del lago, para el pie del hero.
export function Cordillera({ className = '' }) {
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 120 L90 84 L150 98 L240 52 L310 88 L380 64 L450 96 L540 40 L620 86 L700 70 L780 100 L880 46 L960 82 L1040 66 L1130 98 L1220 56 L1300 90 L1380 74 L1440 92 L1440 160 L0 160Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path d="M0 140 Q360 112 720 132 T1440 128 L1440 160 L0 160Z" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

// Encabezado de sección: etiqueta corta en mayúsculas, título (cada palabra sube al aparecer),
// descripción opcional y, a la derecha, un enlace opcional del tipo "Ver todo →".
export function TituloSeccion({ titulo, etiqueta, descripcion, accion, claro = false }) {
  return (
    <Reveal as="header" className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-14">
      <div className="max-w-3xl">
        {/* Etiqueta en píldora azul con círculo amarillo, como en los afiches */}
        {etiqueta && (
          <p
            className={`mb-4 inline-flex items-center gap-2 rounded-full py-1 pr-4 pl-1 font-etiqueta text-xs font-bold tracking-[0.14em] uppercase ${claro ? 'bg-white/10 text-white ring-1 ring-white/20' : 'bg-rojizo-oscuro text-white'}`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-naranja text-[#0b1f5c]">
              <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden="true">
                <polygon points={rombo(5, 5, 1, 2.5)} fill="currentColor" />
              </svg>
            </span>
            {etiqueta}
          </p>
        )}
        <h2 aria-label={titulo} className={`text-4xl leading-[1.1] font-extrabold sm:text-5xl ${claro ? 'text-white' : 'text-oscuro'}`}>
          {titulo.split(' ').map((p, i) => (
            <span key={i} aria-hidden="true">
              <span className="palabra">
                <span style={{ '--i': i }}>{p}</span>
              </span>{' '}
            </span>
          ))}
        </h2>
        <span className="mt-4 block h-1.5 w-16 rounded-full bg-naranja" aria-hidden="true" />
        {descripcion && (
          <p className={`mt-5 text-lg leading-relaxed ${claro ? 'text-white/75' : 'text-slate-600'}`}>{descripcion}</p>
        )}
      </div>
      {accion && (
        <a
          href={accion.href}
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-azul-oscuro transition duration-300 hover:border-rojizo-oscuro hover:text-rojizo-oscuro"
        >
          {accion.texto}
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </a>
      )}
    </Reveal>
  )
}
