import { evento } from '../data/evento.js'
import { TituloSeccion } from './Andino.jsx'
import PaisajeTiticaca from './Paisaje.jsx'
import Reveal from './Reveal.jsx'

const OBJETIVOS = [
  'Abrir un espacio de diálogo entre el conocimiento académico y los saberes de los pueblos andinos y amazónicos.',
  'Dar a conocer investigaciones y experiencias de educación intercultural en la universidad.',
  'Fortalecer el trabajo conjunto entre universidades del Perú y de otros países de la región.',
  'Recoger propuestas para una formación universitaria con pertinencia intercultural e interepistémica.',
]

const DIRIGIDO_A = [
  'Docentes e investigadores en ciencias sociales',
  'Estudiantes de pregrado y posgrado',
  'Profesionales de instituciones públicas y ONG',
  'Dirigentes y organizaciones sociales de la región',
]

export default function Presentacion() {
  const imagen = evento.presentacionImagen

  return (
    <section id="presentacion" className="seccion">
      <div className="contenedor">
        <TituloSeccion etiqueta="Sobre el congreso" titulo="Presentación" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="space-y-5 text-lg leading-relaxed text-slate-700">
              <p className="first-letter:float-left first-letter:mt-1.5 first-letter:mr-2 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.75] first-letter:font-semibold first-letter:text-rojizo-oscuro">
                La Escuela Profesional de Sociología y el Instituto de Investigaciones para el Desarrollo Social Andino
                (IIDSA) de la Universidad Nacional del Altiplano organizan el I Congreso Internacional «Saberes
                Andino-Amazónicos y Diálogo Intercultural en la Educación Superior Universitaria», que se realizará en
                el campus de la UNA Puno, en modalidad presencial y virtual, el 26 y 27 de noviembre de 2026.
              </p>
              <p>
                El congreso parte de una pregunta que compartimos docentes y estudiantes: cómo formar profesionales
                con pertinencia intercultural e interepistémica, es decir, en una universidad donde los saberes de los
                pueblos andinos y amazónicos dialoguen en igualdad con el conocimiento académico. Para ello reúne en
                Puno y en línea a investigadores, docentes y sabios originarios del Perú y de otros países de la región.
              </p>
            </div>

            <h3 className="mt-12 text-xl font-semibold text-oscuro">Objetivos</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-[17px] leading-relaxed text-slate-700 marker:font-semibold marker:text-rojizo-oscuro">
              {OBJETIVOS.map((o) => (
                <li key={o} className="pl-1">
                  {o}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={100} className="space-y-8 lg:col-span-5">
            <figure className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                {imagen ? (
                  <img src={imagen.src} alt={imagen.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.04]" />
                ) : (
                  <PaisajeTiticaca className="absolute inset-0 h-full w-full transition duration-[1.4s] ease-out group-hover:scale-[1.04]" />
                )}
              </div>
              <figcaption className="mt-2 text-sm text-slate-500">
                {imagen?.alt ?? 'Puno, a orillas del lago Titicaca (3 827 m s. n. m.).'}
                {imagen?.credito && ` ${imagen.credito}`}
              </figcaption>
            </figure>

            <div className="rounded-lg border border-slate-200 p-6">
              <h3 className="text-base font-semibold text-oscuro">Dirigido a</h3>
              <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
                {DIRIGIDO_A.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rojizo-oscuro" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
