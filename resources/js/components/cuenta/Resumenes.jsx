// Resúmenes del participante dentro del Aula virtual: lista con su estado y formulario de envío
import { useState } from 'react'
import { CheckCircle2, FileText, Layers, Plus, RefreshCw, Send, Tags } from 'lucide-react'
import { modalidades } from '../../data/convocatoria.js'
import { descargas } from '../../data/descargas.js'
import { useFormulario } from '../../hooks/useFormulario.js'
import { aFormData, enviar } from '../../lib/api.js'
import { AlertaError, Campo, CampoArchivo, CampoArea, CampoSelect, OpcionesTarjeta, ResumenErrores, validarArchivo } from '../form/Campos.jsx'
import Tarjeta from './Tarjeta.jsx'

const TIPOS_RESUMEN = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const INICIAL = { titulo: '', eje: '', modalidad: 'presencial', coautores: '', palabras_clave: '', archivo: null }
// Las bases piden separarlas con punto y coma; también se aceptan comas
const listaClaves = (texto) => texto.split(/[;,]/).map((p) => p.trim()).filter(Boolean)

const COLOR = {
  recibida: 'bg-sky-50 text-sky-800 ring-sky-200',
  aceptada: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  observada: 'bg-amber-50 text-amber-900 ring-amber-200',
  rechazada: 'bg-red-50 text-red-800 ring-red-200',
}

function validar(d) {
  const e = {}
  const titulo = d.titulo.trim()
  if (!titulo) e.titulo = 'Escribe el título de tu trabajo.'
  else if (titulo.length < 10) e.titulo = 'El título es muy corto: usa al menos 10 caracteres.'
  if (!d.eje) e.eje = 'Elige el eje temático en el que encaja tu trabajo.'
  if (!d.modalidad) e.modalidad = 'Elige la modalidad de tu ponencia.'
  const n = listaClaves(d.palabras_clave).length
  if (n < 5) e.palabras_clave = `Faltan palabras clave: escribe 5 separadas por punto y coma (llevas ${n}).`
  else if (n > 5) e.palabras_clave = `Son demasiadas: deja solo 5 palabras clave (llevas ${n}).`
  const err = validarArchivo(d.archivo, { tipos: TIPOS_RESUMEN, maxMB: 5 })
  if (err) e.archivo = err === 'Adjunta un archivo.' ? 'Adjunta tu resumen en PDF o Word.' : err
  return e
}

function FormularioResumen({ ejes, onEnviado, onCancelar }) {
  const plantilla = descargas.find((d) => d.id === 'plantilla')
  const f = useFormulario({
    inicial: INICIAL,
    validar,
    prefijo: 'res',
    borrador: 'borrador-resumen',
    conCaptcha: false,
    enviar: (datos) => enviar('/cuenta/ponencias', aFormData(datos)),
  })
  const { campo, datos, errores } = f

  if (f.estado === 'exito') {
    return (
      <div role="status" className="mt-6 flex flex-col items-start gap-4 rounded-lg bg-emerald-50 p-5 text-emerald-900 sm:flex-row sm:items-center">
        <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" aria-hidden="true" />
        <p className="flex-1 text-sm">
          <strong className="font-semibold">Resumen recibido{f.respuesta?.codigo ? ` (${f.respuesta.codigo})` : ''}.</strong> Te enviamos una constancia por correo; el comité te comunicará el resultado.
        </p>
        <button type="button" className="btn-secundario px-4 py-2" onClick={onEnviado}>
          Listo
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando} className="mt-6 border-t border-slate-100 pt-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-oscuro">Nuevo resumen</h3>
        {plantilla && (
          <a href={plantilla.archivo} download className="text-sm font-semibold text-azul-oscuro underline underline-offset-2 hover:text-rojizo-oscuro">
            Descargar plantilla oficial
          </a>
        )}
      </div>
      <AlertaError>{f.estado === 'error' && f.mensaje}</AlertaError>
      {['incompleto', 'error'].includes(f.estado) && <ResumenErrores errores={errores} idDe={f.idDe} />}
      <fieldset disabled={f.enviando} className="space-y-5">
        <Campo {...campo('titulo')} label="Título del trabajo" Icono={FileText} maxLength={200} contador={200} />
        <CampoSelect
          {...campo('eje')}
          label="Eje temático"
          Icono={Layers}
          placeholder="Elige el eje de tu trabajo"
          opciones={ejes.map((e) => ({ valor: String(e.id), texto: e.titulo }))}
        />
        <OpcionesTarjeta
          nombre="modalidad"
          id={f.idDe('modalidad')}
          legend="Modalidad"
          opciones={modalidades}
          valor={datos.modalidad}
          onChange={f.onChange}
          error={errores.modalidad}
          columnas="grid-cols-1 sm:grid-cols-2"
        />
        <Campo
          {...campo('palabras_clave')}
          label="Palabras clave"
          Icono={Tags}
          placeholder="territorio, ayllu, identidad, Buen Vivir, interculturalidad"
          ayuda={`Separa cada palabra con punto y coma · ${listaClaves(datos.palabras_clave).length} de 5`}
        />
        <CampoArea
          {...campo('coautores')}
          label="Coautores"
          opcional
          placeholder={'María Quispe – UNA Puno\nJuan Mamani – UNSA'}
          ayuda="Una persona por línea, con su institución (máximo 2)."
        />
        <CampoArchivo
          id={f.idDe('archivo')}
          label="Resumen"
          archivo={datos.archivo}
          onArchivo={(a) => f.cambiar('archivo', a, true)}
          error={errores.archivo}
          aceptar=".pdf,.doc,.docx"
          ayuda="PDF o Word con la plantilla oficial · máximo 5 MB"
        />
      </fieldset>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancelar} className="btn-secundario">
          Cancelar
        </button>
        <button type="submit" className="btn-primario" disabled={f.enviando}>
          <Send className="h-4 w-4" aria-hidden="true" /> {f.enviando ? 'Subiendo tu resumen…' : 'Enviar resumen'}
        </button>
      </div>
    </form>
  )
}

