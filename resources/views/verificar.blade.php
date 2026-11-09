{{-- Verificación pública de un certificado (a esta página lleva el QR impreso en el PDF) --}}
<x-tarjeta-publica titulo="Verificación de certificado">
  @if ($c)
    <div class="icono ok">✓</div>
    <h1>Certificado válido</h1>
    <p>Este certificado fue emitido por la organización del congreso.</p>
    <div class="datos">
      <strong>Otorgado a:</strong> {{ $c->participante->nombre_completo }}<br />
      <strong>En calidad de:</strong> {{ \App\Models\Certificado::TIPOS[$c->tipo] ?? $c->tipo }}<br />
      <strong>Horas académicas:</strong> {{ $c->horas }}<br />
      <strong>Emitido el:</strong> {{ $c->emitido_en->format('d/m/Y') }}<br />
      <strong>Código:</strong> {{ $c->codigo_verificacion }}
    </div>
    <a class="boton" href="{{ $c->url() }}" style="margin-right: 6px">Ver el PDF</a>
  @else
    <div class="icono error">✕</div>
    <h1>No encontramos este certificado</h1>
    <p>El código <strong>{{ $codigo }}</strong> no corresponde a ningún certificado emitido. Si crees que es un error, escríbenos a {{ config('congreso.correo_contacto') }}.</p>
  @endif
</x-tarjeta-publica>
