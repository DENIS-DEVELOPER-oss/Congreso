// Banderas de los países de los ponentes (SVG simple: se ve igual en todos los sistemas, a diferencia de los emojis)
const BANDERAS = {
  Perú: (
    <>
      <rect width="30" height="20" fill="#d91023" />
      <rect x="10" width="10" height="20" fill="#ffffff" />
    </>
  ),
  Argentina: (
    <>
      <rect width="30" height="20" fill="#74acdf" />
      <rect y="6.67" width="30" height="6.67" fill="#ffffff" />
      <circle cx="15" cy="10" r="2.2" fill="#f6b40e" />
    </>
  ),
  México: (
    <>
      <rect width="30" height="20" fill="#ffffff" />
      <rect width="10" height="20" fill="#006847" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
      <circle cx="15" cy="10" r="2.2" fill="#8c6a3c" />
    </>
  ),
}

export default function Banderas({ paises, className = 'h-5 w-[30px]' }) {
  return (
    <span className="inline-flex items-center gap-2">
      {paises
        .filter((p) => BANDERAS[p])
        .map((p) => (
          <svg key={p} viewBox="0 0 30 20" className={`${className} rounded-[3px] shadow-sm ring-1 ring-white/30`} role="img" aria-label={p}>
            {BANDERAS[p]}
          </svg>
        ))}
    </span>
  )
}
