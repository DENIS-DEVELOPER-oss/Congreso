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

export default function Comites() {
  return (
    <section id="comites" className="seccion">
      <div className="contenedor">
        <TituloSeccion etiqueta="Organización" titulo="Comités"
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-rojizo-oscuro uppercase">Comité organizador</h3>
            <ul className="space-y-3">
              {comiteOrganizador.map((p) => (
                <Persona key={p.nombre} nombre={p.nombre} detalle={p.cargo} color="bg-rojizo-oscuro/10 text-rojizo-oscuro" />
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-slate-500 uppercase">Comité científico</h3>
            <ul className="space-y-3">
              {comiteCientifico.map((p) => (
                <Persona key={p.nombre} nombre={p.nombre} detalle={`${p.institucion} · ${p.pais}`} color="bg-slate-200 text-slate-700" />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
