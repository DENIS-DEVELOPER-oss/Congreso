import { aliados } from '../data/aliados.js'
import { Chakana } from './Andino.jsx'

function Aliado({ aliado }) {
  const contenido = (
    <span className="flex h-full flex-col items-center gap-4 rounded-2xl border border-black/5 bg-white px-5 py-6 text-center shadow-suave transition duration-300 hover:-translate-y-1 hover:border-naranja/40">
      <span className="flex h-24 w-full items-center justify-center sm:h-28">
        {aliado.logo ? (
          <img src={aliado.logo} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
        ) : (
          <Chakana className="h-10 w-10 text-naranja" />
        )}
      </span>
      <span>
        <span className="block text-sm leading-snug font-bold text-oscuro">{aliado.nombre}</span>
        <span className="mt-0.5 block text-xs font-medium text-slate-500">{aliado.corto}</span>
      </span>
    </span>
  )
  if (!aliado.url) return contenido
  return (
    <a href={aliado.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {contenido}
    </a>
  )
}

// Franja en movimiento bajo el Comité organizador: las insignias pasan en orden y se detienen con el mouse encima.
// Cada mitad repite la lista dos veces para cubrir pantallas anchas sin huecos.
export function FranjaOrganizan() {
  const vuelta = [...aliados, ...aliados]
  return (
    <section aria-labelledby="titulo-organizan" className="border-y border-black/5 bg-white py-8">
      <h2 id="titulo-organizan" className="mb-5 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">
        <span className="h-px w-8 bg-naranja" aria-hidden="true" />
        Organizan
        <span className="h-px w-8 bg-naranja" aria-hidden="true" />
      </h2>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <ul className="flex w-max animate-carrusel [animation-duration:40s] group-hover:[animation-play-state:paused]">
          {[...vuelta, ...vuelta].map((a, i) => (
            <li key={i} aria-hidden={i >= aliados.length ? true : undefined} className="mr-5 flex items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 shadow-suave sm:mr-8">
              <img src={a.logo} alt="" className="h-12 w-auto object-contain sm:h-14" />
              <span className="text-sm leading-tight font-bold whitespace-nowrap text-oscuro">
                {a.nombre}
                <span className="block text-xs font-medium text-slate-500">{a.corto}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// Insignias de las instituciones organizadoras, a todo color
export default function Aliados() {
  return (
    <section id="aliados" aria-labelledby="titulo-aliados" className="border-y border-black/5 py-16">
      <div className="contenedor px-4 sm:px-6">
        <h2 id="titulo-aliados" className="mb-8 text-center text-xs font-bold tracking-wide text-slate-500 uppercase">
          Organizan
        </h2>
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {aliados.map((a) => (
            <li key={a.nombre}>
              <Aliado aliado={a} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
