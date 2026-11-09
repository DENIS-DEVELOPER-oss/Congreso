import { Clock, Download, FileImage, FileText } from 'lucide-react'
import { descargas } from '../data/descargas.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

const ICONO_FORMATO = { PDF: FileText, DOCX: FileText, JPG: FileImage, PNG: FileImage }

export default function Descargas() {
  return (
    <section id="descargas" className="seccion trama-clara bg-crema">
      <div className="contenedor">
        <TituloSeccion etiqueta="Recursos" titulo="Documentos"
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {descargas.map((d, i) => {
            const Icono = ICONO_FORMATO[d.formato] ?? FileText
            return (
              <Reveal as="li" key={d.id} delay={(i % 3) * 90}>
                <article className="tarjeta group flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="tarjeta-icono transition duration-500 group-hover:scale-110">
                      <Icono className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{d.formato}</span>
                  </div>
                  <h3 className="mt-5 font-bold">{d.titulo}</h3>
                  <p className="mt-1 mb-5 text-sm text-slate-600">{d.descripcion}</p>
                  {d.disponible ? (
                    <a href={d.archivo} download className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-azul-oscuro hover:text-rojizo-oscuro">
                      <Download className="h-4 w-4" aria-hidden="true" /> Descargar <span className="sr-only">{d.titulo}</span>
                    </a>
                  ) : (
                    <p className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
                      <Clock className="h-4 w-4" aria-hidden="true" /> Próximamente
                    </p>
                  )}
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
