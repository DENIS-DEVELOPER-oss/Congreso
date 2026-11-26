// Mi asistencia: cuántas veces registró su DNI (entrada y salida de cada día) y cuánto le falta para el certificado
import { CalendarCheck, CheckCircle2, Circle, Clock, IdCard, LogIn, LogOut } from 'lucide-react'
import Tarjeta from './Tarjeta.jsx'

const hoyISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })

// Anillo de progreso: asistidas / total
function Anillo({ valor, total, cumple }) {
  const r = 42
  const c = 2 * Math.PI * r
  const avance = total ? Math.min(valor / total, 1) : 0
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-slate-200" />
        <circle
          cx="50" cy="50" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - avance)}
          className={`transition-all duration-700 ${cumple ? 'stroke-emerald-500' : 'stroke-naranja'}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl leading-none font-extrabold text-oscuro">{valor}</span>
        <span className="text-xs font-semibold text-slate-500">de {total}</span>
      </div>
    </div>
  )
}

// Resumen breve (Inicio y Certificados): barra con asistidas y lo que falta
export function ResumenAsistencia({ asistencia }) {
  const { asistidas, total, minimas, cumple } = asistencia
  const faltan = Math.max(minimas - asistidas, 0)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-oscuro">
          {asistidas} de {total} registros de asistencia
        </span>
        <span className={cumple ? 'font-semibold text-emerald-700' : 'text-slate-600'}>
          {cumple ? 'Cumples para tu certificado' : `Te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan} para el certificado`}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={asistidas}>
        <div className={`h-full rounded-full transition-all duration-700 ${cumple ? 'bg-emerald-500' : 'bg-naranja'}`} style={{ width: `${total ? (asistidas / total) * 100 : 0}%` }} />
      </div>
    </div>
  )
}

export default function Asistencia({ asistencia }) {
  const { asistidas, total, minimas, cumple, porcentajeRequerido, sesiones } = asistencia
  const hoy = hoyISO()
  const faltan = Math.max(minimas - asistidas, 0)

  // Agrupa por día: cada día tiene su entrada y su salida
  const dias = sesiones.reduce((acc, s) => {
    const d = acc.find((x) => x.dia === s.dia)
    d ? d.sesiones.push(s) : acc.push({ dia: s.dia, fecha: s.fecha, sesiones: [s] })
    return acc
  }, [])

  return (
    <div className="space-y-6">
      <Tarjeta titulo="Mi asistencia" Icono={CalendarCheck}>
        {total === 0 ? (
          <p className="text-sm text-slate-600">Las sesiones del congreso aún no están publicadas.</p>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Anillo valor={asistidas} total={total} cumple={cumple} />
            <div className="min-w-0 space-y-2">
              <p className="font-display text-xl font-bold text-oscuro">
                {asistidas === 0
                  ? 'Aún no tienes registros de asistencia'
                  : `Registraste tu asistencia ${asistidas} ${asistidas === 1 ? 'vez' : 'veces'}`}
              </p>
              <p className={`text-sm ${cumple ? 'font-semibold text-emerald-700' : 'text-slate-600'}`}>
                {cumple
                  ? '¡Muy bien! Ya cumples con la asistencia necesaria para tu certificado.'
                  : `Para el certificado necesitas ${minimas} de ${total} registros (${porcentajeRequerido} %). Te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan}.`}
              </p>
              <p className="flex items-start gap-2 rounded-lg bg-crema/70 p-3 text-sm text-slate-700">
                <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-rojizo-oscuro" aria-hidden="true" />
                <span>
                  Cada día registra tu <strong>entrada</strong> al llegar y tu <strong>salida</strong> al retirarte, presentando tu DNI en la mesa de registro.
                </span>
              </p>
            </div>
          </div>
        )}
      </Tarjeta>

      {dias.map((d) => (
        <section key={d.dia} className="tarjeta-fija p-5 sm:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-oscuro">
            {d.fecha}
            {d.dia === hoy && <span className="rounded-full bg-naranja px-2 py-0.5 text-[10px] font-bold text-tierra uppercase">Hoy</span>}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {d.sesiones.map((s) => {
              const Icono = s.rol === 'Salida' ? LogOut : LogIn
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 ${
                    s.asistio ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.asistio ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icono className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">{s.rol ?? s.nombre}</p>
                    <p className="font-semibold text-oscuro">
                      {s.asistio ? `Registrada a las ${s.hora}` : d.dia < hoy ? 'No registrada' : 'Pendiente'}
                    </p>
                    {s.horario && (
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" aria-hidden="true" /> {s.nombre} · {s.horario}
                      </p>
                    )}
                  </div>
                  {s.asistio ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" aria-label="Asistencia registrada" />
                  ) : (
                    <Circle className="h-6 w-6 shrink-0 text-slate-300" aria-label="Sin registro" />
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
