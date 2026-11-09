// Aula virtual: el participante entra con su DNI o correo y la contraseña temporal que recibe al registrarse.
// La primera vez crea su propia contraseña. Desde aquí entra a las sesiones por Zoom, sube su voucher (si hay pago),
// envía resúmenes y descarga certificados.
import { useCallback, useEffect, useState } from 'react'
import { Award, CalendarClock, Download, ExternalLink, KeyRound, Loader2, Lock, LogOut, ShieldCheck, Video } from 'lucide-react'
import CabeceraPagina from '../components/CabeceraPagina.jsx'
import Ingreso from '../components/cuenta/Ingreso.jsx'
import Pago from '../components/cuenta/Pago.jsx'
import Resumenes from '../components/cuenta/Resumenes.jsx'
import Tarjeta from '../components/cuenta/Tarjeta.jsx'
import { AlertaError, BotonEnviar, Campo } from '../components/form/Campos.jsx'
import { useFormulario } from '../hooks/useFormulario.js'
import { enviar, obtener } from '../lib/api.js'
import Plantilla from './Plantilla.jsx'

const COLOR_ESTADO = {
  validada: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  pendiente: 'bg-amber-50 text-amber-900 ring-amber-200',
  observada: 'bg-red-50 text-red-800 ring-red-200',
  anulada: 'bg-slate-100 text-slate-700 ring-slate-200',
}

const hoyISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })

