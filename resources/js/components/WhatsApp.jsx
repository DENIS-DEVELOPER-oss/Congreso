import { MessageCircle } from 'lucide-react'
import { evento } from '../data/evento.js'
import { useApartarFlotantes } from '../hooks/useApartarFlotantes.js'

// Botón flotante de WhatsApp: la línea de consultas siempre está a la mano. Si debajo hay un botón de envío,
// sube lo justo para no taparlo (solo se oculta si tendría que subir más de media pantalla).
export default function WhatsApp() {
  const subir = useApartarFlotantes()
  const oculto = subir > window.innerHeight / 2
  const mensaje = encodeURIComponent(`Hola, tengo una consulta sobre el ${evento.nombre}.`)
  return (
    <a
      href={`https://wa.me/${evento.whatsapp}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Consultas por WhatsApp al ${evento.telefono} (se abre en una nueva pestaña)`}
      tabIndex={oculto ? -1 : undefined}
      style={subir && !oculto ? { transform: `translateY(-${subir}px)` } : undefined}
      className={`group fixed right-3 bottom-3 z-40 flex items-center gap-3 transition duration-300 sm:right-6 sm:bottom-6 ${
        oculto ? 'pointer-events-none translate-x-24 opacity-0' : ''
      }`}
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-md bg-white px-4 py-2 text-right text-sm font-semibold text-oscuro opacity-0 shadow-elevada transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        ¿Dudas? Escríbenos
        <span className="block text-xs font-medium text-slate-500">Consultas: {evento.telefono}</span>
      </span>
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.7)] transition duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
        <MessageCircle className="relative h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      </span>
    </a>
  )
}
