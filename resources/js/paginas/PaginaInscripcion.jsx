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
          evento.inscripcionesFinalizadas
            ? 'Las inscripciones al congreso han finalizado. Si ya te inscribiste, ingresa al Aula virtual con tu DNI.'
            : evento.inscripcionesAbiertas
            ? 'Regístrate con tu nombre, DNI, celular y correo. La inscripción es gratuita: al instante te llegará tu acceso al Aula virtual, con el programa del congreso.'
            : 'La inscripción es gratuita. Llena tus datos como asistente o ponente (con tu resumen) y te enviaremos tu acceso al Aula virtual, con el programa del congreso.'
        }
      >
        {evento.inscripcionesFinalizadas ? (
          <a href={RUTAS.cuenta} className="btn-primario">
            <KeyRound className="h-4 w-4" aria-hidden="true" /> Ingresar al Aula virtual
          </a>
        ) : (
          <>
            <a href="#inscripcion" className="btn-primario">
              {evento.inscripcionesAbiertas ? 'Ir al registro' : 'Solicitar inscripción'} <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={RUTAS.cuenta} className="btn-secundario">
              <KeyRound className="h-4 w-4" aria-hidden="true" /> Ya tengo usuario
            </a>
          </>
        )}
      </CabeceraPagina>
      <Inscripcion conTitulo={false} />
    </Plantilla>
  )
}
