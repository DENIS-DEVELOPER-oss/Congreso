// Efectos interactivos con JavaScript. Todos se desactivan si el usuario pidió reducir el movimiento,
// y los que dependen del mouse solo se activan con puntero fino (no en celulares).
import { useEffect, useRef } from 'react'

const reducirMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const punteroFino = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

// ---------------------------------------------------------------------------------------------
// Hilos tejidos: líneas horizontales que ondulan como la urdimbre de un telar y se apartan
// suavemente al pasar el mouse. Pequeños rombos marcan los "nudos" en los hilos dorados.
// ---------------------------------------------------------------------------------------------
export function HilosTejidos({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const quieto = reducirMovimiento()
    let ancho = 0
    let alto = 0
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }

    const ajustarTamano = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      ancho = r.width
      alto = r.height
      canvas.width = ancho * dpr
      canvas.height = alto * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const dibujar = (t) => {
      ctx.clearRect(0, 0, ancho, alto)
      // el mouse se mueve con retraso para que el hilo "responda" con suavidad
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08

      const hilos = Math.max(10, Math.round(alto / 46))
      const separacion = alto / (hilos + 1)
      for (let i = 0; i < hilos; i++) {
        const dorado = i % 3 === 1
        const base = separacion * (i + 1)
        const fase = i * 0.9
        const amplitud = 6 + (i % 4) * 2
        ctx.beginPath()
        const nudos = []
        for (let x = 0; x <= ancho + 12; x += 12) {
          let y = base + Math.sin(x * 0.006 + t * 0.00045 + fase) * amplitud + Math.sin(x * 0.017 - t * 0.0003 + fase) * 2
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 40000) {
            // empuje gaussiano hacia afuera del cursor
            y += Math.sign(dy || 1) * 34 * Math.exp(-d2 / 9000)
          }
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
          if (dorado && x % 168 === 0) nudos.push([x, y])
        }
        ctx.strokeStyle = dorado ? 'rgba(200,169,106,0.22)' : 'rgba(140,170,210,0.13)'
        ctx.lineWidth = dorado ? 1.2 : 1
        ctx.stroke()

        ctx.fillStyle = 'rgba(200,169,106,0.45)'
        for (const [x, y] of nudos) {
          ctx.beginPath()
          ctx.moveTo(x, y - 3.5)
          ctx.lineTo(x + 3.5, y)
          ctx.lineTo(x, y + 3.5)
          ctx.lineTo(x - 3.5, y)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    const bucle = (t) => {
      raf = 0
      if (!visible || document.hidden) return
      dibujar(t)
      raf = requestAnimationFrame(bucle)
    }
    const arrancar = () => {
      if (!raf && !quieto) raf = requestAnimationFrame(bucle)
    }

    const alMover = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.tx = e.clientX - r.left
      mouse.ty = e.clientY - r.top
    }
    const alSalir = () => {
      mouse.tx = -9999
      mouse.ty = -9999
    }

    ajustarTamano()
    dibujar(0)
    const ro = new ResizeObserver(() => {
      ajustarTamano()
      dibujar(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible) arrancar()
    })
    io.observe(canvas)
    const alCambiarPestana = () => !document.hidden && arrancar()
    document.addEventListener('visibilitychange', alCambiarPestana)
    if (punteroFino()) {
      window.addEventListener('pointermove', alMover, { passive: true })
      document.documentElement.addEventListener('pointerleave', alSalir)
    }
    arrancar()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', alCambiarPestana)
      window.removeEventListener('pointermove', alMover)
      document.documentElement.removeEventListener('pointerleave', alSalir)
    }
  }, [])

  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} aria-hidden="true" />
}

// ---------------------------------------------------------------------------------------------
// Tarjeta que se inclina en 3D siguiendo al mouse, con un reflejo de luz.
// ---------------------------------------------------------------------------------------------
export function Inclinable({ as: Etiqueta = 'article', className = '', children, max = 6, ...props }) {
  const ref = useRef(null)
  const activo = useRef(false)

  useEffect(() => {
    activo.current = punteroFino() && !reducirMovimiento()
  }, [])

  const mover = (e) => {
    if (!activo.current) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.transition = 'transform 0.12s ease-out'
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-4px)`
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
    el.style.setProperty('--go', '1')
  }
  const salir = () => {
    if (!activo.current) return
    const el = ref.current
    el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)'
    el.style.transform = ''
    el.style.setProperty('--go', '0')
  }

  return (
    <Etiqueta ref={ref} onPointerMove={mover} onPointerLeave={salir} className={`[transform-style:preserve-3d] ${className}`} {...props}>
      {children}
      <span
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[var(--go,0)] transition-opacity duration-500 [background:radial-gradient(500px_circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.14),transparent_40%)]"
        aria-hidden="true"
      />
    </Etiqueta>
  )
}

// ---------------------------------------------------------------------------------------------
// Botón o enlace "magnético": se desplaza unos píxeles hacia el cursor cuando este se acerca.
// ---------------------------------------------------------------------------------------------
export function Magnetico({ as: Etiqueta = 'a', fuerza = 0.25, className = '', children, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!punteroFino() || reducirMovimiento()) return
    const mover = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transition = 'transform 0.2s ease-out'
      el.style.transform = `translate(${Math.max(-10, Math.min(10, dx * fuerza))}px, ${Math.max(-8, Math.min(8, dy * fuerza))}px)`
    }
    const salir = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1.4)'
      el.style.transform = ''
    }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', salir)
    return () => {
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerleave', salir)
    }
  }, [fuerza])

  return (
    <Etiqueta ref={ref} className={className} {...props}>
      {children}
    </Etiqueta>
  )
}

// ---------------------------------------------------------------------------------------------
// Línea de progreso para una línea de tiempo: se llena a medida que la lista cruza la pantalla.
// Se coloca dentro de un contenedor con position: relative.
// ---------------------------------------------------------------------------------------------
export function LineaProgreso({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const linea = ref.current
    const lista = linea.parentElement
    if (reducirMovimiento()) {
      linea.style.transform = 'scaleY(1)'
      return
    }
    let raf = 0
    const actualizar = () => {
      raf = 0
      const r = lista.getBoundingClientRect()
      const p = (window.innerHeight * 0.65 - r.top) / r.height
      linea.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(actualizar)
    }
    actualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <span ref={ref} className={`absolute origin-top ${className}`} style={{ transform: 'scaleY(0)' }} aria-hidden="true" />
}
