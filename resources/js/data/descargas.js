// Documentos oficiales descargables (archivos en /public/descargas/ y /public/media/flyers/).
// detalle: páginas o medidas y peso, para que se sepa qué se descarga. disponible: false = «Disponible próximamente».
export const descargas = [
  {
    id: 'bases',
    titulo: 'Bases de la convocatoria',
    descripcion: 'Mesas de trabajo y subtemas, normas del resumen, envío, evaluación y comisión organizadora.',
    archivo: '/descargas/bases-convocatoria.pdf',
    formato: 'PDF',
    detalle: '3 páginas · 500 KB',
    disponible: true,
  },
  {
    id: 'plantilla',
    titulo: 'Plantilla de resumen',
    descripcion: 'Formato oficial editable: título en español e inglés, autores, resumen, abstract y palabras clave.',
    archivo: '/descargas/plantilla-resumen.docx',
    formato: 'DOCX',
    detalle: 'Word editable · 85 KB',
    disponible: true,
  },
  {
    id: 'afiche',
    titulo: 'Afiche oficial',
    descripcion: 'Afiche del congreso con las seis instituciones organizadoras, para difusión en redes.',
    archivo: '/media/flyers/organizadores-hd.jpg',
    formato: 'JPG',
    detalle: '2400 × 1350 px · 427 KB',
    disponible: true,
  },
  {
    id: 'programa',
    titulo: 'Programa general',
    descripcion: 'Agenda completa de los dos días, con horarios y ambientes de la sede.',
    archivo: '/descargas/programa-general.pdf',
    formato: 'PDF',
    disponible: false,
  },
  {
    id: 'libro',
    titulo: 'Libro de resúmenes',
    descripcion: 'Compilación de los resúmenes de las ponencias aceptadas por el Comité organizador.',
    archivo: '/descargas/libro-resumenes.pdf',
    formato: 'PDF',
    disponible: false,
  },
]
