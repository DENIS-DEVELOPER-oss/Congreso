// Afiches oficiales del congreso (public/media/flyers), con el nombre «Saberes Andinos y Amazónicos». Se muestran en la galería y se pueden descargar.
export const afiches = [
  {
    id: 'convocatoria',
    titulo: 'Convocatoria',
    texto: 'Fechas, sede, modalidad presencial, inscripción gratuita y cierre de resúmenes el 20 de noviembre.',
    src: '/media/flyers/convocatoria.jpg',
  },
  {
    id: 'congreso',
    titulo: 'Afiche oficial',
    texto: 'Fechas, sede en Puno y las seis instituciones que organizan el congreso.',
    src: '/media/flyers/organizadores.jpg',
  },
  {
    id: 'ponentes',
    titulo: 'Ponentes centrales',
    texto: 'Los 11 ponentes de Perú, Argentina y México.',
    src: '/media/flyers/ponentes.jpg',
  },
  {
    id: 'ejes',
    titulo: 'Ejes temáticos',
    texto: 'Las seis mesas de trabajo en las que se reciben las ponencias.',
    src: '/media/flyers/ejes.jpg',
  },
  {
    id: 'envio',
    titulo: 'Envía tu resumen',
    texto: 'Requisitos del resumen y envío hasta el 20 de noviembre a p.enriquez@unap.edu.pe.',
    src: '/media/flyers/envio.jpg',
  },
  {
    id: 'inscripciones',
    titulo: 'Inscripciones abiertas',
    texto: 'Inscripción gratuita al congreso presencial del 26 y 27 de noviembre.',
    src: '/media/flyers/inscripciones.jpg',
  },
  {
    id: 'internacionales',
    titulo: 'Ponentes internacionales',
    texto: 'Desde Argentina y México, junto a nueve ponentes del Perú.',
    src: '/media/flyers/internacionales.jpg',
  },
  {
    id: 'saberes-vivos',
    titulo: 'Saberes vivos',
    texto: 'Fotografías de rituales y saberes del altiplano, con las fechas y la sede del congreso.',
    src: '/media/flyers/saberes-vivos.jpg',
  },
]

export const afiche = (id) => afiches.find((a) => a.id === id)

// Versión liviana (800 px) para las miniaturas; la completa se carga al abrir el afiche
export const miniatura = (src) => src.replace('/media/flyers/', '/media/flyers/mini/')
