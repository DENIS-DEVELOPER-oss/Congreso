// Paisaje del altiplano de día para el fondo de la portada: cielo claro, cordillera nevada,
// lago Titicaca con reflejos y orillas con totora. Las capas se desplazan
// levemente con el mouse (más las cercanas que las lejanas) para dar profundidad.
import { useEffect, useRef } from 'react'

// Posición del sol, a la derecha, sobre el contenido del carrusel
const SOL_X = 1060

// Capa que se mueve con el mouse según su profundidad (px de desplazamiento máximo)
const capa = (px, py = px / 2) => ({
  transform: `translate(calc(var(--mx, 0) * ${px}px), calc(var(--my, 0) * ${py}px))`,
  transition: 'transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1)',
})

function Totoras({ x, escala = 1 }) {
  return (
    <g transform={`translate(${x} 0) scale(${escala} 1)`} stroke="#24418f" strokeLinecap="round" fill="none">
      <path d="M0 900 Q4 820 -6 760" strokeWidth="3" />
      <path d="M14 900 Q16 810 26 742" strokeWidth="3" />
      <path d="M28 900 Q26 830 18 780" strokeWidth="2.5" />
      <path d="M40 900 Q46 820 58 770" strokeWidth="2.5" />
      <path d="M-14 900 Q-18 840 -30 790" strokeWidth="2.5" />
      <ellipse cx="26" cy="740" rx="3" ry="9" fill="#24418f" stroke="none" />
      <ellipse cx="-6" cy="758" rx="2.5" ry="8" fill="#24418f" stroke="none" />
    </g>
  )
}

export default function PaisajeHero({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mover = (e) => {
      el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
      el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => window.removeEventListener('pointermove', mover)
  }, [])

  return (
    <svg
      ref={ref}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ph-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6e5f4" />
          <stop offset="0.4" stopColor="#e9f1f9" />
          <stop offset="0.62" stopColor="#f6f4ee" />
          <stop offset="0.74" stopColor="#f8efdf" />
        </linearGradient>
        <radialGradient id="ph-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff8e8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#fbe7c2" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fbe7c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ph-lago" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9dbfe0" />
          <stop offset="0.4" stopColor="#6e98c6" />
          <stop offset="1" stopColor="#4a76a8" />
        </linearGradient>
        <linearGradient id="ph-reflejo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d29a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f3d29a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ph-nieve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f1ea" />
          <stop offset="1" stopColor="#c9d3df" />
        </linearGradient>
      </defs>

      {/* Cielo */}
      <rect width="1600" height="900" fill="url(#ph-cielo)" />

      {/* Sol y su halo */}
      <g style={capa(-6)}>
        {/* luz suave de la mañana sobre el horizonte */}
        <ellipse cx="800" cy="640" rx="1100" ry="160" fill="url(#ph-halo)" opacity="0.8" />
        <circle cx={SOL_X} cy="250" r="260" fill="url(#ph-halo)" />
        <circle cx={SOL_X} cy="250" r="46" fill="#fffaf0" />
        {/* nubes */}
        <g fill="#ffffff" opacity="0.85">
          <ellipse cx="300" cy="200" rx="120" ry="18" />
          <ellipse cx="360" cy="186" rx="70" ry="20" />
          <ellipse cx="1320" cy="150" rx="140" ry="16" />
          <ellipse cx="1260" cy="138" rx="60" ry="16" />
          <ellipse cx="760" cy="330" rx="90" ry="10" opacity="0.7" />
        </g>
      </g>

      {/* Cordillera lejana con nevados */}
      <g style={capa(-10)}>
        <path
          d="M-60 700 L-60 620 L60 596 L150 612 L250 560 L330 588 L420 538 L520 582 L600 556 L700 598 L790 566 L880 512 L960 556 L1040 528 L1120 572 L1220 540 L1300 492 L1390 536 L1470 516 L1560 556 L1660 540 L1660 700Z"
          fill="#a9bdd6"
        />
        <path d="M880 512 L912 540 L896 537 L884 548 L872 538 L858 541Z" fill="url(#ph-nieve)" opacity="0.9" />
        <path d="M1300 492 L1340 526 L1320 522 L1306 535 L1292 523 L1272 528Z" fill="url(#ph-nieve)" opacity="0.9" />
        <path d="M420 538 L446 560 L432 558 L422 566 L410 557 L398 560Z" fill="url(#ph-nieve)" opacity="0.8" />
        <path d="M250 560 L270 576 L258 575 L250 582 L241 575 L232 577Z" fill="url(#ph-nieve)" opacity="0.7" />
      </g>

      {/* Cerros intermedios */}
      <g style={capa(-16)}>
        <path
          d="M-60 720 L-60 668 L120 640 L240 662 L370 626 L480 656 L610 636 L730 668 L870 640 L990 670 L1110 646 L1250 676 L1370 650 L1490 672 L1660 652 L1660 720Z"
          fill="#7f9bbd"
        />
      </g>

      {/* Lago con el reflejo del sol */}
      <rect y="700" width="1600" height="200" fill="url(#ph-lago)" />
      <g style={capa(-16)}>
        <ellipse cx={SOL_X} cy="760" rx="90" ry="70" fill="url(#ph-halo)" opacity="0.4" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={i}
            x={SOL_X - (70 - i * 7)}
            y={712 + i * 18}
            width={(70 - i * 7) * 2}
            height="2"
            rx="1"
            fill="#ffffff"
            className="animate-destello"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        {[
          [180, 740, 220],
          [520, 770, 160],
          [760, 730, 120],
          [1380, 760, 180],
          [300, 820, 260],
        ].map(([x, y, w], i) => (
          <rect key={i} x={x} y={y} width={w} height="1.5" fill="#ffffff" opacity="0.35" />
        ))}
      </g>

      {/* Balsa de totora en el lago */}
      <g style={capa(-22)}>
        <g className="animate-mecer" style={{ transformOrigin: '900px 770px', transformBox: 'view-box' }}>
          <path d="M850 768 Q900 786 952 768 L958 760 Q900 776 844 760Z" fill="#1e3a8a" />
          <rect x="896" y="738" width="5" height="24" rx="2" fill="#1e3a8a" />
          <circle cx="898.5" cy="734" r="4" fill="#1e3a8a" />
          <line x1="912" y1="728" x2="886" y2="790" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* Orillas cercanas con totorales */}
      <g style={capa(-30, -10)}>
        <path d="M-60 900 L-60 812 Q160 776 380 806 T720 846 L740 900Z" fill="#2f4fa0" />
        <path d="M1660 900 L1660 798 Q1500 790 1380 818 T1120 860 L1100 900Z" fill="#2f4fa0" />
        <Totoras x={90} />
        <Totoras x={230} escala={0.8} />
        <Totoras x={1450} escala={0.9} />
        <Totoras x={1560} />
      </g>
    </svg>
  )
}
