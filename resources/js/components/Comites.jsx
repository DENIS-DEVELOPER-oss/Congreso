import { Award, ClipboardCheck } from 'lucide-react'
import { aliados } from '../data/aliados.js'
import { comiteCientifico, comiteOrganizador } from '../data/comites.js'
import { TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

const iniciales = (nombre) =>
  nombre
    .replace(/^(Dra?|Mg|Lic|Est)\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

function Persona({ nombre, detalle, color }) {
  return (
    <li className="tarjeta flex items-center gap-4 p-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-etiqueta text-sm font-bold ${color}`} aria-hidden="true">
        {iniciales(nombre)}
      </span>
      <div className="min-w-0">
        <p className="font-bold leading-snug">{nombre}</p>
        <p className="text-sm text-slate-600">{detalle}</p>
      </div>
    </li>
  )
}

// Institución del comité organizador: insignia a color, nombre completo y a qué pertenece
function Institucion({ a }) {
  return (
    <li className="tarjeta flex items-center gap-4 p-4 sm:p-5">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 ring-1 ring-black/5">
        <img src={a.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
      </span>
      <div className="min-w-0">
        <p className="leading-snug font-bold text-oscuro">{a.completo ?? a.nombre}</p>
        <p className="mt-0.5 text-sm text-slate-600">{a.detalle}</p>
      </div>
    </li>
  )
}

export default function Comites() {
  return (
    <section id="comites" className="seccion">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Organización"
          titulo="Comité organizador"
          descripcion="El congreso es organizado por las siguientes instituciones, que evalúan las ponencias y otorgan las certificaciones."
        />
        <Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aliados.map((a) => (
              <Institucion key={a.nombre} a={a} />
            ))}
          </ul>
        </Reveal>

        {/* Qué hace el comité: evaluar las ponencias y certificar a nombre de las instituciones */}
        <Reveal delay={100} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl bg-[#0b1f5c] p-5 text-white sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-naranja text-[#0b1f5c]">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold">Evaluación de ponencias</p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                Los resúmenes recibidos son evaluados por el Comité organizador, que comunica el resultado a cada autor por correo.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-[#0b1f5c] p-5 text-white sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-naranja text-[#0b1f5c]">
              <Award className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold">Certificación institucional</p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                Los certificados se otorgan a nombre de las instituciones organizadoras y llevan sus insignias y un código QR de verificación.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Personas de los comités: se muestran cuando estén confirmadas en data/comites.js */}
        {(comiteOrganizador.length > 0 || comiteCientifico.length > 0) && (
          <div className={`mt-12 grid gap-10 ${comiteCientifico.length > 0 ? 'lg:grid-cols-2' : ''}`}>
            {comiteOrganizador.length > 0 && (
              <Reveal>
                <h3 className="mb-5 text-sm font-bold tracking-wide text-rojizo-oscuro uppercase">Comisión organizadora</h3>
                <ul className={comiteCientifico.length > 0 ? 'space-y-3' : 'flex flex-wrap justify-center gap-3 *:w-full sm:*:w-[calc((100%-0.75rem)/2)] lg:*:w-[calc((100%-1.5rem)/3)]'}>
                  {comiteOrganizador.map((p) => (
                    <Persona key={p.nombre} nombre={p.nombre} detalle={p.cargo} color="bg-rojizo-oscuro/10 text-rojizo-oscuro" />
                  ))}
                </ul>
              </Reveal>
            )}
            {comiteCientifico.length > 0 && (
              <Reveal delay={150}>
                <h3 className="mb-5 text-sm font-bold tracking-wide text-slate-500 uppercase">Comité científico</h3>
                <ul className="space-y-3">
                  {comiteCientifico.map((p) => (
                    <Persona key={p.nombre} nombre={p.nombre} detalle={`${p.institucion} · ${p.pais}`} color="bg-slate-200 text-slate-700" />
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
