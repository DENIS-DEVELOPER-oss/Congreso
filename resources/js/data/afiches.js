// Afiches oficiales del congreso (public/media/afiches), versión presencial. Se muestran en la galería y se pueden descargar.
export const afiches = [
  {
    id: 'congreso',
    titulo: 'Afiche oficial',
    texto: 'Fechas, sede en Puno y las seis instituciones que organizan el congreso.',
    src: '/media/afiches/afiche-organizadores.jpg',
  },
  {
    id: 'ponentes',
    titulo: 'Ponentes centrales',
    texto: 'Los 11 ponentes de Perú, Argentina y México.',
    src: '/media/afiches/afiche-ponentes.jpg',
  },
  {
    id: 'ejes',
    titulo: 'Ejes temáticos',
    texto: 'Las seis mesas de trabajo en las que se reciben las ponencias.',
    src: '/media/afiches/afiche-ejes.jpg',
  },
  {
    id: 'inscripciones',
    titulo: 'Inscripciones abiertas',
    texto: 'Inscripción gratuita al congreso presencial del 26 y 27 de noviembre.',
    src: '/media/afiches/afiche-inscripciones.jpg',
  },
  {
    id: 'internacionales',
    titulo: 'Ponentes internacionales',
    texto: 'Desde Argentina y México, junto a nueve ponentes del Perú.',
    src: '/media/afiches/afiche-internacionales.jpg',
  },
]

export const afiche = (id) => afiches.find((a) => a.id === id)
