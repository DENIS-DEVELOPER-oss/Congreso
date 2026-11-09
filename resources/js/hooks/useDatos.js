import { useEffect, useState } from 'react'
import { obtener } from '../lib/api.js'

// Muestra los datos locales de resources/js/data/ y los reemplaza por los del servidor cuando llegan
// (así los ejes que edita la organización en el panel aparecen en la página).
export function useDatos(ruta, local) {
  const [datos, setDatos] = useState(local)

  useEffect(() => {
    let vigente = true
    obtener(ruta)
      .then((r) => {
        const lista = Array.isArray(r) ? r : r?.results
        if (vigente && Array.isArray(lista) && lista.length) setDatos(lista)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [ruta])

  return datos
}
