// Controles de formulario accesibles y con el estilo del sitio.
import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, Check, CheckCircle2, ChevronDown, Copy, FileText, FileUp, History, Loader2, X } from 'lucide-react'
import { irACampo } from '../../hooks/useFormulario.js'
import { abrirPrivacidad } from '../Privacidad.jsx'
import Turnstile from './Turnstile.jsx'

const MB = 1024 * 1024

export function validarArchivo(archivo, { tipos, maxMB, requerido = true }) {
  if (!archivo) return requerido ? 'Adjunta un archivo.' : null
  if (tipos && !tipos.includes(archivo.type)) return 'Este tipo de archivo no está permitido. Revisa los formatos indicados.'
  if (archivo.size > maxMB * MB)
    return `El archivo pesa ${(archivo.size / MB).toFixed(1)} MB y el máximo es ${maxMB} MB. Prueba con una foto más liviana o un PDF comprimido.`
  return null
}

// Errores de escritura frecuentes en el dominio del correo → dominio correcto
const DOMINIOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.es': 'gmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'unap.edu': 'unap.edu.pe',
  'unap.pe': 'unap.edu.pe',
  'est.unap.edu': 'est.unap.edu.pe',
}

// Devuelve el correo corregido si el dominio parece mal escrito; si no, null
export function sugerirCorreo(correo) {
  const [usuario, dominio] = correo.trim().toLowerCase().split('@')
  if (!usuario || !dominio) return null
  const correcto = DOMINIOS[dominio] ?? (dominio.endsWith('.con') ? dominio.slice(0, -4) + '.com' : null)
  return correcto ? `${usuario}@${correcto}` : null
}

export function MensajeError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 flex animate-aparecer items-center gap-1.5 text-sm text-red-700">
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

