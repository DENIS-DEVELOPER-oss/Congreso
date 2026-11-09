// Ingreso al Aula virtual con DNI o correo y contraseña, y recuperación de contraseña
import { useState } from 'react'
import { Eye, EyeOff, Lock, MailCheck, MonitorPlay, UserRound } from 'lucide-react'
import { useFormulario } from '../../hooks/useFormulario.js'
import { enviar } from '../../lib/api.js'
import { RUTAS } from '../../lib/rutas.js'
import { AlertaError, BotonEnviar, Campo } from '../form/Campos.jsx'

const validarUsuario = (u) => {
  const v = u.trim()
  if (!v) return 'Escribe tu DNI o tu correo.'
  if (!v.includes('@') && !/^[A-Za-z0-9]{6,12}$/.test(v)) return 'Escribe tu DNI (solo números) o tu correo completo.'
  return null
}

function Recuperar({ onVolver }) {
  const f = useFormulario({
    inicial: { usuario: '' },
    prefijo: 'rec',
    conCaptcha: false,
    validar: (d) => Object.fromEntries([['usuario', validarUsuario(d.usuario)]].filter(([, m]) => m)),
    enviar: (datos) => enviar('/cuenta/recuperar', { usuario: datos.usuario.trim() }),
  })

  if (f.estado === 'exito') {
    return (
      <div role="status" className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <MailCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-4 text-slate-700">{f.respuesta?.mensaje}</p>
        <button type="button" onClick={onVolver} className="btn-secundario mt-6">
          Volver a ingresar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={f.onSubmit} noValidate>
      <h2 className="text-2xl font-extrabold text-oscuro">Recuperar contraseña</h2>
      <p className="mt-2 mb-6 text-sm text-slate-600">Te enviaremos una contraseña temporal nueva al correo con el que te registraste.</p>
      <AlertaError>{f.estado === 'error' && f.mensaje}</AlertaError>
      <fieldset disabled={f.enviando}>
        <Campo {...f.campo('usuario')} label="DNI o correo" Icono={UserRound} autoComplete="username" autoCapitalize="none" spellCheck={false} />
      </fieldset>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onVolver} className="text-sm font-semibold text-azul-oscuro underline underline-offset-2">
          Volver
        </button>
        <button type="submit" className="btn-primario" disabled={f.enviando}>
          {f.enviando ? 'Enviando…' : 'Enviar contraseña nueva'}
        </button>
      </div>
    </form>
  )
}

export default function Ingreso({ onIngreso }) {
  const [recuperar, setRecuperar] = useState(false)
  const [ver, setVer] = useState(false)
  const f = useFormulario({
    inicial: { usuario: '', password: '' },
    prefijo: 'ing',
    conCaptcha: false,
    validar: (d) =>
      Object.fromEntries(
        [
          ['usuario', validarUsuario(d.usuario)],
          ['password', d.password ? null : 'Escribe tu contraseña.'],
        ].filter(([, m]) => m),
      ),
    enviar: async (datos) => {
      const perfil = await enviar('/cuenta/ingresar', { usuario: datos.usuario.trim(), password: datos.password })
      onIngreso(perfil)
      return perfil
    },
  })

  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-elevada md:grid-cols-5">
      {/* Columna oscura de bienvenida */}
      <div className="relative isolate overflow-hidden bg-[#0b1f5c] p-7 text-white sm:p-9 md:col-span-2">
        <div className="pointer-events-none absolute -top-20 -right-20 -z-10 h-56 w-56 rounded-full bg-naranja/20 blur-3xl" aria-hidden="true" />
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-naranja ring-1 ring-white/15">
          <MonitorPlay className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-3xl font-extrabold">Aula virtual</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
          <li>
            <strong className="text-white">Usuario:</strong> tu DNI o el correo con el que te registraste.
          </li>
          <li>
            <strong className="text-white">Contraseña:</strong> la temporal que te enviamos por correo. La primera vez crearás una propia.
          </li>
        </ul>
        <p className="mt-6 text-sm text-white/70">
          ¿Aún no te registras?{' '}
          <a href={RUTAS.inscripcion} className="font-semibold text-naranja underline underline-offset-2 hover:text-white">
            Regístrate aquí
          </a>
          .
        </p>
      </div>

      <div className="p-6 sm:p-9 md:col-span-3">
        {recuperar ? (
          <Recuperar onVolver={() => setRecuperar(false)} />
        ) : (
          <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando}>
            <h2 className="text-2xl font-extrabold text-oscuro">Ingresar al aula</h2>
            <AlertaError>{f.estado === 'error' && !f.errores.password && f.mensaje}</AlertaError>
            <fieldset disabled={f.enviando} className="mt-6 space-y-5">
              <Campo {...f.campo('usuario')} label="DNI o correo" Icono={UserRound} autoComplete="username" autoCapitalize="none" spellCheck={false} />
              <div className="relative">
                <Campo {...f.campo('password')} valido={false} label="Contraseña" Icono={Lock} type={ver ? 'text' : 'password'} autoComplete="current-password" />
                <button
                  type="button"
                  onClick={() => setVer((v) => !v)}
                  className="absolute top-[2.35rem] right-3 rounded-md p-1.5 text-slate-500 hover:text-oscuro"
                  aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {ver ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </fieldset>
            <div className="mt-3 text-right">
              <button type="button" onClick={() => setRecuperar(true)} className="text-sm font-semibold text-azul-oscuro underline underline-offset-2 hover:text-rojizo-oscuro">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <BotonEnviar enviando={f.enviando} textoEnviando="Ingresando…">
              Ingresar al aula
            </BotonEnviar>
          </form>
        )}
      </div>
    </div>
  )
}
