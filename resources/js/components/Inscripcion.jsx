import { ArrowRight, Briefcase, Building2, Check, GraduationCap, IdCard, Mail, MessageCircle, Mic, Phone, School, User, UserPlus } from 'lucide-react'
import { canales, enlaceWhatsApp, evento } from '../data/evento.js'
import { useFormulario } from '../hooks/useFormulario.js'
import { aFormData, enviar } from '../lib/api.js'
import { RUTAS } from '../lib/rutas.js'
import { ChakanaContorno, TituloSeccion } from './Andino.jsx'
import Reveal from './Reveal.jsx'
import {
  AlertaError,
  AvisoBorrador,
  BloqueForm,
  BotonEnviar,
  Campo,
  Captcha,
  Consentimiento,
  Honeypot,
  NotaObligatorios,
  OpcionesTarjeta,
  PantallaExito,
  ResumenErrores,
  sugerirCorreo,
} from './form/Campos.jsx'

const TIPOS = [
  { valor: 'estudiante', texto: 'Estudiante', Icono: GraduationCap },
  { valor: 'docente', texto: 'Docente', Icono: School },
  { valor: 'profesional', texto: 'Profesional', Icono: Briefcase },
  { valor: 'ponente', texto: 'Ponente', Icono: Mic },
]

const INICIAL = {
  nombres: '',
  apellidos: '',
  documento: '',
  telefono: '',
  correo: '',
  institucion: '',
  tipo_participante: '',
  acepta_privacidad: false,
}

// Registro → llega al instante el correo de acceso al Aula virtual → todo lo demás se hace en el aula
const PASOS = [
  evento.inscripcionesAbiertas
    ? { titulo: 'Regístrate', texto: 'Tu nombre, DNI, celular y correo: menos de dos minutos.' }
    : { titulo: 'Solicita tu inscripción', texto: 'Escríbenos por WhatsApp o correo con tu nombre, DNI, celular y correo.' },
  evento.inscripcionesAbiertas
    ? { titulo: 'Recibe tu acceso al instante', texto: 'Te llega un correo con tu usuario, una contraseña temporal y el programa.' }
    : { titulo: 'Recibe tu acceso', texto: 'Te enviamos por correo tu usuario, una contraseña temporal y el programa.' },
  { titulo: 'Ingresa al Aula virtual', texto: 'Consulta el programa y descarga tu certificado.' },
]

// El orden de las claves define qué campo recibe el foco primero
function validar(d) {
  const e = {}
  const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/
  if (!d.nombres.trim()) e.nombres = 'Escribe tus nombres.'
  else if (!soloLetras.test(d.nombres.trim())) e.nombres = 'Los nombres solo pueden llevar letras y espacios.'
  if (!d.apellidos.trim()) e.apellidos = 'Escribe tus apellidos.'
  else if (!soloLetras.test(d.apellidos.trim())) e.apellidos = 'Los apellidos solo pueden llevar letras y espacios.'
  const doc = d.documento.trim()
  if (!doc) e.documento = 'Escribe tu DNI o pasaporte.'
  else if (/^\d+$/.test(doc) && doc.length !== 8) e.documento = `El DNI tiene 8 dígitos (escribiste ${doc.length}).`
  else if (!/^(\d{8}|[A-Za-z0-9]{6,12})$/.test(doc)) e.documento = 'Usa solo números y letras, sin espacios ni guiones.'
  const tel = d.telefono.replace(/[\s-]/g, '')
  if (!tel) e.telefono = 'Escribe un número de celular o teléfono.'
  else if (!/^\+?\d{7,15}$/.test(tel)) e.telefono = 'Revisa el número: debe tener entre 7 y 15 dígitos.'
  if (!d.correo.trim()) e.correo = 'Escribe tu correo electrónico; ahí te llegará tu acceso al Aula virtual.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo.trim())) e.correo = 'El correo parece incompleto. Ejemplo: nombre@gmail.com'
  if (!d.tipo_participante) e.tipo_participante = 'Elige tu tipo de participante.'
  if (!d.acepta_privacidad) e.acepta_privacidad = 'Marca la casilla para aceptar la política de privacidad.'
  return e
}

