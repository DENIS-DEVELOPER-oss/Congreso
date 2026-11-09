// Verificación anti-bots de Cloudflare Turnstile.
// Solo se activa si VITE_TURNSTILE_SITEKEY está definido en .env; si no, no muestra nada.
import { useEffect, useRef } from 'react'

export const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY || ''

let cargando = null
function cargarScript() {
  if (window.turnstile) return Promise.resolve()
  if (!cargando) {
    cargando = new Promise((resolver, rechazar) => {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = resolver
      s.onerror = rechazar
      document.head.appendChild(s)
    })
  }
  return cargando
}

export default function Turnstile({ onToken }) {
  const ref = useRef(null)
  const callback = useRef(onToken)

  useEffect(() => {
    callback.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!TURNSTILE_SITEKEY) return
    let id
    let vigente = true
    cargarScript()
      .then(() => {
        if (!vigente || !ref.current) return
        id = window.turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITEKEY,
          language: 'es',
          callback: (t) => callback.current(t),
          'expired-callback': () => callback.current(''),
          'error-callback': () => callback.current(''),
        })
      })
      .catch(() => {})
    return () => {
      vigente = false
      if (id !== undefined) window.turnstile?.remove(id)
    }
  }, [])

  if (!TURNSTILE_SITEKEY) return null
  return <div ref={ref} className="min-h-[65px]" />
}
