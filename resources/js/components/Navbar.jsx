import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, KeyRound, Mail, Menu, MessageCircle, X } from 'lucide-react'
import { aliados } from '../data/aliados.js'
import { evento } from '../data/evento.js'
import { enlace, RUTAS } from '../lib/rutas.js'
import Logo from './Logo.jsx'

const PRINCIPALES = [
  { href: '#inicio', texto: 'Inicio' },
  { href: '#presentacion', texto: 'Presentación' },
  { href: '#ejes', texto: 'Ejes' },
  { href: '#programa', texto: 'Programa' },
  { href: '#ponentes', texto: 'Ponentes' },
  { href: '#convocatoria', texto: 'Convocatoria' },
  { href: '#inscripcion', texto: 'Inscripción' },
]

const SECUNDARIOS = [
  { href: '#comites', texto: 'Comités' },
  { href: '#modalidad', texto: 'Cómo funciona' },
  { href: '#cuenta', texto: 'Aula virtual' },
  { href: '#descargas', texto: 'Descargas' },
  { href: '#afiches', texto: 'Afiches' },
  { href: '#preguntas', texto: 'Preguntas frecuentes' },
  { href: '#contacto', texto: 'Contacto' },
]

const TODOS = [...PRINCIPALES, ...SECUNDARIOS]

