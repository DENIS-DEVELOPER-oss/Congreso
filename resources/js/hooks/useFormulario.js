import { useEffect, useRef, useState } from 'react'
import { TURNSTILE_SITEKEY } from '../components/form/Turnstile.jsx'

// Lleva al campo con error: lo centra en pantalla (para que no lo tape la barra fija) y lo enfoca.
export function irACampo(id) {
  const el = document.getElementById(id)
  // Campos ocultos (archivo ya adjunto, captcha): se lleva al mensaje de error
  const visible = el?.offsetParent ? el : null
  const destino = visible ? (el.closest('fieldset[data-grupo]') ?? el) : document.getElementById(`${id}-error`)
  if (!destino) return
  const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  destino.scrollIntoView({ block: 'center', behavior: suave ? 'smooth' : 'auto' })
  visible?.focus({ preventScroll: true })
}

// Borrador en sessionStorage: sobrevive a una recarga accidental, pero se borra al cerrar la pestaña
// (así los datos personales no quedan guardados en computadoras compartidas). Los archivos no se guardan.
const leerBorrador = (clave) => {
  try {
    return JSON.parse(sessionStorage.getItem(clave) ?? 'null')
  } catch {
    return null
  }
}
const guardarBorrador = (clave, datos) => {
  try {
    const sinArchivos = Object.fromEntries(Object.entries(datos).filter(([, v]) => !(v instanceof File)))
    sessionStorage.setItem(clave, JSON.stringify(sinArchivos))
  } catch {
    /* almacenamiento no disponible: se sigue sin borrador */
  }
}
const borrarBorrador = (clave) => {
  try {
    sessionStorage.removeItem(clave)
  } catch {
    /* nada que borrar */
  }
}

// Estado común de los formularios: datos, validación, envío, captcha y campo trampa anti-spam.
// enviar(datos, tokenCaptcha) debe devolver la respuesta de la API o lanzar ErrorApi.
// prefijo: antepone un texto a los id del HTML para que dos formularios de la misma página
// (inscripción y ponencias) no compartan id; los nombres de los datos no cambian.
// La validación es amable: un campo solo muestra error después de que la persona lo deja (blur)
// o intenta enviar; desde ahí se revisa mientras escribe y el error desaparece apenas se corrige.
// conCaptcha: false en formularios con sesión iniciada (Aula virtual), que no muestran la verificación anti-bots
export function useFormulario({ inicial, validar, enviar, borrador, prefijo, conCaptcha = true }) {
  const idDe = (nombre) => (prefijo ? `${prefijo}-${nombre}` : nombre)
  const [datos, setDatos] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [estado, setEstado] = useState('inactivo') // inactivo | enviando | exito | error
  const [mensaje, setMensaje] = useState('')
  const [respuesta, setRespuesta] = useState(null)
  const [enviados, setEnviados] = useState(null)
  const [recuperado, setRecuperado] = useState(false)
  const [token, setToken] = useState('')
  const [claveCaptcha, setClaveCaptcha] = useState(0)
  const [trampa, setTrampa] = useState('')
  const cargado = useRef(false)

  // Recupera el borrador después de montar (no en el render inicial, para no romper el SSR)
  useEffect(() => {
    if (!borrador) return
    const previo = leerBorrador(borrador)
    if (previo && Object.entries(previo).some(([k, v]) => v && v !== inicial[k])) {
      setDatos((d) => ({ ...d, ...previo }))
      setRecuperado(true)
    }
    cargado.current = true
  }, [borrador]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (borrador && cargado.current && estado !== 'exito') guardarBorrador(borrador, datos)
  }, [borrador, datos, estado])

  const revisar = (nombre, nuevos) => setErrores((er) => ({ ...er, [nombre]: validar(nuevos)[nombre] }))

  // tocar=true: la persona ya terminó con el campo (radio, casilla, archivo), se valida al instante
  const cambiar = (nombre, valor, tocar = false) => {
    // Actualización funcional: si se escribe muy rápido en varios campos, ninguno pisa al otro
    setDatos((d) => ({ ...d, [nombre]: valor }))
    if (tocar) setTocados((t) => ({ ...t, [nombre]: true }))
    if (tocar || tocados[nombre]) revisar(nombre, { ...datos, [nombre]: valor })
  }

  const onChange = (e) => {
    const { name, type, checked, value } = e.target
    cambiar(name, type === 'checkbox' ? checked : value, ['checkbox', 'radio', 'select-one'].includes(type))
  }

  const onBlur = (e) => {
    const { name } = e.target
    // No se marca error en un campo vacío que solo se recorrió con el tabulador
    if (!tocados[name] && !String(datos[name] ?? '').trim()) return
    setTocados((t) => ({ ...t, [name]: true }))
    revisar(name, datos)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = Object.fromEntries(Object.entries(validar(datos)).filter(([, m]) => m))
    if (conCaptcha && TURNSTILE_SITEKEY && !token) v.captcha = 'Completa la verificación de seguridad.'
    setErrores(v)
    setTocados(Object.fromEntries(Object.keys(datos).map((k) => [k, true])))
    const primero = Object.keys(v)[0]
    if (primero) {
      setEstado('incompleto')
      irACampo(idDe(primero))
      return
    }
    // Un humano no ve el campo trampa: si está lleno, es un bot. Se simula éxito sin enviar.
    if (trampa) {
      setEstado('exito')
      return
    }

    setEstado('enviando')
    setMensaje('')
    try {
      setRespuesta(await enviar(datos, token))
      setEnviados(datos)
      setEstado('exito')
      setDatos(inicial)
      setTocados({})
      setRecuperado(false)
      if (borrador) borrarBorrador(borrador)
    } catch (err) {
      setErrores(err.campos ?? {})
      setMensaje(err.message)
      setEstado('error')
    } finally {
      // Los tokens de Turnstile son de un solo uso: se vuelve a montar el widget
      setToken('')
      setClaveCaptcha((k) => k + 1)
    }
  }

  // Props listas para <Campo>, <CampoSelect> y <CampoArea>
  const campo = (id) => ({
    id: idDe(id),
    name: id,
    value: datos[id],
    onChange,
    onBlur,
    error: errores[id],
    valido: Boolean(tocados[id] && !errores[id] && String(datos[id] ?? '').trim()),
  })

  return {
    datos,
    errores,
    estado,
    mensaje,
    respuesta,
    enviados,
    tocados,
    recuperado,
    enviando: estado === 'enviando',
    onChange,
    onBlur,
    cambiar,
    campo,
    idDe,
    onSubmit,
    reiniciar: () => setEstado('inactivo'),
    descartarBorrador: () => {
      if (borrador) borrarBorrador(borrador)
      setDatos(inicial)
      setErrores({})
      setTocados({})
      setRecuperado(false)
    },
    captcha: { key: claveCaptcha, onToken: setToken },
    trampa: { id: idDe('sitio_web'), value: trampa, onChange: (e) => setTrampa(e.target.value) },
  }
}
