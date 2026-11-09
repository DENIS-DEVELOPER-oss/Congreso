// Ventana modal accesible basada en <dialog> (foco atrapado y Esc nativos).
import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ abierto, onCerrar, titulo, children, ancho = 'max-w-2xl' }) {
  const ref = useRef(null)
  const idTitulo = 'modal-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      aria-labelledby={idTitulo}
      className={`m-auto w-[calc(100%-2rem)] ${ancho} overflow-hidden rounded-xl bg-white p-0 text-oscuro shadow-2xl backdrop:bg-tierra/75 backdrop:backdrop-blur-sm open:animate-modal`}
    >
      {abierto && (
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 id={idTitulo} className="text-2xl font-extrabold tracking-tight">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={onCerrar}
              className="-mt-1 -mr-2 rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-oscuro"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
