// Afiches oficiales del congreso (public/media/afiches). Se muestran en la galería y se pueden descargar.
export const afiches = [
  {
    id: 'congreso',
    titulo: 'Afiche oficial',
    texto: 'Fecha, sede, modalidad presencial y virtual e inscripción gratuita.',
    src: '/media/afiches/afiche-congreso.jpg',
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
    texto: 'Los seis ejes en los que se reciben las ponencias.',
    src: '/media/afiches/afiche-ejes.jpg',
  },
]

export const afiche = (id) => afiches.find((a) => a.id === id)
