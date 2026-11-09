// Política de privacidad en una ventana modal. Ábrela desde cualquier parte con abrirPrivacidad().
// IMPORTANTE: texto modelo; debe ser revisado por la Oficina de Asesoría Jurídica de la UNA.
import { useEffect, useState } from 'react'
import { evento } from '../data/evento.js'
import Modal from './Modal.jsx'

export const abrirPrivacidad = () => window.dispatchEvent(new CustomEvent('abrir-privacidad'))

const SECCIONES = [
  {
    titulo: '1. Responsable del tratamiento',
    texto: `La Facultad de Ciencias Sociales – Escuela Profesional de Sociología de la Universidad Nacional del Altiplano, con domicilio en ${evento.direccion}, es responsable del tratamiento de los datos personales recopilados en este sitio. Contacto: ${evento.correo}.`,
  },
  {
    titulo: '2. Datos que recopilamos',
    texto:
      'Nombres, apellidos, número de DNI o pasaporte, correo electrónico, teléfono, institución, tipo de participante, comprobantes de pago y, en el caso de ponentes, los resúmenes y archivos enviados.',
  },
  {
    titulo: '3. Finalidad',
    texto:
      'Gestionar tu inscripción, evaluar ponencias, controlar la asistencia, emitir certificados y enviarte comunicaciones relacionadas con el congreso. No usamos tus datos con fines comerciales ni los cedemos a terceros, salvo obligación legal.',
  },
  {
    titulo: '4. Conservación',
    texto:
      'Conservaremos tus datos durante el tiempo necesario para cumplir estas finalidades y para la emisión y verificación de certificados, tras lo cual serán eliminados o anonimizados.',
  },
  {
    titulo: '5. Tus derechos',
    texto: `Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO) escribiendo a ${evento.correo}, adjuntando una copia de tu documento de identidad.`,
  },
  {
    titulo: '6. Marco legal',
    texto:
      'El tratamiento se realiza conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento. Al marcar la casilla de aceptación otorgas tu consentimiento libre, previo, expreso e informado.',
  },
]

export default function Privacidad() {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    const abrir = () => setAbierto(true)
    window.addEventListener('abrir-privacidad', abrir)
    return () => window.removeEventListener('abrir-privacidad', abrir)
  }, [])

  return (
    <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Política de privacidad">
      <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
        {SECCIONES.map((s) => (
          <section key={s.titulo}>
            <h3 className="mb-1.5 text-base font-bold text-oscuro">{s.titulo}</h3>
            <p>{s.texto}</p>
          </section>
        ))}
        <p className="border-t border-slate-100 pt-4 text-xs text-slate-500">Última actualización: noviembre de 2026.</p>
      </div>
    </Modal>
  )
}
