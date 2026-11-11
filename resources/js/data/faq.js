// Preguntas frecuentes
import { evento } from './evento.js'

export const preguntas = [
  {
    pregunta: '¿Dónde se realiza el congreso?',
    respuesta:
      'Es presencial: en Educación Continua de la Universidad Nacional del Altiplano (Av. El Sol 300, Puno), el 26 y 27 de noviembre de 2026.',
  },
  {
    pregunta: '¿Cuánto cuesta la inscripción?',
    respuesta: 'La inscripción es gratuita. Solo debes registrarte en la página para recibir tu acceso al Aula virtual y tu certificado.',
  },
  {
    pregunta: '¿Cómo me inscribo?',
    respuesta:
      evento.inscripcionesAbiertas
        ? 'Completa el formulario de inscripción. Al instante te llega un correo con tu usuario (tu DNI), una contraseña temporal para el Aula virtual y el programa. Al ingresar por primera vez creas tu propia contraseña.'
        : `Solicita tu inscripción por WhatsApp al ${evento.telefono} o al correo ${evento.correo} con tu nombre completo, DNI, celular y correo. Te enviaremos tu usuario y una contraseña temporal para el Aula virtual; al ingresar por primera vez creas tu propia contraseña.`,
  },
  {
    pregunta: '¿Cómo envío mi ponencia?',
    respuesta:
      `Envía tu resumen (250 palabras, con la plantilla oficial) en PDF o Word por WhatsApp al ${evento.telefono} o al correo ${evento.correo}, hasta el 15 de noviembre de 2026. Indica tu nombre completo, DNI y eje temático. El Comité organizador evaluará tu trabajo y te comunicará el resultado por correo.`,
  },
  {
    pregunta: '¿Cómo se registra mi asistencia?',
    respuesta:
      'En la sede, al ingresar a cada sesión, con tu código de inscripción o tu DNI.',
  },
  {
    pregunta: '¿Entregan certificado? ¿Cuántas horas?',
    respuesta:
      'Sí. Las instituciones organizadoras (Universidad Nacional del Altiplano, Vicerrectorado Académico, Facultad de Ciencias Sociales, Escuela Profesional de Sociología, IIDSA y Colegio de Sociólogos del Perú) otorgan un certificado digital por 48 horas académicas a quienes registren al menos el 80 % de asistencia. Podrás descargarlo desde el Aula virtual después del evento.',
  },
  {
    pregunta: 'No me llegó el correo de acceso, ¿qué hago?',
    respuesta:
      'Revisa la carpeta de spam o correo no deseado. Si no aparece, en el Aula virtual usa «¿Olvidaste tu contraseña?» con tu DNI, o escríbenos por WhatsApp o al correo de contacto.',
  },
]
