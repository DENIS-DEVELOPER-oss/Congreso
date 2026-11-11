// lucide-react ya no incluye logos de marcas: se dibujan aquí en SVG simple.
import { evento } from '../data/evento.js'

function IconoFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8V6.5c0-.8.2-1.5 1.5-1.5H17V2h-2.6C11.6 2 11 4 11 6v2H9v3h2v11h3V11h2.5l.5-3h-3Z" />
    </svg>
  )
}
function IconoInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconoYoutube(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  )
}

// Solo las redes que tienen dirección propia del congreso
const REDES = [
  { nombre: 'Facebook', url: evento.redes.facebook, Icono: IconoFacebook },
  { nombre: 'Instagram', url: evento.redes.instagram, Icono: IconoInstagram },
  { nombre: 'YouTube', url: evento.redes.youtube, Icono: IconoYoutube },
].filter((r) => r.url)

export const hayRedes = REDES.length > 0

// variante: "claro" (sobre fondo blanco) | "oscuro" (sobre fondo oscuro)
export default function ListaRedes({ variante = 'claro', className = '' }) {
  const estilo =
    variante === 'oscuro'
      ? 'border-white/15 text-white/70 hover:border-naranja hover:bg-naranja hover:text-tierra'
      : 'border-slate-200 bg-white text-slate-600 hover:border-rojizo-oscuro hover:bg-rojizo-oscuro hover:text-white'
  if (!hayRedes) return null
  return (
    <ul className={`flex gap-3 ${className}`}>
      {REDES.map(({ nombre, url, Icono }) => (
        <li key={nombre}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${nombre} (se abre en una nueva pestaña)`}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border transition duration-300 hover:-translate-y-0.5 ${estilo}`}
          >
            <Icono className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  )
}