// Programa del aula con los enlaces de Zoom (bloque oscuro, lo primero que se ve)
function Sesiones({ sesiones, bloqueado }) {
  const hoy = hoyISO()
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-[#0b1f5c] p-5 text-white shadow-elevada sm:p-7">
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-naranja/15 blur-3xl" aria-hidden="true" />
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-extrabold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-naranja ring-1 ring-white/15">
            <Video className="h-5 w-5" aria-hidden="true" />
          </span>
          Mis sesiones en vivo
        </h2>
        <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">Hora de Perú</span>
      </header>

      {bloqueado && (
        <p className="mb-5 flex gap-3 rounded-xl bg-white/[0.07] p-4 text-sm text-white/85 ring-1 ring-white/10">
          <Lock className="h-5 w-5 shrink-0 text-naranja" aria-hidden="true" />
          Los enlaces de Zoom aparecerán aquí cuando validemos tu pago. Sube tu voucher más abajo.
        </p>
      )}

      {sesiones.length === 0 ? (
        <p className="text-sm text-white/70">El programa se publicará muy pronto.</p>
      ) : (
        <ol className="divide-y divide-white/10">
          {sesiones.map((s) => {
            const esHoy = s.dia === hoy
            return (
              <li key={s.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6">
                <div className="shrink-0 sm:w-48">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {s.fecha}
                    {esHoy && <span className="rounded-full bg-naranja px-2 py-0.5 text-[10px] font-bold text-tierra uppercase">Hoy</span>}
                  </p>
                  {s.horario && <p className="text-sm text-white/60">{s.horario}</p>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-snug font-bold">{s.titulo}</p>
                  {s.ponente && <p className="text-sm text-white/65">{s.ponente}</p>}
                  {s.material && (
                    <a href={s.material} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-naranja hover:underline">
                      Material de la sesión <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <div className="shrink-0">
                  {s.enlace ? (
                    <a
                      href={s.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn px-5 py-2.5 text-sm ${esHoy ? 'bg-naranja text-tierra hover:bg-[#fcd34d]' : 'border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10'}`}
                    >
                      <Video className="h-4 w-4" aria-hidden="true" /> Unirse por Zoom
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/60 ring-1 ring-white/10">
                      {bloqueado && s.tieneEnlace ? (
                        <>
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Al validar tu pago
                        </>
                      ) : (
                        <>
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Enlace pronto
                        </>
                      )}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

function Certificados({ certificados }) {
  return (
    <Tarjeta titulo="Certificados" Icono={Award}>
      {certificados.length === 0 ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Tus certificados aparecerán aquí al terminar el congreso, si registraste al menos el 80 % de asistencia.
        </p>
      ) : (
        <ul className="space-y-3">
          {certificados.map((c) => (
            <li key={c.url} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-crema/50 p-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-semibold text-oscuro">{c.tipo}</p>
                <p className="text-sm text-slate-600">{c.horas} horas académicas</p>
              </div>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn-primario px-4 py-2.5 text-sm">
                <Download className="h-4 w-4" aria-hidden="true" /> Descargar PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  )
}

// Cambio de contraseña. primera = true: primer ingreso con la contraseña temporal (no se vuelve a pedir)
function FormularioClave({ primera = false, onListo }) {
  const f = useFormulario({
    inicial: { actual: '', nueva: '', nueva_confirmation: '' },
    prefijo: primera ? 'nueva' : 'clave',
    conCaptcha: false,
    validar: (d) => {
      const e = {}
      if (!primera && !d.actual) e.actual = 'Escribe tu contraseña actual.'
      if (d.nueva.length < 8) e.nueva = 'Usa al menos 8 caracteres.'
      if (d.nueva_confirmation !== d.nueva) e.nueva_confirmation = 'Las dos contraseñas nuevas no coinciden.'
      return e
    },
    enviar: async (datos) => {
      const r = await enviar('/cuenta/clave', primera ? { nueva: datos.nueva, nueva_confirmation: datos.nueva_confirmation } : datos)
      onListo?.()
      return r
    },
  })
  const campo = (id) => ({ ...f.campo(id), valido: false, type: 'password', Icono: Lock })

  if (f.estado === 'exito' && !primera) {
    return (
      <div role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
        Contraseña actualizada. Úsala la próxima vez que ingreses.{' '}
        <button type="button" onClick={f.reiniciar} className="font-semibold underline underline-offset-2">
          Cambiar otra vez
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando}>
      <AlertaError>{f.estado === 'error' && f.mensaje}</AlertaError>
      <fieldset disabled={f.enviando} className="space-y-4">
        {!primera && <Campo {...campo('actual')} label="Contraseña actual" autoComplete="current-password" />}
        <Campo {...campo('nueva')} label={primera ? 'Tu nueva contraseña' : 'Contraseña nueva'} autoComplete="new-password" ayuda="Al menos 8 caracteres." />
        <Campo {...campo('nueva_confirmation')} label="Repite la contraseña" autoComplete="new-password" />
      </fieldset>
      {primera ? (
        <BotonEnviar enviando={f.enviando} textoEnviando="Guardando…">
          Guardar y entrar al aula
        </BotonEnviar>
      ) : (
        <button type="submit" className="btn-secundario mt-5 w-full" disabled={f.enviando}>
          {f.enviando ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      )}
    </form>
  )
}

// Primer ingreso: antes de ver el aula se crea una contraseña personal
function CrearClave({ perfil, onListo, onSalir }) {
  return (
    <div className="tarjeta-fija mx-auto max-w-xl p-6 sm:p-9">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-crema text-rojizo-oscuro ring-1 ring-naranja/40">
        <ShieldCheck className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold text-oscuro">Hola, {perfil.participante.nombres}: crea tu contraseña</h2>
      <p className="mt-2 mb-6 text-sm text-slate-600">
        Ingresaste con una contraseña temporal. Crea una propia para las próximas veces; tu usuario sigue siendo tu DNI ({perfil.participante.documento}) o tu correo.
      </p>
      <FormularioClave primera onListo={onListo} />
      <button type="button" onClick={onSalir} className="mt-4 text-sm font-semibold text-slate-500 underline underline-offset-2 hover:text-oscuro">
        Salir
      </button>
    </div>
  )
}

function Panel({ perfil, onActualizar, onSalir }) {
  const { participante, inscripcion } = perfil
  return (
    <div className="space-y-6">
      <div className="tarjeta-fija flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-sm text-slate-500">Bienvenido(a) al Aula virtual</p>
          <p className="font-display text-3xl font-extrabold text-oscuro">{participante.nombre}</p>
          <p className="mt-1 text-sm text-slate-600">
            DNI / Pasaporte {participante.documento}
            {inscripcion && <> · Código {inscripcion.codigo}</>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {inscripcion && (
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${COLOR_ESTADO[inscripcion.estado] ?? COLOR_ESTADO.anulada}`}>
              {perfil.inscripcionGratuita && inscripcion.estado === 'validada'
                ? 'Inscripción gratuita confirmada'
                : `Inscripción: ${inscripcion.estado === 'pendiente' ? 'pago pendiente' : inscripcion.estadoTexto.toLowerCase()}`}
            </span>
          )}
          <button type="button" onClick={onSalir} className="btn-secundario px-4 py-2 text-sm">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Salir
          </button>
        </div>
      </div>

      <Sesiones sesiones={perfil.sesiones} bloqueado={perfil.zoomBloqueado} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {!perfil.inscripcionGratuita && <Pago inscripcion={inscripcion} medios={perfil.mediosPago} onActualizar={onActualizar} />}
          <Resumenes ponencias={perfil.ponencias} ejes={perfil.ejes} onActualizar={onActualizar} />
        </div>
        <div className="space-y-6">
          <Certificados certificados={perfil.certificados} />
          <Tarjeta titulo="Mi contraseña" Icono={KeyRound}>
            <FormularioClave />
          </Tarjeta>
        </div>
      </div>
    </div>
  )
}

export default function PaginaCuenta() {
  const [perfil, setPerfil] = useState(undefined) // undefined: cargando · null: sin sesión
  const [error, setError] = useState('')

  const cargar = useCallback(() => {
    obtener('/cuenta/yo')
      .then(setPerfil)
      .catch((e) => {
        setPerfil(null)
        if (e.status !== 401) setError(e.message)
      })
  }, [])

  useEffect(cargar, [cargar])

  const salir = async () => {
    await enviar('/cuenta/salir', {}).catch(() => {})
    setPerfil(null)
    window.scrollTo({ top: 0 })
  }

  return (
    <Plantilla pagina="cuenta">
      <CabeceraPagina
        titulo="Aula virtual"
        descripcion={
          perfil
            ? 'Únete a las sesiones por Zoom, envía tus resúmenes y descarga tus certificados.'
            : 'Ingresa con tu DNI o tu correo y la contraseña que te enviamos al registrarte.'
        }
      />
      <section className="seccion bg-crema/60">
        <div className="contenedor">
          <AlertaError>{error}</AlertaError>
          {perfil === undefined ? (
            <p className="flex items-center justify-center gap-2 py-16 text-slate-500" role="status">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Cargando tu aula…
            </p>
          ) : !perfil ? (
            <Ingreso
              onIngreso={(p) => {
                setError('')
                setPerfil(p)
                window.scrollTo({ top: 0 })
              }}
            />
          ) : perfil.participante.debeCambiarClave ? (
            <CrearClave perfil={perfil} onListo={cargar} onSalir={salir} />
          ) : (
            <Panel perfil={perfil} onActualizar={(nuevo) => (nuevo?.participante ? setPerfil(nuevo) : cargar())} onSalir={salir} />
          )}
        </div>
      </section>
    </Plantilla>
  )
}
