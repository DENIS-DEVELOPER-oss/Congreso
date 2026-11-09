// Cliente mínimo para la API de Laravel (routes/api.php). Por defecto usa el mismo dominio de la página.
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export class ErrorApi extends Error {
  constructor(mensaje, { campos = {}, status = 0 } = {}) {
    super(mensaje)
    this.campos = campos
    this.status = status
  }
}

// Convierte la respuesta de error de Laravel ({ message, errors: { campo: [mensajes] } }) en { campos, general }
function erroresLaravel(cuerpo) {
  if (!cuerpo || typeof cuerpo !== 'object') return { campos: {}, general: null }
  const campos = {}
  for (const [k, v] of Object.entries(cuerpo.errors ?? {})) {
    campos[k] = Array.isArray(v) ? v[0] : String(v)
  }
  return { campos, general: Object.keys(campos).length ? null : (cuerpo.message ?? null) }
}

function mensajePorEstado(status) {
  if (status === 401) return 'Tu sesión terminó. Vuelve a ingresar con tu DNI y contraseña.'
  if (status === 419) return 'La página estuvo abierta mucho tiempo. Recárgala e inténtalo de nuevo.'
  if (status === 429) return 'Hiciste muchos intentos seguidos. Espera un minuto y vuelve a intentarlo.'
  if (status === 413) return 'El archivo es demasiado pesado para el servidor. Prueba con uno más liviano.'
  if (status >= 500) return 'El servidor tuvo un problema. Inténtalo de nuevo en unos minutos.'
  return `No se pudo completar el envío (error ${status}).`
}

// Laravel deja la cookie XSRF-TOKEN; se devuelve en una cabecera para las rutas con sesión (Aula virtual)
function tokenCsrf() {
  const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  return m ? { 'X-XSRF-TOKEN': decodeURIComponent(m[1]) } : {}
}

async function solicitar(ruta, opciones) {
  let res
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      credentials: 'same-origin',
      ...opciones,
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...tokenCsrf(), ...opciones?.headers },
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.')
  }
  const cuerpo = await res.json().catch(() => null)
  if (!res.ok) {
    const { campos, general } = erroresLaravel(cuerpo)
    const mensaje = Object.keys(campos).length ? 'Revisa los campos marcados.' : res.status === 422 && general ? general : mensajePorEstado(res.status)
    throw new ErrorApi(mensaje, { campos, status: res.status })
  }
  return cuerpo
}

export const obtener = (ruta) => solicitar(ruta, { method: 'GET' })

// Envía JSON o FormData (para archivos) por POST
export const enviar = (ruta, cuerpo) =>
  cuerpo instanceof FormData
    ? solicitar(ruta, { method: 'POST', body: cuerpo })
    : solicitar(ruta, { method: 'POST', body: JSON.stringify(cuerpo), headers: { 'Content-Type': 'application/json' } })

// Objeto plano → FormData (omite vacíos; booleanos como "1"/"0", que Laravel entiende)
export function aFormData(obj) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '') continue
    if (v instanceof File) fd.append(k, v)
    else if (typeof v === 'boolean') fd.append(k, v ? '1' : '0')
    else fd.append(k, typeof v === 'string' ? v.trim() : String(v))
  }
  return fd
}
