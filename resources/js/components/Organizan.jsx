import { aliados } from '../data/aliados.js'

// Franja en movimiento bajo el Comité organizador: las insignias pasan en orden y se detienen con el mouse encima.
// Cada mitad repite la lista dos veces para cubrir pantallas anchas sin huecos.
export default function FranjaOrganizan() {
  const vuelta = [...aliados, ...aliados]
  return (
    <section id="organizan" aria-labelledby="titulo-organizan" className="scroll-mt-24 border-y border-black/5 bg-white py-8">
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
