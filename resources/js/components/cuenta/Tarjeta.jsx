// Tarjeta blanca con título e ícono para los bloques del Aula virtual
export default function Tarjeta({ titulo, Icono, accion, children, className = '' }) {
  return (
    <section className={`tarjeta-fija p-5 sm:p-7 ${className}`}>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-semibold text-oscuro">
          {Icono && (
            <span className="tarjeta-icono h-10 w-10">
              <Icono className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          {titulo}
        </h2>
        {accion}
      </header>
      {children}
    </section>
  )
}
