import { aliados } from '../data/aliados.js'
import { Chakana } from './Andino.jsx'

function Aliado({ aliado, duplicado }) {
  const contenido = (
    <span className="flex h-20 items-center gap-3 rounded-lg border border-black/5 bg-white px-6 shadow-suave transition duration-300 hover:border-naranja/40">
      {aliado.logo ? (
        <img src={aliado.logo} alt="" className="h-10 w-auto object-contain grayscale transition hover:grayscale-0" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
      ) : (
        <Chakana className="h-5 w-5 shrink-0 text-naranja" />
      )}
      <span className="text-sm font-semibold whitespace-nowrap text-slate-700">{aliado.nombre}</span>
    </span>
  )
  if (!aliado.url) return contenido
  return (
    <a href={aliado.url} target="_blank" rel="noopener noreferrer" tabIndex={duplicado ? -1 : undefined}>
      {contenido}
    </a>
  )
}

// Carrusel infinito de organizadores y aliados (se pausa al pasar el mouse)
export default function Aliados() {
  return (
    <section id="aliados" aria-labelledby="titulo-aliados" className="border-y border-black/5 py-16">
      <h2 id="titulo-aliados" className="mb-8 text-center text-xs font-bold tracking-wide text-slate-500 uppercase">
        Organizan y respaldan
      </h2>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="flex w-max animate-carrusel gap-4 group-hover:[animation-play-state:paused]">
          {[...aliados, ...aliados].map((a, i) => (
            <li key={i} aria-hidden={i >= aliados.length ? true : undefined}>
              <Aliado aliado={a} duplicado={i >= aliados.length} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
