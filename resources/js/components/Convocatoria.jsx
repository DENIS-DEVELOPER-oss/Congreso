import { CalendarClock, FileUp, MapPin, Send } from 'lucide-react'
import { canales, evento } from '../data/evento.js'
import { cierreResumenes, estructura, modalidades, normas } from '../data/convocatoria.js'
import { descargas } from '../data/descargas.js'
import { Chakana, TituloSeccion } from './Andino.jsx'
import { RUTAS } from '../lib/rutas.js'
import { FichaCompacta } from './Descargas.jsx'
import Reveal from './Reveal.jsx'

function Bases() {
  const archivos = descargas.filter((d) => ['bases', 'plantilla'].includes(d.id))
  return (
      <div className="tarjeta flex h-full flex-col p-6 sm:p-7">
        <h3 className="text-sm font-bold tracking-wide text-slate-500 uppercase">Estructura del resumen</h3>
        <ol className="mt-4 grid grid-cols-2 gap-2">
          {estructura.map((e, i) => (
            <li key={e} className="flex items-center gap-2 rounded-md bg-crema px-3 py-2 text-sm font-semibold text-oscuro">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rojizo-oscuro text-xs text-white">{i + 1}</span>
              {e}
            </li>
          ))}
        </ol>

        <h3 className="mt-8 text-sm font-bold tracking-wide text-slate-500 uppercase">Normas del resumen</h3>
        <ul className="mt-4 space-y-3">
          {normas.map((n) => (
            <li key={n} className="flex gap-3 text-[15px] text-slate-700">
              <Chakana className="mt-1 h-3.5 w-3.5 shrink-0 text-naranja" />
              {n}
            </li>
          ))}
        </ul>

        {/* Los documentos quedan al pie de la tarjeta, alineados con el final de la columna derecha */}
        <div className="mt-auto pt-8">
          <h3 className="text-sm font-bold tracking-wide text-slate-500 uppercase">Documentos para participar</h3>
          <div className="mt-4 space-y-3">
            {archivos.map((a) => (
              <FichaCompacta key={a.id} d={a} />
            ))}
          </div>
        </div>
    </div>
  )
}

// Fechas clave en la columna derecha, bajo el envío de resúmenes (en pantallas anchas, en tres columnas)
function Fechas() {
  return (
    <div className="tarjeta p-6 sm:p-7">
      <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Fechas importantes</h3>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {evento.fechasImportantes.map((f) => (
          <li key={f.texto} className="flex gap-2.5 rounded-lg bg-crema px-3 py-3">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-naranja" aria-hidden="true" />
            <div className="text-left">
              <p className="font-display text-sm font-bold text-[#1d4ed8]">{f.fecha}</p>
              <p className="text-[13px] leading-snug text-slate-700">{f.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// El resumen se sube en la web al inscribirse como ponente (queda en el panel y la comisión recibe el aviso por correo)
function EnvioResumen() {
  const whatsapp = canales.whatsapp[0]
  const correo = canales.correos[0]
  const pasos = [
    'Redacta tu resumen (250 palabras) con la plantilla oficial, siguiendo las bases',
    'Inscríbete como ponente en la web y adjunta tu resumen en Word o PDF',
    'El Comité organizador evaluará tu resumen y te comunicará el resultado por correo',
  ]
  return (
    <div className="tarjeta flex flex-1 flex-col p-6 sm:p-9">
      <span className="tarjeta-icono">
        <Send className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-3xl font-semibold text-oscuro sm:text-5xl">Envío de resúmenes</h3>
      <p className="mt-3 max-w-lg leading-relaxed text-slate-600">El resumen se adjunta en el formulario de inscripción de ponentes.</p>
      <ol className="mt-6 space-y-3">
        {pasos.map((t, i) => (
          <li key={t} className="flex items-start gap-3 text-slate-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rojizo-oscuro font-display text-sm font-semibold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5">{t}</span>
          </li>
        ))}
      </ol>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a href={`${RUTAS.inscripcion}?como=ponente`} className="btn-primario">
          <FileUp className="h-4 w-4" aria-hidden="true" /> Inscribirme y subir mi resumen
        </a>
      </div>
      <p className="mt-3 text-sm [overflow-wrap:anywhere] text-slate-500">
        Consultas: WhatsApp {whatsapp.texto} · {correo}
      </p>

      <ul className="mt-6 space-y-2" aria-label="Modalidad">
        {modalidades.map((m) => (
          <li key={m.valor} className="flex items-center gap-3 rounded-md bg-crema px-4 py-3">
            <MapPin className="h-5 w-5 shrink-0 text-[#1d4ed8]" aria-hidden="true" />
            <p className="text-left">
              <span className="font-bold text-oscuro">{m.texto}</span>
              <span className="text-slate-600"> · {m.detalle}</span>
            </p>
          </li>
        ))}
      </ul>

      {/* Fecha límite destacada, como en el afiche */}
      <div className="mt-auto pt-7">
        <p className="flex items-center gap-3 rounded-xl bg-[#0b1f5c] px-4 py-3 text-sm text-white">
          <CalendarClock className="h-5 w-5 shrink-0 text-naranja" aria-hidden="true" />
          <span>
            Recepción de resúmenes hasta el <strong className="text-naranja">{cierreResumenes}</strong>
          </span>
        </p>
      </div>
    </div>
  )
}

export default function Convocatoria() {
  return (
    <section id="convocatoria" className="seccion trama-clara bg-crema">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Ponencias"
          titulo="Convocatoria de ponencias"
          descripcion="Se reciben resúmenes de docentes, investigadores y estudiantes sobre saberes andinos y amazónicos, interculturalidad y educación superior universitaria. Los trabajos son evaluados por el Comité organizador y el resultado se comunica por correo electrónico."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Bases />
          </Reveal>
          <Reveal delay={150} className="flex flex-col gap-6 lg:col-span-7">
            <EnvioResumen />
            <Fechas />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
