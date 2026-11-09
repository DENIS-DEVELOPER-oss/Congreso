import { evento } from '../data/evento.js'

const aUTC = (fecha) => new Date(fecha).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const lugar = `${evento.modalidad} · ${evento.sitio}/aula`

export function urlGoogleCalendar() {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: evento.nombre,
    dates: `${aUTC(evento.fechaInicio)}/${aUTC(evento.fechaFin)}`,
    details: `${evento.lema}. Más información: ${evento.sitio}`,
    location: lugar,
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

// Genera y descarga un archivo .ics (Outlook, Apple Calendar, etc.)
export function descargarIcs() {
  const esc = (s) => s.replace(/([,;\\])/g, '\\$1')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Congreso Saberes Andino-Amazonicos//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:congreso-${aUTC(evento.fechaInicio)}@congresosaberes.net`,
    `DTSTAMP:${aUTC(Date.now())}`,
    `DTSTART:${aUTC(evento.fechaInicio)}`,
    `DTEND:${aUTC(evento.fechaFin)}`,
    `SUMMARY:${esc(evento.nombre)}`,
    `DESCRIPTION:${esc(evento.lema)}`,
    `LOCATION:${esc(lugar)}`,
    `URL:${evento.sitio}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'congreso-saberes-andinos.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
