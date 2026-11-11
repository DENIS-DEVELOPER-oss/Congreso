import { evento } from '../data/evento.js'
import { TituloSeccion } from './Andino.jsx'
import GaleriaSaberes from './GaleriaSaberes.jsx'
import Reveal from './Reveal.jsx'

// Objetivos según el documento oficial del congreso
const OBJETIVO_GENERAL =
  'Propiciar la reflexión y el análisis crítico sobre la importancia de promover el diálogo intercultural e interepistémico entre los saberes ancestrales de los pueblos originarios andinos y amazónicos y los conocimientos científicos y académicos que se imparten en las universidades del Perú y Latinoamérica, orientado a fortalecer la enseñanza, la investigación y la responsabilidad social desde una perspectiva multiparadigmática.'

const OBJETIVOS = [
  'Analizar los fundamentos y las posibilidades del diálogo intercultural e interepistémico entre los saberes ancestrales y los conocimientos científicos y académicos, desde una perspectiva de reconocimiento, reciprocidad y equidad entre diferentes sistemas de conocimiento.',
  'Promover la construcción de propuestas orientadas al desarrollo de una educación superior universitaria multiparadigmática e intercultural, que reconozca y valore la pluralidad de sistemas de conocimiento, culturas y lenguas en las universidades peruanas y latinoamericanas.',
  'Fomentar el desarrollo de redes de colaboración nacional e internacional entre universidades y organizaciones sociales originarias para promover la difusión y el reconocimiento de los conocimientos originarios en la educación superior universitaria.',
]

const DIRIGIDO_A = [
  'Docentes e investigadores en ciencias sociales',
  'Estudiantes de pregrado y posgrado',
  'Profesionales de instituciones públicas y ONG',
  'Dirigentes y organizaciones sociales de la región',
]

// Instituciones que acogen el congreso, con su fotografía: mismo tamaño y diseño para ambas
const INSTITUCIONES = [
  {
    foto: evento.presentacionImagen?.src ?? '/media/campus-una-puno.jpg',
    alt: 'Ingreso al campus de la Universidad Nacional del Altiplano, en Puno',
    insignia: '/insignias/web/unap.png',
    nombre: 'Universidad Nacional del Altiplano',
    detalle: 'Puno, Perú',
    encuadre: 'object-center',
  },
  {
    foto: '/media/ep-sociologia.jpg',
    alt: 'Edificio de la Escuela Profesional de Sociología de la Universidad Nacional del Altiplano, en Puno',
    insignia: '/insignias/web/sociologia.png',
    nombre: 'Escuela Profesional de Sociología',
    detalle: 'Facultad de Ciencias Sociales · UNA Puno',
    encuadre: 'object-[center_20%]',
  },
]

function TarjetaInstitucion({ foto, alt, insignia, nombre, detalle, encuadre, retraso = 0 }) {
  return (
    <figure className="group relative isolate aspect-[5/4] overflow-hidden rounded-2xl lg:aspect-square bg-[#0b1f5c] shadow-elevada ring-1 ring-black/5">
      <img
        src={foto}
        loading="lazy"
        alt={alt}
        style={{ animationDelay: `-${retraso}s` }}
        className={`absolute inset-0 h-full w-full object-cover ${encuadre} motion-safe:animate-acercar`}
      />
      <span className="absolute inset-x-0 top-0 h-1 bg-naranja" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1f5c] via-[#0b1f5c]/85 to-transparent px-5 pt-20 pb-5 text-white sm:px-6">
        <figcaption className="flex items-center gap-4">
          <img src={insignia} alt="" width="56" height="56" className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_2px_6px_rgb(0_0_0/0.45)]" />
          <span>
            <span className="block text-xs font-bold tracking-[0.18em] text-naranja uppercase">Organiza</span>
            <span className="mt-1 block font-display text-lg leading-tight font-extrabold sm:text-xl">{nombre}</span>
            <span className="mt-1 block text-sm text-white/80">{detalle}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  )
}

export default function Presentacion() {
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
                Andinos y Amazónicos y Diálogo Intercultural en la Educación Superior Universitaria», que se realizará en
                Educación Continua de la UNA Puno, en modalidad presencial, el 26 y 27 de noviembre de 2026.
              </p>
              <p>
                En una sociedad pluricultural y multilingüe como la peruana, articular los saberes académicos con los
                conocimientos ancestrales de los pueblos originarios andinos y amazónicos es una tarea fundamental para
                construir una educación superior inclusiva, pertinente y comprometida. Guiado por el diálogo intercultural
                e interepistémico, este proceso no solo reconoce otras formas de conocimiento, sino que también mejora la
                calidad académica, la investigación científica y la responsabilidad social de la universidad peruana y
                latinoamericana.
              </p>
              <p>
                El congreso es un espacio para revisar críticamente los fundamentos epistemológicos, pedagógicos y
                curriculares de la educación superior, con el objetivo de construir una universidad intercultural que valore
                la diversidad de saberes, promueva la equidad y contribuya a superar la discriminación epistémica.
              </p>
            </div>

            <h3 className="mt-12 text-xl font-semibold text-oscuro">Objetivo general</h3>
            <p className="mt-3 rounded-lg border-l-4 border-naranja bg-crema p-4 text-[17px] leading-relaxed text-slate-700">{OBJETIVO_GENERAL}</p>
            <h3 className="mt-8 text-xl font-semibold text-oscuro">Objetivos específicos</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-[17px] leading-relaxed text-slate-700 marker:font-semibold marker:text-rojizo-oscuro">
              {OBJETIVOS.map((o) => (
                <li key={o} className="pl-1">
                  {o}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={100} className="space-y-8 lg:col-span-5">
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

            {INSTITUCIONES.map((inst, i) => (
              <TarjetaInstitucion key={inst.nombre} {...inst} retraso={i * 6} />
            ))}
          </Reveal>
        </div>

        <GaleriaSaberes />
      </div>
    </section>
  )
}
