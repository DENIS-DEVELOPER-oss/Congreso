// Carruseles accesibles sin librerías:
// - useCarrusel: diapositivas que cambian solas (portada). Se pausa con el mouse encima, con el foco dentro,
//   con la pestaña oculta o si la persona pidió reducir el movimiento. Se puede deslizar con el dedo y usar las flechas del teclado.
// - CarruselTarjetas: fila de tarjetas que se desplaza con flechas y deslizando (ponentes, etc.).
import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// detenido: pausa pedida con el botón de pausa (se mantiene hasta que la persona la quite)
export function useCarrusel({ total, intervalo = 7000, detenido = false }) {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [reducir, setReducir] = useState(false)
  const inicioToque = useRef(null)

  const ir = useCallback((i) => setActual(((i % total) + total) % total), [total])
  const siguiente = useCallback(() => setActual((a) => (a + 1) % total), [total])
  const anterior = useCallback(() => setActual((a) => (a - 1 + total) % total), [total])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducir(mq.matches)
    const cambio = (e) => setReducir(e.matches)
    mq.addEventListener('change', cambio)
    return () => mq.removeEventListener('change', cambio)
  }, [])

  // Avance automático (se reinicia cada vez que cambia la diapositiva, así un clic manual da el tiempo completo)
  const corriendo = !pausado && !reducir && !detenido
  useEffect(() => {
    if (!corriendo) return
    const t = setTimeout(() => {
      if (document.visibilityState === 'visible') siguiente()
    }, intervalo)
    return () => clearTimeout(t)
  }, [actual, corriendo, intervalo, siguiente])

  const contenedor = {
    onMouseEnter: () => setPausado(true),
    onMouseLeave: () => setPausado(false),
    onFocus: () => setPausado(true),
    onBlur: (e) => !e.currentTarget.contains(e.relatedTarget) && setPausado(false),
    onKeyDown: (e) => {
      if (e.key === 'ArrowRight') siguiente()
      if (e.key === 'ArrowLeft') anterior()
    },
    onPointerDown: (e) => {
      if (e.pointerType !== 'mouse') inicioToque.current = e.clientX
    },
    onPointerUp: (e) => {
      if (inicioToque.current === null) return
      const dx = e.clientX - inicioToque.current
      inicioToque.current = null
      if (Math.abs(dx) > 50) (dx < 0 ? siguiente : anterior)()
    },
  }

  return { actual, ir, siguiente, anterior, corriendo, contenedor }
}

// Fila de tarjetas con desplazamiento por "páginas" (lo que entra en pantalla)
export function CarruselTarjetas({ children, etiqueta, claseItem = 'w-[78%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]' }) {
  const pista = useRef(null)
  const [estado, setEstado] = useState({ inicio: true, fin: false, pagina: 0, paginas: 1 })
  const items = Children.toArray(children)

  const medir = useCallback(() => {
    const el = pista.current
    if (!el) return
    const paginas = Math.max(1, Math.round(el.scrollWidth / el.clientWidth))
    setEstado({
      inicio: el.scrollLeft < 8,
      fin: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
      pagina: Math.min(paginas - 1, Math.round(el.scrollLeft / el.clientWidth)),
      paginas,
    })
  }, [])

  useEffect(() => {
    medir()
    const el = pista.current
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [medir])

  const mover = (dir) => {
    const el = pista.current
    el.scrollBy({ left: dir * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const boton = 'flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-oscuro shadow-suave transition hover:border-rojizo-oscuro hover:text-rojizo-oscuro disabled:pointer-events-none disabled:opacity-35'

  return (
    <div role="region" aria-roledescription="carrusel" aria-label={etiqueta}>
      <ul
        ref={pista}
        onScroll={medir}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pt-2 pb-6 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((hijo, i) => (
          <li key={i} className={`shrink-0 snap-start ${claseItem}`}>
            {hijo}
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: estado.paginas }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === estado.pagina ? 'w-8 bg-rojizo-oscuro' : 'w-1.5 bg-slate-300'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className={boton} onClick={() => mover(-1)} disabled={estado.inicio} aria-label="Anteriores">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className={boton} onClick={() => mover(1)} disabled={estado.fin} aria-label="Siguientes">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
