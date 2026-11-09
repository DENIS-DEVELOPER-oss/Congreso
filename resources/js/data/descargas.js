// Archivos descargables. Coloca los archivos en /public/descargas/ con estos nombres.
// disponible: false muestra la tarjeta como "Próximamente".
export const descargas = [
  {
    id: 'bases',
    titulo: 'Bases de la convocatoria',
    descripcion: 'Ejes temáticos, normas del resumen, fechas y cómo enviar tu trabajo.',
    archivo: '/descargas/bases-convocatoria.pdf',
    formato: 'PDF',
    disponible: true,
  },
  {
    id: 'plantilla',
    titulo: 'Plantilla de resumen',
    descripcion: 'Formato oficial del resumen: Times New Roman 12, doble espacio, estructura y abstract.',
    archivo: '/descargas/plantilla-resumen.docx',
    formato: 'DOCX',
    disponible: true,
  },
  {
    id: 'programa',
    titulo: 'Programa general',
    descripcion: 'Agenda completa de los dos días con horarios y salas.',
    archivo: '/descargas/programa-general.pdf',
    formato: 'PDF',
    disponible: false,
  },
  {
    id: 'afiche',
    titulo: 'Afiche oficial',
    descripcion: 'Imagen en alta resolución para difusión en redes e impresión.',
    archivo: '/media/afiches/afiche-congreso.jpg',
    formato: 'JPG',
    disponible: true,
  },
  {
    id: 'libro',
    titulo: 'Libro de resúmenes',
    descripcion: 'Compilación de los resúmenes de ponencias aceptadas.',
    archivo: '/descargas/libro-resumenes.pdf',
    formato: 'PDF',
    disponible: false,
  },
]
