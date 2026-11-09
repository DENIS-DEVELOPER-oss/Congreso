import { evento } from '../data/evento.js'

// Solo se muestra si evento.transmisionUrl tiene una URL "embed" (p. ej. de YouTube).
export default function EnVivo() {
  if (!evento.transmisionUrl) return null
  return (
    <section id="en-vivo" aria-labelledby="titulo-en-vivo" className="bg-tierra px-4 py-16 text-white sm:px-6">
      <div className="contenedor max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="relative flex h-3 w-3" aria-hidden="true">
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <h2 id="titulo-en-vivo" className="text-2xl font-extrabold">Transmisión en vivo</h2>
        </div>
        <div className="aspect-video overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <iframe
            src={evento.transmisionUrl}
            title={`Transmisión en vivo del ${evento.nombre}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
