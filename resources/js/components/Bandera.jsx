// Banderas de los países de los ponentes, dibujadas en SVG (los emojis de bandera no se ven en Windows).
// Proporción 3:2, con un borde fino para que la franja blanca no se pierda sobre fondos claros.
const BANDERAS = {
  Perú: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="10" height="20" fill="#d91023" />
      <rect x="20" width="10" height="20" fill="#d91023" />
    </>
  ),
  Argentina: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#74acdf" />
      <rect y="13.33" width="30" height="6.67" fill="#74acdf" />
      <circle cx="15" cy="10" r="2.2" fill="#f6b40e" stroke="#85340a" strokeWidth="0.35" />
    </>
  ),
  México: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="10" height="20" fill="#006847" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
      <circle cx="15" cy="10" r="2.4" fill="#8c5a2b" />
      <path d="M12.6 11.6c.8 1.1 3.9 1.1 4.8 0" fill="none" stroke="#006847" strokeWidth="0.7" strokeLinecap="round" />
    </>
  ),
}

export default function Bandera({ pais, className = 'h-3 w-[18px]' }) {
  const dibujo = BANDERAS[pais]
  if (!dibujo) return null
  return (
    <svg viewBox="0 0 30 20" className={`shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_0.5px_rgb(15_23_42/0.25)] ${className}`} role="img" aria-label={`Bandera de ${pais}`}>
      {dibujo}
    </svg>
  )
}
