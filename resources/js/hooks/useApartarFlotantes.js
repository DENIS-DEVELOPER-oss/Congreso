import { useEffect, useState } from 'react'

// Devuelve true cuando un botón de envío de formulario (o cualquier elemento con data-apartar-flotantes)
// queda en la franja inferior de la pantalla, donde están los botones flotantes (WhatsApp, volver arriba).
// Así esos botones se apartan y nunca tapan "Registrarme", "Enviar voucher", etc.
const ZONA = 140 // px desde el borde inferior que ocupan los botones flotantes

export function useApartarFlotantes() {
  const [apartar, setApartar] = useState(false)

  useEffect(() => {
    let raf = 0
    const revisar = () => {
      raf = 0
      const alto = window.innerHeight
      const ancho = window.innerWidth
      const choca = [...document.querySelectorAll('form button[type=submit], [data-apartar-flotantes]')].some((el) => {
        const r = el.getBoundingClientRect()
        // Visible, dentro de la franja inferior y llegando a la mitad derecha (donde están los flotantes)
        return r.width > 0 && r.bottom > alto - ZONA && r.top < alto && r.right > ancho / 2
      })
      setApartar(choca)
    }
    const programar = () => {
      if (!raf) raf = requestAnimationFrame(revisar)
    }
    revisar()
    window.addEventListener('scroll', programar, { passive: true })
    window.addEventListener('resize', programar)
    // Los formularios cambian de alto (errores, archivos adjuntos): se revisa también al cambiar el contenido
    const observador = new MutationObserver(programar)
    observador.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.removeEventListener('scroll', programar)
      window.removeEventListener('resize', programar)
      observador.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return apartar
}