// Resumen observado: el autor sube la versión corregida y vuelve a evaluación
function CorregirResumen({ codigo, onListo, onCancelar }) {
  const f = useFormulario({
    inicial: { archivo: null },
    prefijo: `corr-${codigo}`,
    conCaptcha: false,
    validar: (d) => {
      const err = validarArchivo(d.archivo, { tipos: TIPOS_RESUMEN, maxMB: 5 })
      return err ? { archivo: err === 'Adjunta un archivo.' ? 'Adjunta tu resumen corregido en PDF o Word.' : err } : {}
    },
    enviar: async (datos) => {
      const r = await enviar(`/cuenta/ponencias/${codigo}/corregir`, aFormData(datos))
      onListo(r)
      return r
    },
  })
  return (
    <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando} className="mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
      <AlertaError>{f.estado === 'error' && f.mensaje}</AlertaError>
      <CampoArchivo
        id={f.idDe('archivo')}
        label="Resumen corregido"
        archivo={f.datos.archivo}
        onArchivo={(a) => f.cambiar('archivo', a, true)}
        error={f.errores.archivo}
        aceptar=".pdf,.doc,.docx"
        ayuda="PDF o Word · máximo 5 MB"
      />
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancelar} className="btn-secundario px-4 py-2 text-sm">
          Cancelar
        </button>
        <button type="submit" className="btn-primario px-4 py-2 text-sm" disabled={f.enviando}>
          <Send className="h-4 w-4" aria-hidden="true" /> {f.enviando ? 'Enviando…' : 'Enviar corrección'}
        </button>
      </div>
    </form>
  )
}

export default function Resumenes({ ponencias, ejes, onActualizar }) {
  const [abierto, setAbierto] = useState(false)
  const [corrigiendo, setCorrigiendo] = useState(null)

  return (
    <Tarjeta
      titulo="Mi ponencia"
      Icono={FileText}
      accion={
        !abierto && (
          <button type="button" onClick={() => setAbierto(true)} className="btn-primario px-4 py-2.5 text-sm">
            <Plus className="h-4 w-4" aria-hidden="true" /> Enviar un resumen
          </button>
        )
      }
    >
      {ponencias.length === 0 ? (
        !abierto && <p className="text-sm text-slate-600">Aún no enviaste resúmenes. Si presentarás una ponencia, envía aquí tu resumen con la plantilla oficial.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {ponencias.map((p) => (
            <li key={p.codigo} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <p className="font-semibold text-oscuro">{p.titulo}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {p.codigo} · {p.eje} · {p.modalidad} · {p.fecha}
                </p>
                {p.observacion && <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm whitespace-pre-line text-slate-700">Comité: {p.observacion}</p>}
                {p.estado === 'observada' &&
                  (corrigiendo === p.codigo ? (
                    <CorregirResumen
                      codigo={p.codigo}
                      onCancelar={() => setCorrigiendo(null)}
                      onListo={(nuevo) => {
                        setCorrigiendo(null)
                        onActualizar(nuevo)
                      }}
                    />
                  ) : (
                    <button type="button" onClick={() => setCorrigiendo(p.codigo)} className="btn-primario mt-3 px-4 py-2 text-sm">
                      <RefreshCw className="h-4 w-4" aria-hidden="true" /> Enviar corrección
                    </button>
                  ))}
              </div>
              <span className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COLOR[p.estado] ?? 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                {p.estadoTexto}
              </span>
            </li>
          ))}
        </ul>
      )}

      {abierto && (
        <FormularioResumen
          ejes={ejes}
          onCancelar={() => setAbierto(false)}
          onEnviado={() => {
            setAbierto(false)
            onActualizar()
          }}
        />
      )}
    </Tarjeta>
  )
}

