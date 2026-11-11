// Los dos canales de consulta (WhatsApp y correo) con un mensaje ya escrito según el tema.
import { Mail, MessageCircle } from 'lucide-react'
import { canales, enlaceWhatsApp } from '../data/evento.js'

const ESTILOS_WHATSAPP = {
  verde: 'btn bg-[#25D366] text-[#0b1f5c] hover:bg-[#3ee07c]',
  contorno: 'btn border border-[#25D366]/60 bg-white text-oscuro hover:border-[#25D366] hover:bg-[#25D366]/10',
  oscuro: 'btn border border-white/25 bg-white/5 text-white hover:border-[#25D366] hover:bg-[#25D366]/15',
}

// Un botón de WhatsApp por número. El primero puede ir destacado (verde) y el segundo en contorno.
export function BotonesWhatsApp({ mensaje, variante = 'verde', segundo = 'contorno', className = '' }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      {canales.whatsapp.map((w, i) => (
        <a
          key={w.numero}
          href={enlaceWhatsApp(w.numero, mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className={ESTILOS_WHATSAPP[i === 0 ? variante : segundo]}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> {w.texto}
        </a>
      ))}
    </div>
  )
}

// Los correos como enlaces (abren el programa de correo con el asunto escrito)
export function EnlacesCorreo({ asunto, cuerpo, className = '', claseEnlace = 'text-oscuro hover:text-rojizo-oscuro' }) {
  const consulta = [asunto && `subject=${encodeURIComponent(asunto)}`, cuerpo && `body=${encodeURIComponent(cuerpo)}`].filter(Boolean).join('&')
  return (
    <ul className={`space-y-1.5 ${className}`}>
      {canales.correos.map((c) => (
        <li key={c}>
          <a href={`mailto:${c}${consulta ? `?${consulta}` : ''}`} className={`inline-flex items-center gap-2 font-semibold [overflow-wrap:anywhere] transition ${claseEnlace}`}>
            <Mail className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" /> {c}
          </a>
        </li>
      ))}
    </ul>
  )
}
