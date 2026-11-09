import { useEffect, useRef, useState } from 'react'

// Devuelve [ref, visible]: visible pasa a true la primera vez que el elemento entra en pantalla.
export function useEnVista({ umbral = 0.15, margen = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect()
        }
      },
      { threshold: umbral, rootMargin: margen },
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [umbral, margen])

  return [ref, visible]
}
