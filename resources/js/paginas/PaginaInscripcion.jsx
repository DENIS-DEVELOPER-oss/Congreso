import { ArrowDown, KeyRound } from 'lucide-react'
import CabeceraPagina from '../components/CabeceraPagina.jsx'
import Inscripcion from '../components/Inscripcion.jsx'
import { evento } from '../data/evento.js'
import { RUTAS } from '../lib/rutas.js'
import Plantilla from './Plantilla.jsx'

export default function PaginaInscripcion() {
  return (
    <Plantilla pagina="inscripcion">
      <CabeceraPagina
        titulo="Inscripción"
        descripcion={
          evento.inscripcionesAbiertas
            ? 'Regístrate con tu nombre, DNI, celular y correo. La inscripción es gratuita: al instante te llegará tu acceso al Aula virtual, con el programa del congreso.'
            : 'La inscripción es gratuita. Solicítala por WhatsApp o correo electrónico y te enviaremos tu acceso al Aula virtual, con el programa del congreso.'
        }
      >
        <a href="#inscripcion" className="btn-primario">
          {evento.inscripcionesAbiertas ? 'Ir al registro' : 'Solicitar inscripción'} <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
        <a href={RUTAS.cuenta} className="btn-secundario">
          <KeyRound className="h-4 w-4" aria-hidden="true" /> Ya tengo usuario
        </a>
      </CabeceraPagina>
      <Inscripcion conTitulo={false} />
    </Plantilla>
  )
}
