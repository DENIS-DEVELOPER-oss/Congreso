import { ArrowRight, CalendarClock, Download, KeyRound, Send } from 'lucide-react'
import { evento } from '../data/evento.js'
import { cierreResumenes, estructura, modalidades, normas } from '../data/convocatoria.js'
import { descargas } from '../data/descargas.js'
import { RUTAS } from '../lib/rutas.js'
import { Chakana, TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'

function Bases() {
  const archivos = descargas.filter((d) => ['bases', 'plantilla'].includes(d.id))
  return (
    <div className="space-y-6">
      <div className="tarjeta p-6 sm:p-7">
        <h3 className="text-sm font-bold tracking-wide text-slate-500 uppercase">Modalidades</h3>
        <ul className="mt-4 space-y-3">
          {modalidades.map((m) => (
            <li key={m.valor} className="rounded-md bg-crema p-4">
              <p className="font-bold">{m.texto}</p>
              <p className="text-sm text-slate-600">{m.detalle}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-sm font-bold tracking-wide text-slate-500 uppercase">Estructura del resumen</h3>
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {archivos.map((a) => (
            <a key={a.id} href={a.archivo} download className="btn-secundario flex-1 px-4 py-3">
              <Download className="h-4 w-4" aria-hidden="true" /> {a.titulo}
            </a>
          ))}
        </div>
      </div>

      <div className="tarjeta p-6 sm:p-7">
        <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Fechas importantes</h3>
        <ol className="mt-5">
          {evento.fechasImportantes.map((f, i) => (
            <li key={f.texto} className="relative flex gap-4 pb-5 last:pb-0">
              {i < evento.fechasImportantes.length - 1 && (
                <span className="absolute top-3 left-[5px] h-full w-px bg-slate-200" aria-hidden="true" />
              )}
              <span className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-naranja bg-white" aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-bold text-[#1d4ed8]">{f.fecha}</p>
                <p className="text-sm text-slate-700">{f.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// Cómo se envía un resumen: desde el Aula virtual, con el usuario que envía la organización
function EnvioResumen() {
  const pasos = [
    'Regístrate en la página como participante',
    'Recibe por correo tu usuario (tu DNI) y tu contraseña',
    'Ingresa al Aula virtual y sube tu resumen con la plantilla oficial',
  ]
  return (
    <div className="tarjeta flex h-full flex-col p-6 sm:p-10">
      <span className="tarjeta-icono">
        <Send className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-3xl font-semibold text-oscuro sm:text-5xl">Envío de resúmenes</h3>
      <p className="mt-3 max-w-lg leading-relaxed text-slate-600">
        Los resúmenes se envían desde <strong className="font-semibold text-oscuro">Aula virtual</strong>, con el usuario y la contraseña que la organización envía a cada participante registrado.
      </p>
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
      {/* Fecha límite destacada, como en el afiche */}
      <p className="mt-6 flex items-center gap-3 rounded-xl bg-[#0b1f5c] px-4 py-3 text-sm text-white">
        <CalendarClock className="h-5 w-5 shrink-0 text-naranja" aria-hidden="true" />
        <span>
          Recepción de resúmenes hasta el <strong className="text-naranja">{cierreResumenes}</strong>
        </span>
      </p>
      <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
        <a href={RUTAS.inscripcion} className="group btn-primario">
          Registrarme
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
        <a href={RUTAS.cuenta} className="btn-secundario">
          <KeyRound className="h-4 w-4" aria-hidden="true" /> Ya tengo usuario
        </a>
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
          descripcion="Se reciben resúmenes de docentes, investigadores y estudiantes sobre saberes andino-amazónicos, interculturalidad y educación superior universitaria. El resultado de la evaluación se comunicará por correo electrónico."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Bases />
          </Reveal>
          <Reveal delay={150} className="lg:col-span-7">
            <EnvioResumen />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
