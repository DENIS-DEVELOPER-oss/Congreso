import { Mountain, Sprout, Sun } from 'lucide-react'
import { Chakana, ChakanaContorno, FranjaTejida, PatronRombos } from './Andino.jsx'
import Reveal from './Reveal.jsx'

// Los tres mundos de la cosmovisión andina, vinculados a los ejes del congreso.
const PACHAS = [
  {
    nombre: 'Hanan Pacha',
    sentido: 'El mundo de arriba',
    texto: 'El sol, los astros y el conocimiento que orienta el calendario agrícola y ritual.',
    Icono: Sun,
    color: 'bg-white/10 text-naranja ring-1 ring-white/15',
  },
  {
    nombre: 'Kay Pacha',
    sentido: 'El mundo de aquí',
    texto: 'La comunidad, el territorio y la vida social que estudia la sociología andina.',
    Icono: Mountain,
    color: 'bg-white/10 text-naranja ring-1 ring-white/15',
  },
  {
    nombre: 'Uku Pacha',
    sentido: 'El mundo de adentro',
    texto: 'La memoria, los ancestros y las semillas que sostienen la identidad de los pueblos.',
    Icono: Sprout,
    color: 'bg-white/10 text-naranja ring-1 ring-white/15',
  },
]

export default function Cosmovision() {
  return (
    <section aria-labelledby="titulo-cosmovision" className="relative isolate overflow-hidden bg-tierra text-white">
      <FranjaTejida />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="trama absolute inset-0" />
        <PatronRombos className="text-naranja opacity-[0.03]" />
      </div>

      <div className="contenedor grid items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-4">
          <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
            <ChakanaContorno className="absolute inset-0 text-naranja/40" />
            <Chakana className="h-16 w-16 text-naranja" />
          </div>
          <p className="text-xs font-bold tracking-wide text-naranja uppercase">Cosmovisión andina</p>
          <h2 id="titulo-cosmovision" className="mt-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            La chakana une los <span className="text-naranja italic">tres mundos</span>
          </h2>
          <p className="mt-4 leading-relaxed text-white/70">
            La cruz andina escalonada, presente en los tejidos de Taquile y del altiplano, ordena la vida en los Andes y
            orienta la mirada de este congreso.
          </p>
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
          {PACHAS.map(({ nombre, sentido, texto, Icono, color }, i) => (
            <Reveal as="li" key={nombre} delay={i * 120}>
              <article className="group relative h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] transition duration-500 hover:-translate-y-1.5 hover:border-naranja/40 hover:bg-white/[0.08]">
                <span className="listado-textil block h-1" aria-hidden="true" />
                <div className="p-6">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-md transition duration-500 group-hover:scale-110 ${color}`}>
                    <Icono className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold">{nombre}</h3>
                  <p className="text-sm font-semibold text-naranja/90">{sentido}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{texto}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