// Barra dorada bajo la pestaña activa; al pasar el mouse se dibuja a medias
function Indicador({ visible }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-[11px] bottom-0 h-[3px] origin-left rounded-t-sm transition-transform duration-300 ${
        visible ? 'scale-x-100 bg-naranja' : 'scale-x-0 bg-naranja/60 group-hover/enlace:scale-x-100'
      }`}
    />
  )
}

function EnlaceMovil({ e, i, abierto, activo, onCerrar, destino }) {
  return (
    <li
      className={`transition duration-500 ${abierto ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
      style={{ transitionDelay: abierto ? `${i * 30}ms` : '0ms' }}
    >
      <a
        href={destino(e.href)}
        aria-current={activo === e.href ? 'true' : undefined}
        onClick={onCerrar}
        className={`flex items-center justify-between rounded-md px-4 py-2.5 text-base font-medium transition ${
          activo === e.href ? 'bg-rojizo/8 text-rojizo-oscuro' : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        {e.texto}
        {activo === e.href && <span className="h-1.5 w-1.5 rounded-full bg-rojizo" aria-hidden="true" />}
      </a>
    </li>
  )
}

// Cinta con los organizadores (en el orden del afiche) que pasa de derecha a izquierda; se detiene con el mouse encima.
// Cada mitad repite la lista dos veces para que no queden huecos en pantallas anchas.
function CintaOrganizadores() {
  const vuelta = [...aliados, ...aliados]
  return (
    <div className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
      <ul className="flex w-max animate-carrusel items-center [animation-duration:75s] group-hover:[animation-play-state:paused]">
        {[...vuelta, ...vuelta].map((a, i) => (
          <li key={i} aria-hidden={i >= aliados.length ? true : undefined} className="flex items-center gap-2 uppercase">
            <img src={a.emblema ?? a.logo} alt="" className="h-7 w-auto shrink-0 object-contain drop-shadow-[0_1px_2px_rgb(0_0_0/0.35)]" />
            <span className="whitespace-nowrap">{a.nombre}</span>
            <span className="mx-5 text-naranja" aria-hidden="true">
              ·
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Franja institucional sobre el menú (como la cabecera de los afiches). Se oculta al bajar la página.
function FranjaInstitucional({ oculta }) {
  return (
    <div
      className={`overflow-hidden bg-[#0b1f5c] text-white transition-[max-height,opacity] duration-500 ${oculta ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}
      aria-hidden={oculta || undefined}
    >
      <div className="contenedor flex h-9 items-center justify-between gap-4 px-4 text-[11px] font-semibold tracking-wide sm:px-6 sm:text-xs">
        <CintaOrganizadores />
        <div className="hidden shrink-0 items-center gap-5 font-medium normal-case sm:flex">
          <a href={`mailto:${evento.correo}`} tabIndex={oculta ? -1 : undefined} className="inline-flex items-center gap-1.5 text-white/85 transition hover:text-naranja">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {evento.correo}
          </a>
          <a
            href={`https://wa.me/${evento.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={oculta ? -1 : undefined}
            className="inline-flex items-center gap-1.5 text-white/85 transition hover:text-naranja"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> {evento.telefono}
          </a>
        </div>
      </div>
      <span className="block h-0.5 bg-naranja" aria-hidden="true" />
    </div>
  )
}

// pagina: 'inicio' (portada de una sola página) o el nombre de una página interna ('inscripcion', 'certificados')
export default function Navbar({ pagina = 'inicio' }) {
  const enInicio = pagina === 'inicio'
  const destino = (href) => enlace(href, pagina)
  const [abierto, setAbierto] = useState(false)
  const [masAbierto, setMasAbierto] = useState(false)
  const [conScroll, setConScroll] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [activo, setActivo] = useState(enInicio ? '#inicio' : `#${pagina}`)
  const masRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setConScroll(window.scrollY > 24)
        setProgreso(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Resalta el enlace de la sección visible (solo en la portada; en las páginas internas queda fijo)
  useEffect(() => {
    if (!enInicio) return
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActivo(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    TODOS.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [enInicio])

  // Cierra menús con Esc o al hacer clic fuera del desplegable
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setAbierto(false)
        setMasAbierto(false)
      }
    }
    const onClick = (e) => masRef.current && !masRef.current.contains(e.target) && setMasAbierto(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  // Arriba la barra es transparente; al hacer scroll (o abrir el menú) se vuelve sólida
  const solido = conScroll || abierto
  const nombreCorto = evento.nombre.replace(/^Congreso\s+/i, '')
  const masActivo = SECUNDARIOS.some((s) => s.href === activo)

  // Menú tipo pestañas (estilo institucional): texto limpio y una barra dorada en el borde inferior de la barra
  const claseEnlace = (esActivo) =>
    `group/enlace relative flex h-full items-center px-[11px] text-[0.875rem] font-semibold whitespace-nowrap transition-colors duration-200 ${
      esActivo ? 'text-[#0b1f5c]' : 'text-slate-600 hover:text-[#0b1f5c]'
    }`

  const movil = { abierto, activo, destino, onCerrar: () => setAbierto(false) }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solido
          ? 'border-b border-black/5 bg-white/90 shadow-[0_8px_30px_-16px_rgb(0_0_0/0.25)] backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <FranjaInstitucional oculta={conScroll} />

      <div
        className="listado-textil absolute inset-x-0 top-0 h-[3px] origin-left"
        style={{ transform: `scaleX(${progreso})` }}
        aria-hidden="true"
      />

      <nav
        className={`contenedor flex items-center justify-between px-4 transition-[height] duration-500 sm:px-6 ${conScroll ? 'h-16' : 'h-20'}`}
        aria-label="Navegación principal"
      >
        <div className="flex h-full items-center">
          <a href={destino('#inicio')} className="group flex items-center gap-3" onClick={() => setAbierto(false)}>
            <Logo className="h-11 w-9 transition-transform duration-500 group-hover:scale-105" />
            <span className="flex flex-col leading-none text-oscuro">
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#1d4ed8] uppercase">I Congreso Internacional</span>
              <span className="mt-1.5 font-display text-[15px] font-extrabold tracking-tight whitespace-nowrap min-[360px]:text-base min-[400px]:text-lg">{nombreCorto}</span>
            </span>
          </a>
          <span className="ml-5 hidden h-9 w-px bg-slate-300/80 xl:block" aria-hidden="true" />
        </div>

        <ul className="hidden h-full items-stretch xl:ml-2 xl:flex">
          {PRINCIPALES.map((e) => (
            <li key={e.href}>
              <a href={destino(e.href)} aria-current={activo === e.href ? 'true' : undefined} className={claseEnlace(activo === e.href)}>
                {e.texto}
                <Indicador visible={activo === e.href} />
              </a>
            </li>
          ))}
          <li className="relative" ref={masRef}>
            <button
              type="button"
              aria-expanded={masAbierto}
              aria-controls="menu-mas"
              onClick={() => setMasAbierto((v) => !v)}
              className={`${claseEnlace(masActivo || masAbierto)} gap-1`}
            >
              Más
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${masAbierto ? 'rotate-180' : ''}`} aria-hidden="true" />
              <Indicador visible={masActivo} />
            </button>
            <div
              id="menu-mas"
              inert={!masAbierto}
              className={`absolute top-full right-0 w-60 origin-top-right rounded-b-lg border border-t-2 border-black/5 border-t-naranja bg-white p-2 shadow-elevada transition duration-200 ${
                masAbierto ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
              }`}
            >
              <ul>
                {SECUNDARIOS.map((e) => (
                  <li key={e.href}>
                    <a
                      href={destino(e.href)}
                      onClick={() => setMasAbierto(false)}
                      aria-current={activo === e.href ? 'true' : undefined}
                      className={`block rounded-md border-l-2 px-4 py-2.5 text-sm font-semibold transition ${
                        activo === e.href ? 'border-naranja bg-[#0b1f5c]/5 text-[#0b1f5c]' : 'border-transparent text-slate-700 hover:border-naranja/60 hover:bg-slate-50'
                      }`}
                    >
                      {e.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>

        <div className="flex items-center gap-4 xl:gap-2">
          <a
            href={RUTAS.cuenta}
            aria-current={pagina === 'cuenta' ? 'page' : undefined}
            title="Aula virtual"
            className="hidden items-center gap-1.5 text-[0.875rem] font-semibold whitespace-nowrap text-slate-700 transition hover:text-[#0b1f5c] md:inline-flex xl:h-10 xl:w-10 xl:justify-center xl:rounded-md xl:hover:bg-slate-900/5"
          >
            {/* Con el menú completo (xl) solo cabe el ícono; el nombre queda para lectores de pantalla y al pasar el mouse */}
            <KeyRound className="h-4 w-4 text-[#1d4ed8] xl:h-[18px] xl:w-[18px]" aria-hidden="true" /> <span className="xl:sr-only">Aula virtual</span>
          </a>
          {/* Un solo botón para los dos públicos: la página de inscripción ofrece «asistente» o «ponente» */}
          <a
            href={RUTAS.inscripcion}
            aria-current={pagina === 'inscripcion' ? 'page' : undefined}
            className="group hidden items-center gap-3 rounded-lg bg-linear-to-br from-[#0b1f5c] to-[#1e3a8a] py-1.5 pr-1.5 pl-4 whitespace-nowrap text-white shadow-[0_12px_28px_-14px_rgb(11_31_92/0.85)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-14px_rgb(11_31_92/0.9)] sm:inline-flex"
          >
            <span className="flex flex-col text-left leading-none">
              <span className="text-[0.9375rem] font-bold">Inscríbete</span>
              <span className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-naranja uppercase">Asistentes y ponentes</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-naranja text-[#0b1f5c] transition group-hover:bg-[#fcd34d]">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </a>
          <button
            type="button"
            className={`rounded-md p-2.5 transition xl:hidden text-oscuro hover:bg-slate-100`}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil con despliegue animado */}
      <div
        id="menu-movil"
        inert={!abierto}
        className={`grid transition-[grid-template-rows] duration-500 ease-out xl:hidden ${abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="contenedor max-h-[calc(100svh-5rem)] overflow-y-auto px-4 pt-2 pb-6 sm:px-6">
            <ul className="flex flex-col gap-0.5">
              {PRINCIPALES.map((e, i) => (
                <EnlaceMovil key={e.href} e={e} i={i} {...movil} />
              ))}
            </ul>
            <p className="mt-4 mb-1 px-4 text-xs font-bold tracking-wide text-slate-400 uppercase">Más información</p>
            <ul className="grid grid-cols-2 gap-0.5">
              {SECUNDARIOS.map((e, i) => (
                <EnlaceMovil key={e.href} e={e} i={i + PRINCIPALES.length} {...movil} />
              ))}
            </ul>
            <a href={RUTAS.inscripcion} className="btn-primario mt-4 w-full sm:hidden" onClick={() => setAbierto(false)}>
              Inscríbete · asistentes y ponentes <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
