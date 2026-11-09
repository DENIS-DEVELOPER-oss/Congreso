// Pago dentro del Aula virtual: monto, medios de pago y voucher. Solo se ve con la sesión iniciada.
import { useState } from 'react'
import { AlertTriangle, BadgeCheck, Check, Clock, Copy, Hash, Landmark, Smartphone, Wallet } from 'lucide-react'
import { useFormulario } from '../../hooks/useFormulario.js'
import { aFormData, enviar } from '../../lib/api.js'
import { AlertaError, Campo, CampoArchivo, OpcionesTarjeta, ResumenErrores, validarArchivo } from '../form/Campos.jsx'
import Tarjeta from './Tarjeta.jsx'

const TIPOS_VOUCHER = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

function MedioPago({ medio }) {
  const [copiado, setCopiado] = useState(false)
  const Icono = ['yape', 'plin'].includes(medio.id) ? Smartphone : Landmark

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(medio.dato.replace(/\s/g, ''))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <Icono className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="font-bold text-oscuro">{medio.nombre}</p>
      </div>
      <p className="mt-3 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{medio.etiqueta}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold break-all tabular-nums sm:text-base">{medio.dato}</p>
        <button
          type="button"
          onClick={copiar}
          className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-crema hover:text-rojizo-oscuro"
          aria-label={`Copiar ${medio.etiqueta.toLowerCase()} de ${medio.nombre}`}
        >
          {copiado ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      <p className="mt-auto pt-2 text-xs text-slate-500">Titular: {medio.titular}</p>
      <span className="sr-only" aria-live="polite">
        {copiado ? 'Copiado al portapapeles' : ''}
      </span>
    </div>
  )
}

function FormularioPago({ medios, onListo }) {
  const f = useFormulario({
    inicial: { medio_pago: '', numero_operacion: '', voucher: null },
    prefijo: 'pago',
    conCaptcha: false,
    validar: (d) => {
      const e = {}
      if (!d.medio_pago) e.medio_pago = 'Elige el medio con el que hiciste el pago.'
      if (!d.numero_operacion.trim()) e.numero_operacion = 'Escribe el número de operación que aparece en tu voucher.'
      const err = validarArchivo(d.voucher, { tipos: TIPOS_VOUCHER, maxMB: 5 })
      if (err) e.voucher = err === 'Adjunta un archivo.' ? 'Adjunta la foto o el PDF de tu voucher.' : err
      return e
    },
    enviar: async (datos) => {
      const perfil = await enviar('/cuenta/pago', aFormData(datos))
      onListo(perfil)
      return perfil
    },
  })

  return (
    <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando} className="mt-6 border-t border-slate-100 pt-6">
      <h3 className="text-lg font-semibold text-oscuro">Sube tu voucher</h3>
      <p className="mb-5 text-sm text-slate-600">Después de pagar, completa estos datos tal como figuran en tu comprobante.</p>
      <AlertaError>{f.estado === 'error' && f.mensaje}</AlertaError>
      {['incompleto', 'error'].includes(f.estado) && <ResumenErrores errores={f.errores} idDe={f.idDe} />}
      <fieldset disabled={f.enviando} className="space-y-5">
        <OpcionesTarjeta
          nombre="medio_pago"
          id={f.idDe('medio_pago')}
          legend="¿Cómo pagaste?"
          opciones={medios.map((m) => ({ valor: m.id, texto: m.nombre }))}
          valor={f.datos.medio_pago}
          onChange={f.onChange}
          error={f.errores.medio_pago}
        />
        <Campo {...f.campo('numero_operacion')} label="N.° de operación" Icono={Hash} maxLength={30} autoComplete="off" ayuda="Figura en tu voucher o en la constancia de Yape / Plin." />
        <CampoArchivo
          id={f.idDe('voucher')}
          label="Foto o PDF del voucher"
          archivo={f.datos.voucher}
          onArchivo={(a) => f.cambiar('voucher', a, true)}
          error={f.errores.voucher}
          aceptar=".jpg,.jpeg,.png,.webp,.pdf"
          ayuda="Una captura de pantalla sirve · JPG, PNG, WEBP o PDF · máximo 5 MB"
        />
      </fieldset>
      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn-primario w-full sm:w-auto" disabled={f.enviando}>
          {f.enviando ? 'Subiendo tu voucher…' : 'Enviar voucher'}
        </button>
      </div>
    </form>
  )
}

export default function Pago({ inscripcion, medios, onActualizar }) {
  const [reemplazar, setReemplazar] = useState(false)
  if (!inscripcion) return null
  const { estado, tieneVoucher } = inscripcion
  const enRevision = estado === 'pendiente' && tieneVoucher
  const mostrarFormulario = estado !== 'validada' && estado !== 'anulada' && (!tieneVoucher || estado === 'observada' || reemplazar)

  return (
    <Tarjeta titulo="Pago de la inscripción" Icono={Wallet}>
      {estado === 'validada' ? (
        <div className="flex items-start gap-4 rounded-lg bg-emerald-50 p-5 text-emerald-900">
          <BadgeCheck className="h-7 w-7 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">Pago validado</p>
            <p className="mt-1 text-sm">
              Tu inscripción está confirmada. Código de participante: <strong className="font-semibold">{inscripcion.codigo}</strong>.
            </p>
          </div>
        </div>
      ) : estado === 'anulada' ? (
        <p className="rounded-lg bg-slate-100 p-5 text-sm text-slate-700">Tu inscripción fue anulada. Si crees que es un error, escríbenos.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-naranja/50 bg-crema px-5 py-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Monto a pagar</p>
              <p className="text-sm text-slate-600">Categoría: {inscripcion.categoria}</p>
            </div>
            <p className="font-display text-4xl leading-none font-semibold text-oscuro">
              <span className="mr-1 text-lg text-[#1d4ed8]">S/</span>
              {inscripcion.monto.toFixed(2)}
            </p>
          </div>

          {estado === 'observada' && (
            <div role="alert" className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">Tu voucher fue observado</p>
                {inscripcion.observacion && <p className="mt-1">{inscripcion.observacion}</p>}
                <p className="mt-1">Sube nuevamente el comprobante correcto.</p>
              </div>
            </div>
          )}

          {enRevision && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="flex-1">
                Tu voucher está <strong>en revisión</strong>
                {inscripcion.numeroOperacion ? ` (operación ${inscripcion.numeroOperacion})` : ''}. Te avisaremos por correo cuando esté validado.
              </p>
              {!reemplazar && (
                <button type="button" onClick={() => setReemplazar(true)} className="font-semibold text-azul-oscuro underline underline-offset-2">
                  Reemplazar voucher
                </button>
              )}
            </div>
          )}

          {medios.length > 0 && (estado !== 'pendiente' || !tieneVoucher || reemplazar) && (
            <>
              <h3 className="mt-6 text-sm font-bold tracking-wide text-slate-500 uppercase">Medios de pago</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {medios.map((m) => (
                  <li key={m.id}>
                    <MedioPago medio={m} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {mostrarFormulario && (
            <FormularioPago
              medios={medios}
              onListo={(perfil) => {
                setReemplazar(false)
                onActualizar(perfil)
              }}
            />
          )}
        </>
      )}
    </Tarjeta>
  )
}
