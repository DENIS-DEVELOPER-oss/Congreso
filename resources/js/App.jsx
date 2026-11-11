import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Cifras from './components/Cifras.jsx'
import ComoFunciona from './components/ComoFunciona.jsx'
import Llamado from './components/Llamado.jsx'
import EnVivo from './components/EnVivo.jsx'
import Presentacion from './components/Presentacion.jsx'
import Ejes from './components/Ejes.jsx'
import Programa from './components/Programa.jsx'
import Ponentes from './components/Ponentes.jsx'
import Comites from './components/Comites.jsx'
import Convocatoria from './components/Convocatoria.jsx'
import Accesos from './components/Accesos.jsx'
import Descargas from './components/Descargas.jsx'
import Afiches from './components/Afiches.jsx'
import FranjaOrganizan from './components/Organizan.jsx'
import Preguntas from './components/Preguntas.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import Privacidad from './components/Privacidad.jsx'
import WhatsApp from './components/WhatsApp.jsx'
import Arriba from './components/Arriba.jsx'
import AnuncioInicio from './components/AnuncioInicio.jsx'

export default function App() {
  return (
    <>
      <a
        href="#presentacion"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-oscuro"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main>
        <Hero />
        <Cifras />
        <EnVivo />
        <Presentacion />
        <ComoFunciona />
        <Ejes />
        <Programa />
        <Ponentes />
        <Comites />
        <FranjaOrganizan />
        <Convocatoria />
        <Accesos />
        <Descargas />
        <Afiches />
        <Llamado />
        <Preguntas />
        <Contacto />
      </main>
      <Footer />
      <WhatsApp />
      <Arriba />
      <Privacidad />
      <AnuncioInicio />
    </>
  )
}
