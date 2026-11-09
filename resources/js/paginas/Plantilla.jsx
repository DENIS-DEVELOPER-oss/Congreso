// Estructura común de las páginas internas: barra, contenido, pie y elementos flotantes.
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Privacidad from '../components/Privacidad.jsx'
import WhatsApp from '../components/WhatsApp.jsx'
import Arriba from '../components/Arriba.jsx'

export default function Plantilla({ pagina, children }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-oscuro"
      >
        Saltar al contenido
      </a>
      <Navbar pagina={pagina} />
      <main id="contenido">{children}</main>
      <Footer pagina={pagina} />
      <WhatsApp />
      <Arriba />
      <Privacidad />
    </>
  )
}
