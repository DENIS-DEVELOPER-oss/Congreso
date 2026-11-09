// Ilustración del lago Titicaca al amanecer: nevados, isla, balsa de totora y totora en la orilla.
import { useId } from 'react'

export default function PaisajeTiticaca({ className = '' }) {
  const id = 'p' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-cielo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2f7" />
          <stop offset="1" stopColor="#c9d5e3" />
        </linearGradient>
        <linearGradient id={`${id}-lago`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#16283f" />
        </linearGradient>
      </defs>

      {/* Cielo y sol */}
      <rect width="400" height="180" fill={`url(#${id}-cielo)`} />
      <circle cx="292" cy="112" r="62" fill="#fbbf24" opacity="0.15" />
      <circle cx="292" cy="112" r="34" fill="#fbbf24" />

      {/* Nevados de la cordillera */}
      <path d="M0 176 L40 146 L70 156 L110 120 L142 144 L176 110 L212 140 L250 128 L290 152 L330 126 L370 146 L400 136 L400 180 L0 180Z" fill="#94a6ba" />
      <path d="M100 129 L110 120 L121 130 L114 127 L110 132 L105 127Z" fill="#fff" />
      <path d="M165 121 L176 110 L188 122 L180 119 L176 124 L171 119Z" fill="#fff" />
      <path d="M320 134 L330 126 L341 135 L334 133 L330 137 L325 133Z" fill="#fff" />

      {/* Cerros de la orilla */}
      <path d="M0 186 Q55 152 118 178 T236 184 L236 192 L0 192Z" fill="#3a4a5f" />
      <path d="M180 190 Q260 166 400 182 L400 192 L180 192Z" fill="#4f6076" />

      {/* Lago */}
      <rect y="188" width="400" height="112" fill={`url(#${id}-lago)`} />
      {/* Reflejo del sol */}
      <g fill="#fbbf24" opacity="0.55">
        <rect x="270" y="196" width="44" height="2.5" rx="1.25" />
        <rect x="278" y="205" width="28" height="2.5" rx="1.25" />
        <rect x="284" y="214" width="16" height="2" rx="1" />
        <rect x="288" y="222" width="8" height="2" rx="1" />
      </g>
      {/* Olas suaves */}
      <g fill="#fff" opacity="0.22">
        <rect x="30" y="204" width="60" height="1.5" rx="0.75" />
        <rect x="150" y="214" width="80" height="1.5" rx="0.75" />
        <rect x="60" y="262" width="90" height="1.5" rx="0.75" />
        <rect x="250" y="250" width="70" height="1.5" rx="0.75" />
        <rect x="330" y="275" width="50" height="1.5" rx="0.75" />
      </g>

      {/* Isla (Taquile) */}
      <path d="M232 204 Q262 184 300 200 Q318 196 336 204Z" fill="#0b1f5c" opacity="0.85" />

      {/* Balsa de totora con remero, meciéndose */}
      <g className="animate-mecer" style={{ transformOrigin: '130px 232px', transformBox: 'fill-box' }}>
        <path d="M86 226 Q130 242 174 226 L180 216 Q130 232 80 216Z" fill="#b39762" />
        <path d="M92 226 Q130 236 168 226" stroke="#7a6640" strokeWidth="1.2" fill="none" />
        <rect x="127" y="204" width="5" height="18" rx="2" fill="#0b1f5c" />
        <circle cx="129.5" cy="200" r="3.5" fill="#0b1f5c" />
        <line x1="142" y1="196" x2="122" y2="246" stroke="#0b1f5c" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* Totora en primer plano */}
      <g stroke="#a8925f" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M14 300 Q12 262 18 228" />
        <path d="M24 300 Q26 270 22 240" />
        <path d="M34 300 Q30 258 40 222" />
        <path d="M44 300 Q46 274 52 250" />
        <path d="M372 300 Q376 266 370 236" />
        <path d="M384 300 Q382 262 390 230" />
        <path d="M394 300 Q398 276 396 252" />
      </g>
      <g fill="#7a6640">
        <ellipse cx="18" cy="226" rx="2" ry="5" />
        <ellipse cx="40" cy="220" rx="2" ry="5" />
        <ellipse cx="390" cy="228" rx="2" ry="5" />
      </g>
    </svg>
  )
}
