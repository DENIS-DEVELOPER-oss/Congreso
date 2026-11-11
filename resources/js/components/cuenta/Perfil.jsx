// Mi perfil: el participante confirma cómo saldrá su nombre en el certificado
import { Building2, CheckCircle2, User } from 'lucide-react'
import { useFormulario } from '../../hooks/useFormulario.js'
import { enviar } from '../../lib/api.js'
import { AlertaError, Campo } from '../form/Campos.jsx'
import Tarjeta from './Tarjeta.jsx'

const SOLO_LETRAS = /^[\p{L}' -]+$/u

export default function Perfil({ participante, onActualizar }) {
  const f = useFormulario({
    inicial: { nombres: participante.nombres ?? '', apellidos: participante.apellidos ?? '', institucion: participante.institucion ?? '' },
    prefijo: 'perfil',
    conCaptcha: false,
    validar: (d) => {
      const e = {}
      if (!d.nombres.trim()) e.nombres = 'Escribe tus nombres.'
      else if (!SOLO_LETRAS.test(d.nombres.trim())) e.nombres = 'Los nombres solo pueden llevar letras y espacios.'
      if (!d.apellidos.trim()) e.apellidos = 'Escribe tus apellidos.'
      else if (!SOLO_LETRAS.test(d.apellidos.trim())) e.apellidos = 'Los apellidos solo pueden llevar letras y espacios.'
      return e
    },
    enviar: async (datos) => {
      const r = await enviar('/cuenta/perfil', datos)
      onActualizar(r)
      return r
    },
  })
  const { datos } = f
  const vistaPrevia = `${datos.nombres} ${datos.apellidos}`.trim().replace(/\s+/g, ' ')

  return (
    <Tarjeta titulo="Mi nombre en el certificado" Icono={User}>
      {participante.nombreConfirmado && f.estado !== 'exito' && (
        <p className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /> Ya confirmaste tu nombre. Puedes corregirlo mientras no se emita tu certificado.
        </p>
      )}
      {f.estado === 'exito' && (
        <p role="status" className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /> Listo: tu certificado saldrá a nombre de <strong>{participante.nombre}</strong>.
        </p>
      )}

      {!participante.puedeEditarNombre ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Tu certificado ya fue emitido a nombre de <strong className="text-oscuro">{participante.nombre}</strong>. Si hay un error, escríbenos por
          WhatsApp o al correo de contacto.
        </p>
      ) : (
        <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando}>
          <p className="mb-5 text-sm leading-relaxed text-slate-600">
            Revisa que tu nombre esté completo, con tildes y en el orden correcto: así aparecerá en tu certificado.
          </p>
          <AlertaError>{f.estado === 'error' && f.mensaje}</AlertaError>
          <fieldset disabled={f.enviando} className="grid gap-4 sm:grid-cols-2">
            <Campo {...f.campo('nombres')} label="Nombres" Icono={User} autoComplete="given-name" />
            <Campo {...f.campo('apellidos')} label="Apellidos" Icono={User} autoComplete="family-name" />
            <Campo {...f.campo('institucion')} label="Institución" Icono={Building2} opcional className="sm:col-span-2" />
          </fieldset>
          {vistaPrevia && (
            <p className="mt-5 rounded-lg bg-crema p-4 text-center">
              <span className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">Así saldrá en tu certificado</span>
              <span className="mt-1 block font-display text-xl font-bold text-oscuro">{vistaPrevia}</span>
            </p>
          )}
          <button type="submit" className="btn-primario mt-5 w-full sm:w-auto" disabled={f.enviando}>
            {f.enviando ? 'Guardando…' : 'Confirmar mi nombre'}
          </button>
        </form>
      )}
    </Tarjeta>
  )
}