export function AlertaError({ children }) {
  if (!children) return null
  return (
    <div role="alert" className="mb-6 flex animate-aparecer gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}

// Lista de lo que falta al intentar enviar; cada punto lleva directo al campo
export function ResumenErrores({ errores, idDe = (k) => k }) {
  const lista = Object.entries(errores).filter(([, m]) => m)
  if (!lista.length) return null
  return (
    <div role="alert" className="mb-6 animate-aparecer rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="flex items-center gap-2 font-semibold">
        <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        {lista.length === 1 ? 'Falta un dato por completar o corregir:' : `Faltan ${lista.length} datos por completar o corregir:`}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-12 marker:text-amber-400">
        {lista.map(([id, m]) => (
          <li key={id}>
            <button type="button" onClick={() => irACampo(idDe(id))} className="text-left align-top underline decoration-amber-400 underline-offset-2 hover:text-amber-700">
              {m}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Aviso cuando se recuperan datos que quedaron sin enviar (por ejemplo, tras recargar la página)
export function AvisoBorrador({ visible, onDescartar }) {
  if (!visible) return null
  return (
    <div className="mb-6 flex animate-aparecer flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-azul/15 bg-azul/5 px-4 py-3 text-sm text-azul-oscuro">
      <History className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">Recuperamos los datos que dejaste sin enviar. Solo vuelve a adjuntar el archivo.</span>
      <button type="button" onClick={onDescartar} className="font-semibold underline underline-offset-2 hover:text-rojizo-oscuro">
        Empezar de nuevo
      </button>
    </div>
  )
}

// Encabezado de cada parte del formulario, numerado para que se vea cuánto falta
export function BloqueForm({ n, titulo, detalle, children }) {
  return (
    <div className="border-t border-slate-100 pt-8 first:border-0 first:pt-0">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rojizo-oscuro font-display text-base font-semibold text-white" aria-hidden="true">
          {n}
        </span>
        <div>
          <h3 className="text-xl leading-tight font-semibold text-oscuro">{titulo}</h3>
          {detalle && <p className="text-sm text-slate-500">{detalle}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

export function NotaObligatorios({ children }) {
  return (
    <p className="mb-8 text-sm text-slate-500">
      Los campos con <span className="font-semibold text-rojizo-oscuro">*</span> son obligatorios.{children && <> {children}</>}
    </p>
  )
}

export function BotonEnviar({ enviando, children, textoEnviando = 'Enviando…' }) {
  return (
    <div className="mt-10 flex justify-end border-t border-slate-100 pt-8">
      <button type="submit" className="group btn-primario w-full px-8 py-4 sm:w-auto" disabled={enviando}>
        {enviando ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> {textoEnviando}
          </>
        ) : (
          <>
            {children}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  )
}

function Etiqueta({ htmlFor, children, opcional, como: Tag = 'label' }) {
  return (
    <Tag {...(Tag === 'label' ? { htmlFor } : {})} className="mb-2 block text-sm font-semibold text-oscuro">
      {children}{' '}
      {opcional ? (
        <span className="font-normal text-slate-500">(opcional)</span>
      ) : (
        <span className="text-rojizo-oscuro" aria-hidden="true">
          *
        </span>
      )}
    </Tag>
  )
}

const claseControl = (error, conIcono) =>
  `w-full rounded-md border bg-slate-50/60 py-3 pr-4 ${conIcono ? 'pl-11' : 'pl-4'} text-oscuro transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
    error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-azul focus:ring-azul/15'
  }`

const ariaError = (id, error, ayuda) => ({
  'aria-invalid': error ? true : undefined,
  'aria-describedby': [error && `${id}-error`, ayuda && `${id}-ayuda`].filter(Boolean).join(' ') || undefined,
})

function IconoCampo({ Icono, error }) {
  if (!Icono) return null
  return (
    <Icono
      className={`pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${
        error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-azul'
      }`}
      aria-hidden="true"
    />
  )
}

// Visto verde dentro del campo cuando el dato ya está bien
function IconoValido({ valido, derecha = 'right-3.5' }) {
  if (!valido) return null
  return (
    <span className={`pointer-events-none absolute top-1/2 ${derecha} flex h-5 w-5 -translate-y-1/2 animate-escala items-center justify-center rounded-full bg-emerald-500 text-white`}>
      <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden="true" />
    </span>
  )
}

function Ayuda({ id, children }) {
  if (!children) return null
  return (
    <p id={`${id}-ayuda`} className="mt-1.5 text-xs text-slate-500">
      {children}
    </p>
  )
}

// contador: muestra caracteres usados / máximo. sugerencia: { texto, aplicar } (p. ej. corregir el correo)
export function Campo({ id, label, error, Icono, opcional = false, ayuda, valido, contador, sugerencia, className = '', ...props }) {
  const largo = String(props.value ?? '').length
  return (
    <div className={className}>
      <Etiqueta htmlFor={id} opcional={opcional}>
        {label}
      </Etiqueta>
      <div className="group relative">
        <IconoCampo Icono={Icono} error={error} />
        <input id={id} name={id} required={!opcional} className={`${claseControl(error, !!Icono)} pr-11`} {...ariaError(id, error, ayuda)} {...props} />
        <IconoValido valido={valido} />
      </div>
      {(ayuda || contador) && (
        <div className="flex items-start justify-between gap-4">
          <Ayuda id={id}>{ayuda}</Ayuda>
          {contador && (
            <span className={`mt-1.5 ml-auto shrink-0 text-xs tabular-nums ${largo > contador * 0.9 ? 'text-amber-700' : 'text-slate-400'}`}>
              {largo}/{contador}
            </span>
          )}
        </div>
      )}
      {sugerencia && (
        <p className="mt-1.5 animate-aparecer text-sm text-slate-600" aria-live="polite">
          ¿Quisiste decir <strong className="font-semibold text-oscuro">{sugerencia.texto}</strong>?{' '}
          <button type="button" onClick={sugerencia.aplicar} className="font-semibold text-azul-oscuro underline underline-offset-2 hover:text-rojizo-oscuro">
            Sí, corregir
          </button>
        </p>
      )}
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  )
}

export function CampoSelect({ id, label, error, Icono, opciones, placeholder = 'Selecciona una opción', valido, className = '', ...props }) {
  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{label}</Etiqueta>
      <div className="group relative">
        <IconoCampo Icono={Icono} error={error} />
        <select id={id} name={id} required className={`${claseControl(error, !!Icono)} appearance-none pr-16`} {...ariaError(id, error)} {...props}>
          <option value="">{placeholder}</option>
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <IconoValido valido={valido} derecha="right-9" />
      </div>
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  )
}

export function CampoArea({ id, label, error, opcional = false, ayuda, valido, className = '', ...props }) {
  return (
    <div className={className}>
      <Etiqueta htmlFor={id} opcional={opcional}>
        {label}
      </Etiqueta>
      <textarea id={id} name={id} rows={3} required={!opcional} className={`${claseControl(error, false)} resize-y`} {...ariaError(id, error, ayuda)} {...props} />
      <Ayuda id={id}>{ayuda}</Ayuda>
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  )
}

// Grupo de opciones tipo tarjeta (radio). El primer input recibe id={nombre} para poder enfocarlo.
export function OpcionesTarjeta({ nombre, id = nombre, legend, opciones, valor, onChange, error, columnas = 'grid-cols-2 sm:grid-cols-4' }) {
  return (
    <fieldset data-grupo aria-describedby={error ? `${id}-error` : undefined}>
      <Etiqueta como="legend">{legend}</Etiqueta>
      <div className={`grid gap-3 ${columnas}`}>
        {opciones.map(({ valor: v, texto, detalle, Icono }, i) => (
          <label key={v} className="cursor-pointer">
            <input
              type="radio"
              name={nombre}
              id={i === 0 ? id : undefined}
              value={v}
              checked={valor === v}
              onChange={onChange}
              className="peer sr-only"
            />
            <span
              className={`flex h-full flex-col items-center justify-center gap-1.5 rounded-md border-2 px-3 py-4 text-center text-sm font-semibold transition duration-200 hover:border-slate-300 peer-checked:border-rojizo peer-checked:bg-rojizo/5 peer-checked:text-rojizo-oscuro peer-focus-visible:ring-4 peer-focus-visible:ring-azul/25 ${
                error ? 'border-red-300' : 'border-slate-200 text-slate-600'
              }`}
            >
              {Icono && <Icono className="h-6 w-6" aria-hidden="true" />}
              {texto}
              {detalle && <span className="text-xs font-normal text-slate-500">{detalle}</span>}
            </span>
          </label>
        ))}
      </div>
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </fieldset>
  )
}

// Carga de archivo con arrastrar y soltar
export function CampoArchivo({ id, label, error, archivo, onArchivo, aceptar, ayuda }) {
  const [arrastrando, setArrastrando] = useState(false)
  const inputRef = useRef(null)

  // Miniatura si el archivo es una imagen (por ejemplo, la captura del voucher)
  const [vista, setVista] = useState(null)
  useEffect(() => {
    if (!archivo?.type?.startsWith('image/')) {
      setVista(null)
      return
    }
    const url = URL.createObjectURL(archivo)
    setVista(url)
    return () => URL.revokeObjectURL(url)
  }, [archivo])

  const quitar = () => {
    onArchivo(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <Etiqueta htmlFor={id}>{label}</Etiqueta>
      {archivo && (
        <div
          className={`flex animate-aparecer items-center gap-3 rounded-md border p-4 ${
            error ? 'border-red-200 bg-red-50/60' : 'border-emerald-200 bg-emerald-50/70'
          }`}
        >
          {vista ? (
            <img src={vista} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-black/5" />
          ) : (
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${error ? 'text-red-600' : 'text-emerald-700'}`}>
              <FileText className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-oscuro">{archivo.name}</p>
            <p className="text-xs text-slate-600">
              {(archivo.size / MB).toFixed(2)} MB
              {!error && <span className="font-semibold text-emerald-700"> · Listo para enviar</span>}
            </p>
            <label htmlFor={id} className="mt-1 inline-block cursor-pointer text-xs font-semibold text-azul-oscuro underline underline-offset-2 hover:text-rojizo-oscuro">
              Cambiar archivo
            </label>
          </div>
          <button
            type="button"
            onClick={quitar}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-red-600"
            aria-label={`Quitar el archivo ${archivo.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setArrastrando(true)
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrando(false)
          const f = e.dataTransfer.files?.[0]
          if (f) onArchivo(f)
        }}
        className={`${archivo ? 'hidden' : 'flex'} cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed px-6 py-8 text-center transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-azul/25 ${
          arrastrando ? 'border-azul bg-azul/5' : error ? 'border-red-300 bg-red-50/40' : 'border-slate-300 hover:border-naranja hover:bg-crema/70'
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-crema text-rojizo-oscuro">
          <FileUp className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-oscuro">
          Arrastra tu archivo aquí o <span className="text-azul-oscuro underline underline-offset-2">búscalo en tu equipo</span>
        </span>
        {ayuda && (
          <span id={`${id}-ayuda`} className="text-xs text-slate-500">
            {ayuda}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="file"
          accept={aceptar}
          className="sr-only"
          onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
          {...ariaError(id, error, ayuda)}
        />
      </label>
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  )
}

export function Consentimiento({ id = 'acepta_privacidad', name = 'acepta_privacidad', checked, onChange, error }) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-rojizo-oscuro"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-slate-600">
          He leído y acepto la{' '}
          <button type="button" onClick={abrirPrivacidad} className="font-semibold text-azul-oscuro underline underline-offset-2 hover:text-rojizo-oscuro">
            política de privacidad
          </button>{' '}
          y autorizo el tratamiento de mis datos personales para la gestión del congreso, conforme a la Ley N.° 29733.
        </label>
      </div>
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  )
}

// Campo trampa invisible para bots
export function Honeypot({ id = 'sitio_web', value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>No completes este campo</label>
      <input id={id} name="sitio_web" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
    </div>
  )
}

export function Captcha({ id = 'captcha', captcha, error }) {
  return (
    <div>
      <Turnstile key={captcha.key} onToken={captcha.onToken} />
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  )
}

// Pantalla de confirmación tras un envío correcto: qué pasó, a dónde llegó el correo y qué sigue
export function PantallaExito({ titulo, codigo, correo, pasos = [], textoOtro, onOtro }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sin portapapeles: el código igual queda a la vista */
    }
  }

  return (
    <div role="status" className="flex h-full flex-col items-center justify-center py-8 text-center">
      <span className="flex h-20 w-20 animate-escala items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
        <CheckCircle2 className="h-11 w-11 text-emerald-600" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-3xl font-semibold">{titulo}</h3>
      {correo && (
        <p className="mt-3 max-w-md text-slate-600">
          Enviamos la constancia a <strong className="font-semibold break-all text-oscuro">{correo}</strong>. Ábrela y presiona <strong className="font-semibold text-oscuro">«Confirmar mi correo»</strong>; si no la ves en unos minutos, revisa la carpeta de spam.
        </p>
      )}

      {codigo && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-naranja/40 bg-crema py-2 pr-2 pl-5">
          <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Tu código</span>
          <span className="font-sans text-lg font-bold tracking-wide text-rojizo-oscuro">{codigo}</span>
          <button
            type="button"
            onClick={copiar}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-rojizo-oscuro"
            aria-label={copiado ? 'Código copiado' : 'Copiar código'}
          >
            {copiado ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      )}

      {pasos.length > 0 && (
        <div className="mt-8 w-full max-w-md rounded-lg bg-slate-50 p-5 text-left">
          <p className="text-sm font-semibold text-oscuro">¿Qué sigue?</p>
          <ol className="mt-3 space-y-3">
            {pasos.map((p, i) => (
              <li key={p} className="flex gap-3 text-sm text-slate-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-rojizo-oscuro ring-1 ring-slate-200">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </div>
      )}

      {onOtro && (
        <button type="button" className="btn-secundario mt-8" onClick={onOtro}>
          {textoOtro}
        </button>
      )}
    </div>
  )
}
