// Documentos oficiales del congreso: fichas con el tipo de archivo, páginas y peso, y acciones «Ver» y «Descargar».
// FichaCompacta se usa también en la Convocatoria (bases y plantilla).
import { Clock, Download, Eye } from 'lucide-react'
import { descargas } from '../data/descargas.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

const NOMBRE_FORMATO = { PDF: 'Documento PDF', DOCX: 'Documento Word', JPG: 'Imagen JPG', PNG: 'Imagen PNG' }
const SE_PUEDE_VER = ['PDF', 'JPG', 'PNG']

// Miniatura de documento: hoja azul noche con la esquina doblada en dorado y el formato
function Hoja({ formato, apagada = false, chica = false }) {
  return (
    <span
      className={`relative flex shrink-0 items-end justify-center overflow-hidden rounded-md pb-2 font-display font-extrabold tracking-wide shadow-[0_8px_18px_-10px_rgb(11_31_92/0.7)] ${
        chica ? 'h-12 w-10 text-[10px]' : 'h-16 w-13 text-xs'
      } ${apagada ? 'bg-slate-200 text-slate-500' : 'bg-linear-to-b from-[#1e3a8a] to-[#0b1f5c] text-white'}`}
      aria-hidden="true"
    >
      {/* Esquina doblada */}
      <span className={`absolute top-0 right-0 ${chica ? 'h-3 w-3' : 'h-4 w-4'} rounded-bl-sm ${apagada ? 'bg-slate-300' : 'bg-naranja'}`} />
      {/* Renglones de la hoja */}
      <span className={`absolute inset-x-2 ${chica ? 'top-3.5' : 'top-5'} space-y-1`}>
        <span className={`block h-px ${apagada ? 'bg-slate-400/50' : 'bg-white/35'}`} />
        <span className={`block h-px w-2/3 ${apagada ? 'bg-slate-400/50' : 'bg-white/35'}`} />
      </span>
      {formato}
    </span>
  )
}

function Ficha({ d }) {
  return (
    <article className={`tarjeta group flex h-full flex-col p-6 ${d.disponible ? '' : 'opacity-80'}`}>
      <div className="flex items-start gap-4">
        <Hoja formato={d.formato} apagada={!d.disponible} />
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#1d4ed8] uppercase">{NOMBRE_FORMATO[d.formato] ?? d.formato}</p>
          <h3 className="mt-1 font-display text-lg leading-snug font-extrabold text-oscuro">{d.titulo}</h3>
          {d.disponible && d.detalle && <p className="mt-0.5 text-xs font-medium text-slate-500">{d.detalle}</p>}
        </div>
      </div>
      <p className="mt-4 mb-6 text-sm leading-relaxed text-slate-600">{d.descripcion}</p>

      {d.disponible ? (
        <div className="mt-auto flex gap-2.5">
          <a
            href={d.archivo}
            download
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0b1f5c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163a9e]"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Descargar <span className="sr-only">{d.titulo}</span>
          </a>
          {SE_PUEDE_VER.includes(d.formato) && (
            <a
              href={d.archivo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-[#0b1f5c] transition hover:border-[#0b1f5c] hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" aria-hidden="true" /> Ver <span className="sr-only">{d.titulo} (se abre en una pestaña nueva)</span>
            </a>
          )}
        </div>
      ) : (
        <p className="mt-auto inline-flex items-center gap-2 self-start rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
          <Clock className="h-4 w-4" aria-hidden="true" /> Disponible próximamente
        </p>
      )}
    </article>
  )
}

// Fila compacta para la Convocatoria: toda la fila descarga el archivo
export function FichaCompacta({ d }) {
  return (
    <a
      href={d.archivo}
      download
      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3.5 pr-4 transition hover:-translate-y-0.5 hover:border-[#0b1f5c]/40 hover:shadow-suave"
    >
      <Hoja formato={d.formato} chica />
      <span className="min-w-0 flex-1">
        <span className="block font-bold leading-snug text-oscuro">{d.titulo}</span>
        <span className="block text-xs text-slate-500">{d.detalle ?? NOMBRE_FORMATO[d.formato]}</span>
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0b1f5c]/5 text-[#0b1f5c] transition group-hover:bg-[#0b1f5c] group-hover:text-white">
        <Download className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="sr-only">Descargar</span>
    </a>
  )
}

export default function Descargas() {
  return (
    <section id="descargas" className="seccion trama-clara bg-crema">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Recursos"
          titulo="Documentos oficiales"
          descripcion="Bases de la convocatoria, plantilla del resumen y material de difusión del congreso."
        />
        <ul className="flex flex-wrap justify-center gap-5 *:w-full sm:*:w-[calc((100%-1.25rem)/2)] lg:*:w-[calc((100%-2.5rem)/3)]">
          {descargas.map((d, i) => (
            <Reveal as="li" key={d.id} delay={(i % 3) * 90}>
              <Ficha d={d} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
