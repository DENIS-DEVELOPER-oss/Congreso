// Escudo de la Escuela (a color). Si la imagen no existe o falla, muestra una chakana en su lugar
// (así nunca aparece el ícono de imagen rota).
import { useState } from 'react'
import { Chakana } from './Andino.jsx'

const ALT = 'Escudo de la Escuela Profesional de Sociología – UNA Puno'

export default function Logo({ className = 'h-10 w-10', alt = ALT, src = '/insignias/sociologia.png' }) {
  const [fallo, setFallo] = useState(false)

  if (fallo) {
    return (
      <span
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white text-rojizo-oscuro shadow-sm ${className}`}
      >
        <Chakana className="h-1/2 w-1/2" />
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFallo(true)}
      className={`shrink-0 rounded-full bg-white object-contain p-1 shadow-sm ${className}`}
    />
  )
}
