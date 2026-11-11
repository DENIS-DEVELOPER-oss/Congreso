import { ArrowUp, Mail, MapPin, MessageCircle } from 'lucide-react'
import { aliados } from '../data/aliados.js'
import { canales, enlaceWhatsApp, evento } from '../data/evento.js'
import { enlace } from '../lib/rutas.js'
import { FranjaTejida, PatronRombos } from './Andino.jsx'
import { abrirPrivacidad } from './Privacidad.jsx'
import ListaRedes from './Redes.jsx'
import Logo from './Logo.jsx'

const GRUPOS = [
  {
    titulo: 'El congreso',
    enlaces: [
      { href: '#presentacion', texto: 'Presentación' },
      { href: '#ejes', texto: 'Ejes temáticos' },
      { href: '#programa', texto: 'Programa' },
      { href: '#ponentes', texto: 'Ponentes' },
      { href: '#comites', texto: 'Comités' },
    ],
  },
  {
    titulo: 'Participa',
    enlaces: [
      { href: '#convocatoria', texto: 'Convocatoria' },
      { href: '#inscripcion', texto: 'Inscripción' },
      { href: '#cuenta', texto: 'Aula virtual' },
      { href: '#descargas', texto: 'Descargas' },
      { href: '#preguntas', texto: 'Preguntas frecuentes' },
    ],
  },
]

export default function Footer({ pagina = 'inicio' }) {
  const anio = new Date().getFullYear()
  return (
    <footer className="relative isolate overflow-hidden bg-tierra text-white">
      <FranjaTejida />
      <div className="trama absolute inset-0 -z-10" aria-hidden="true" />
      <PatronRombos className="-z-10 text-naranja opacity-[0.025]" />

      <div className="contenedor grid gap-12 px-4 py-16 sm:px-6 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-4">
          <div className="flex items-center gap-4">
            <Logo className="h-16 w-16" />
            <div>
              <p className="text-left font-display text-xl leading-tight font-extrabold">{evento.nombre}</p>
              <p className="mt-0.5 text-left text-sm text-white/65">{evento.edicion}</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
            Organizado por la Universidad Nacional del Altiplano – {evento.ciudad} (Vicerrectorado Académico, Facultad de
            Ciencias Sociales, Escuela Profesional de Sociología e IIDSA) y el Colegio de Sociólogos del Perú.
          </p>
          <ListaRedes variante="oscuro" className="mt-6" />
        </div>

        {GRUPOS.map((g) => (
          <nav key={g.titulo} className="md:col-span-2" aria-label={g.titulo}>
            <h2 className="text-xs font-bold tracking-wide text-white/55 uppercase">{g.titulo}</h2>
            <ul className="mt-5 space-y-3">
              {g.enlaces.map((e) => (
                <li key={e.href}>
                  <a href={enlace(e.href, pagina)} className="text-sm text-white/80 transition hover:text-naranja">
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-4">
          <h2 className="text-xs font-bold tracking-wide text-white/55 uppercase">Contacto</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            {canales.correos.map((c) => (
              <li key={c}>
                <a href={`mailto:${c}`} className="inline-flex items-center gap-2 [overflow-wrap:anywhere] transition hover:text-naranja">
                  <Mail className="h-4 w-4 shrink-0 text-white/55" aria-hidden="true" /> {c}
                </a>
              </li>
            ))}
            {canales.whatsapp.map((w) => (
              <li key={w.numero}>
                <a href={enlaceWhatsApp(w.numero)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-naranja">
                  <MessageCircle className="h-4 w-4 shrink-0 text-white/55" aria-hidden="true" /> {w.texto}
                </a>
              </li>
            ))}
            <li>
              <a href={evento.mapa.enlace} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 transition hover:text-naranja">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/55" aria-hidden="true" /> {evento.sede} · {evento.sedeDireccion}
              </a>
            </li>
          </ul>
          <a href={enlace('#convocatoria', pagina)} className="btn-primario mt-6">
            Presenta tu ponencia
          </a>
        </div>
      </div>

      {/* Sello institucional: las insignias de quienes organizan, en todas las páginas */}
      <div className="border-t border-white/10">
        <div className="contenedor flex flex-col items-center gap-4 px-4 py-7 sm:px-6 lg:flex-row lg:justify-center lg:gap-8">
          <p className="text-xs font-bold tracking-wide text-white/55 uppercase">Organizan</p>
          {/* Insignias directamente sobre el fondo oscuro (sin círculo blanco); la del VRA, sin su texto oscuro */}
          <ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-9">
            {aliados.map((a) => (
              <li key={a.nombre} title={a.nombre === 'IIDSA' ? a.corto : a.nombre}>
                <img
                  src={a.emblema ?? a.logo}
                  alt={a.nombre}
                  loading="lazy"
                  className="h-12 w-auto max-w-[5.5rem] object-contain drop-shadow-[0_2px_6px_rgb(0_0_0/0.45)] transition duration-300 hover:-translate-y-0.5 sm:h-14"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="contenedor flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/60 sm:flex-row sm:px-6">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              © {anio} Facultad de Ciencias Sociales – Universidad Nacional del Altiplano.{' '}
              <button type="button" onClick={abrirPrivacidad} className="font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline">
                Política de privacidad
              </button>
            </p>
            <p>
              Motivos gráficos inspirados en la tradición textil del altiplano puneño, con respeto y reconocimiento a las
              tejedoras y tejedores de Taquile, Amantaní y las comunidades quechuas y aimaras.
            </p>
          </div>
          <a href="#inicio" className="group inline-flex items-center gap-2 font-semibold text-white/80 transition hover:text-white">
            Volver arriba
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 transition group-hover:-translate-y-0.5 group-hover:border-naranja group-hover:bg-naranja group-hover:text-tierra">
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
