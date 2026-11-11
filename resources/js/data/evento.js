// Datos generales del congreso. Nombre, lema, fechas y organizadores tomados del documento oficial;
// lo marcado como "por confirmar" sigue siendo de ejemplo.
// Si cambias fechas, sede o precios, actualiza también los metadatos de index.html.
const eventoBase = {
  nombre: 'Congreso Saberes Andino-Amazónicos',
  nombreCompleto:
    'I Congreso Internacional: Saberes Andino-Amazónicos y Diálogo Intercultural en la Educación Superior Universitaria',
  edicion: 'I Congreso Internacional',
  lema: 'Formación universitaria con pertinencia intercultural e interepistémica',
  descripcionCorta:
    'Dos días de conferencias, mesas temáticas y diálogo intercultural a orillas del lago Titicaca.',
  organizadores: [
    'Universidad Nacional del Altiplano',
    'Vicerrectorado Académico',
    'Facultad de Ciencias Sociales',
    'Escuela Profesional de Sociología',
    'Instituto de Investigaciones para el Desarrollo Social Andino (IIDSA)',
  ],
  sitio: 'https://congresosaberes.net',
  // Horas por confirmar; se usan para el contador y el archivo de calendario (hora de Perú, UTC-5)
  fechaInicio: '2026-11-26T08:00:00-05:00',
  fechaFin: '2026-11-27T19:00:00-05:00',
  fechaPreventaFin: null, // fecha límite de la tarifa de preventa; null = solo tarifa regular
  fechasTexto: '26 y 27 de noviembre de 2026',
  sede: 'Educación Continua UNA Puno',
  sedeDireccion: 'Av. El Sol 300, Puno 21001',
  modalidad: 'Presencial y virtual',
  inscripcionGratuita: true,
  inscripcionesAbiertas: false, // se abren desde el panel (Datos del congreso)
  puedeProbarInscripcion: false,
  ciudad: 'Puno, Perú',
  correo: 'p.enriquez@unap.edu.pe',
  telefono: '+51 930 805 537',
  whatsapp: '51930805537', // solo dígitos, con código de país
  // Segundo canal de consultas, opcional: { correo, telefono, whatsapp }. Con null solo se muestra el principal.
  contactoAlterno: null,
  direccion: 'Av. Floral 1153, Ciudad Universitaria, Puno, Perú',
  // Sede presencial: Educación Continua de la UNA Puno (ubicación exacta en Google Maps)
  mapa: {
    enlace: 'https://maps.app.goo.gl/SMHZJWjXdK15YHa49',
    embed: 'https://maps.google.com/maps?q=-15.834101,-70.023628&z=17&output=embed',
  },
  // URL "embed" de YouTube para mostrar la sección En vivo, p. ej. 'https://www.youtube.com/embed/ID_DEL_VIDEO'
  transmisionUrl: null,
  // Fondo del hero: coloca los archivos en /public/media/ (ver LEEME.txt). Con null se usa el fondo textil.
  heroMedia: {
    video: null, // p. ej. '/media/hero-puno.mp4' (MP4 H.264, 10–20 s, sin audio, < 6 MB)
    poster: null, // p. ej. '/media/hero-puno.jpg' (se muestra mientras carga el video o si se reduce el movimiento)
    credito: null, // p. ej. 'Foto: Nombre Apellido'
  },
  // Imagen del mosaico de Presentación (lago, Taquile, tejedoras…). null = tela de aguayo.
  presentacionImagen: { src: '/media/campus-una-puno.jpg', alt: 'Ingreso al campus de la Universidad Nacional del Altiplano, Puno', credito: null }, // p. ej. { src: '/media/taquile.jpg', alt: 'Tejedores de Taquile', credito: 'Foto: …' }
  // Redes del congreso: pon la dirección de cada página cuando exista. Las que queden en null no se muestran.
  redes: {
    facebook: null,
    instagram: null,
    youtube: null,
  },
  saludos: [
    { texto: 'Imaynallan', idioma: 'quechua' },
    { texto: 'Kamisaraki', idioma: 'aimara' },
    { texto: 'Bienvenidos', idioma: 'español' },
  ],
  beneficios: [
    'Inscripción gratuita',
    'Participación presencial en Educación Continua de la UNA Puno o virtual por Google Meet',
    'Certificado digital con código de verificación',
    'Acceso al Aula virtual con el programa, los enlaces y el material',
  ],
  // Agregar aquí el cierre de envío de resúmenes y de inscripciones cuando estén definidos
  // (formato '15 nov 2026', en orden cronológico)
  fechasImportantes: [
    { fecha: '20 nov 2026', texto: 'Cierre de recepción de resúmenes' },
    { fecha: '26 nov 2026', texto: 'Inauguración y primer día del congreso' },
    { fecha: '27 nov 2026', texto: 'Segundo día y clausura' },
  ],
}

// Contacto, fechas y preventa que la organización guarda en el panel reemplazan a los de arriba
const servidor = globalThis.__CONGRESO__?.evento ?? {}
export const evento = {
  ...eventoBase,
  ...Object.fromEntries(Object.entries(servidor).filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && !v.length))),
}

// Los dos canales de consulta (principal y alterno), sin repetir si coinciden
const unicos = (lista, clave) => lista.filter((x, i) => x[clave] && lista.findIndex((y) => y[clave] === x[clave]) === i)
export const canales = {
  correos: unicos([{ correo: evento.correo }, { correo: evento.contactoAlterno?.correo }], 'correo').map((c) => c.correo),
  whatsapp: unicos(
    [
      { numero: evento.whatsapp, texto: evento.telefono },
      { numero: evento.contactoAlterno?.whatsapp, texto: evento.contactoAlterno?.telefono },
    ],
    'numero',
  ),
}

// Enlace de WhatsApp con un mensaje ya escrito
export const enlaceWhatsApp = (numero, mensaje) => `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`
if (globalThis.__CONGRESO__?.evento && 'fechaPreventaFin' in globalThis.__CONGRESO__.evento) {
  evento.fechaPreventaFin = globalThis.__CONGRESO__.evento.fechaPreventaFin
}
