// Páginas propias del sitio (cada una es una ruta de Laravel: ver routes/web.php)
export const RUTAS = {
  inicio: '/',
  inscripcion: '/inscripcion',
  cuenta: '/aula',
}

// Secciones que ahora viven en su propia página
const PAGINA_DE = {
  '#inscripcion': RUTAS.inscripcion,
  '#certificados': RUTAS.cuenta,
  '#cuenta': RUTAS.cuenta,
}

// Convierte un enlace de sección (#programa) en uno que funcione desde cualquier página:
// en la portada queda igual; desde otra página lleva a /#programa.
export const enlace = (href, pagina = 'inicio') => PAGINA_DE[href] ?? (pagina === 'inicio' ? href : `/${href}`)