function PanelInformativo() {
  return (
    <div className="relative isolate h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-7 shadow-suave sm:p-10">
      <span className="listado-textil absolute inset-x-0 top-0 h-1" aria-hidden="true" />
      <ChakanaContorno className="absolute -right-20 -bottom-20 -z-10 h-80 w-80 text-rojizo-oscuro/[0.05]" />

      <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Cómo participar</h3>
      <ol className="mt-5 space-y-5">
        {PASOS.map((p, i) => (
          <li key={p.titulo} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rojizo-oscuro font-display text-sm font-extrabold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-bold text-oscuro">{p.titulo}</p>
              <p className="text-sm text-slate-600">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <a href={RUTAS.cuenta} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-rojizo-oscuro hover:underline">
        ¿Ya tienes tu usuario? Ingresa al Aula virtual <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>

      <h3 className="mt-10 text-xs font-bold tracking-wide text-slate-500 uppercase">Inscripción gratuita: incluye</h3>
      <ul className="mt-5 space-y-3">
        {evento.beneficios.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crema text-rojizo-oscuro ring-1 ring-naranja/40">
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="text-sm text-slate-700">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Mientras la organización no abra las inscripciones (panel → Datos del congreso)
const SOLICITUD =
  'Hola, deseo inscribirme en el I Congreso Internacional Saberes Andino-Amazónicos.\nNombres y apellidos:\nDNI:\nCelular:\nCorreo:\nInstitución:\nParticipo como (estudiante, docente, profesional o ponente):'

// Mientras el formulario en línea está cerrado, la inscripción se solicita a la comisión: como asistente o como ponente
function OpcionInscripcion({ Icono, titulo, texto, children }) {
  return (
    <div className="flex flex-col rounded-2xl border border-black/5 bg-slate-50/70 p-5 text-left sm:p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b1f5c] text-naranja">
        <Icono className="h-5 w-5" aria-hidden="true" />
      </span>
      <h4 className="mt-4 font-display text-lg font-extrabold text-oscuro">{titulo}</h4>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{texto}</p>
      <div className="mt-auto pt-5">{children}</div>
    </div>
  )
}

function InscripcionesCerradas() {
  const whatsapp = canales.whatsapp[0]
  const correo = canales.correos[0]
  return (
    <div className="flex h-full flex-col justify-center py-6 text-center">
      <h3 className="font-display text-2xl font-extrabold text-oscuro sm:text-3xl">Inscríbete ahora</h3>
      <p className="mx-auto mt-2 max-w-lg leading-relaxed text-slate-600">
        La inscripción es <strong className="text-oscuro">gratuita</strong>. Elige cómo participarás y escríbenos: te confirmaremos el
        registro y te enviaremos tu acceso al Aula virtual.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <OpcionInscripcion Icono={UserPlus} titulo="Como asistente" texto="Participa en Educación Continua de la UNA Puno, con certificado otorgado por las instituciones organizadoras.">
          <a href={enlaceWhatsApp(whatsapp.numero, SOLICITUD)} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#25D366] text-[#0b1f5c] hover:bg-[#3ee07c]">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Solicitar inscripción
          </a>
          <a
            href={`mailto:${correo}?subject=${encodeURIComponent('Solicitud de inscripción – Congreso Saberes Andino-Amazónicos')}&body=${encodeURIComponent(SOLICITUD)}`}
            className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-rojizo-oscuro hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden="true" /> o por correo
          </a>
        </OpcionInscripcion>

        <OpcionInscripcion Icono={Mic} titulo="Como ponente" texto="Presenta tu investigación: envía tu resumen con la plantilla oficial hasta el 15 de noviembre.">
          <a href="/#convocatoria" className="btn-primario w-full">
            Enviar mi resumen <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-2.5 text-sm text-slate-500">Revisa las bases y los ejes temáticos</p>
        </OpcionInscripcion>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        Consultas: WhatsApp {whatsapp.texto} · {correo}
      </p>
    </div>
  )
}

export default function Inscripcion({ conTitulo = true }) {
  const f = useFormulario({
    inicial: INICIAL,
    validar,
    prefijo: 'ins',
    borrador: 'borrador-inscripcion',
    enviar: (datos, token) => enviar('/api/inscripciones', aFormData({ ...datos, cf_turnstile_response: token })),
  })
  const { datos, errores, campo } = f
  const correoSugerido = f.tocados.correo && sugerirCorreo(datos.correo)

  return (
    <section id="inscripcion" className="seccion trama-clara bg-crema">
      <div className="contenedor">
        {conTitulo && (
          <TituloSeccion
            etiqueta="Registro"
            titulo="Inscripción"
            descripcion="Regístrese con sus datos y recibirá al instante, por correo, su acceso al Aula virtual con el programa del congreso."
          />
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:sticky lg:top-24 lg:col-span-2 lg:self-start">
            <PanelInformativo />
          </Reveal>

          <Reveal delay={150} className="lg:col-span-3">
            <div className="relative h-full rounded-xl border border-black/5 bg-white px-4 py-7 shadow-elevada sm:p-10">
              {!evento.inscripcionesAbiertas && !evento.puedeProbarInscripcion ? (
                <InscripcionesCerradas />
              ) : f.estado === 'exito' ? (
                <PantallaExito
                  titulo="¡Listo, ya estás registrado!"
                  codigo={f.respuesta?.codigo}
                  correo={f.enviados?.correo}
                  pasos={[
                    'Abre el correo «Aula virtual: confirmación de acceso» (si no lo ves, revisa spam).',
                    'Ingresa al aula con tu DNI y la contraseña temporal, y crea tu propia contraseña.',
                    'Envía tu resumen hasta el 15 de noviembre y participa en las sesiones en Educación Continua de la UNA Puno.',
                  ]}
                  textoOtro="Registrar a otra persona"
                  onOtro={f.reiniciar}
                />
              ) : (
                <form onSubmit={f.onSubmit} noValidate aria-busy={f.enviando}>
                  {evento.puedeProbarInscripcion && (
                    <p className="mb-6 rounded-lg border border-naranja/50 bg-naranja/10 px-4 py-3 text-sm text-oscuro">
                      <strong>Modo de prueba:</strong> las inscripciones están cerradas al público. Puedes probar el formulario porque
                      iniciaste sesión en el panel.
                    </p>
                  )}
                  <NotaObligatorios>Te tomará unos 2 minutos.</NotaObligatorios>
                  <AvisoBorrador visible={f.recuperado} onDescartar={f.descartarBorrador} />
                  <AlertaError>
                    {f.estado === 'error' && `${f.mensaje} Tus datos siguen aquí, puedes intentarlo de nuevo.`}
                  </AlertaError>
                  {['incompleto', 'error'].includes(f.estado) && <ResumenErrores errores={errores} idDe={f.idDe} />}
                  <Honeypot {...f.trampa} />

                  <fieldset disabled={f.enviando} className="space-y-8">
                    <legend className="sr-only">Datos de inscripción</legend>

                    <BloqueForm n={1} titulo="Tus datos" detalle="Escríbelos como quieres que aparezcan en tu certificado.">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Campo {...campo('nombres')} label="Nombres" Icono={User} type="text" autoComplete="given-name" autoCapitalize="words" />
                        <Campo {...campo('apellidos')} label="Apellidos" Icono={User} type="text" autoComplete="family-name" autoCapitalize="words" />
                        <Campo
                          {...campo('documento')}
                          label="DNI / Pasaporte"
                          Icono={IdCard}
                          type="text"
                          maxLength={12}
                          autoComplete="off"
                          ayuda="Será tu usuario del Aula virtual."
                        />
                        <Campo {...campo('telefono')} label="Celular" Icono={Phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="951 000 000" />
                        <Campo
                          {...campo('correo')}
                          label="Correo electrónico"
                          Icono={Mail}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          placeholder="nombre@correo.com"
                          ayuda="Aquí te llegará al instante tu acceso al Aula virtual."
                          sugerencia={correoSugerido && { texto: correoSugerido, aplicar: () => f.cambiar('correo', correoSugerido, true) }}
                          className="sm:col-span-2"
                        />
                        <Campo {...campo('institucion')} label="Institución" opcional Icono={Building2} type="text" autoComplete="organization" placeholder="Universidad, colegio u organización" className="sm:col-span-2" />
                      </div>
                    </BloqueForm>

                    <BloqueForm n={2} titulo="Tu categoría" detalle="Si presentarás una ponencia, elige «Ponente».">
                      <OpcionesTarjeta
                        nombre="tipo_participante"
                        id={f.idDe('tipo_participante')}
                        legend="Tipo de participante"
                        opciones={TIPOS}
                        valor={datos.tipo_participante}
                        onChange={f.onChange}
                        error={errores.tipo_participante}
                      />
                    </BloqueForm>

                    <BloqueForm n={3} titulo="Confirmación">
                      <Consentimiento id={f.idDe('acepta_privacidad')} checked={datos.acepta_privacidad} onChange={f.onChange} error={errores.acepta_privacidad} />
                      <Captcha id={f.idDe('captcha')} captcha={f.captcha} error={errores.captcha} />
                    </BloqueForm>
                  </fieldset>

                  <BotonEnviar enviando={f.enviando} textoEnviando="Enviando tu registro…">
                    Registrarme
                  </BotonEnviar>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
