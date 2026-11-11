@php
  $p = $inscripcion->participante;
  $whatsapp = preg_replace('/\D/', '', (string) config('congreso.whatsapp'));
  $telefono = config('congreso.telefono') ?: ($whatsapp ? '+'.$whatsapp : null);
@endphp
<x-correo etiqueta="Confirmación de inscripción">
  <p style="margin:0 0 14px;">Hola, {{ $p->nombres }}:</p>
  <p style="margin:0 0 14px;">Recibimos tu inscripción como <strong>{{ $ponencia ? 'ponente' : 'asistente' }}</strong> en el {{ config('congreso.nombre') }}{{ $ponencia ? ', junto con tu resumen' : '' }}.</p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#f1f6ff;border-radius:8px;width:100%;">
    <tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;">
      <strong>Código de inscripción:</strong> {{ $inscripcion->codigo }}<br />
      <strong>Nombres y apellidos:</strong> {{ $p->nombres }} {{ $p->apellidos }}<br />
      <strong>DNI / Pasaporte:</strong> {{ $p->documento }}<br />
      <strong>Celular:</strong> {{ $p->telefono }}<br />
      <strong>Participa como:</strong> {{ config("congreso.tarifas.{$inscripcion->tipo_participante}.nombre", ucfirst($inscripcion->tipo_participante)) }}
      @if ($ponencia)
        <br /><strong>Resumen:</strong> {{ $ponencia->codigo }} · {{ $ponencia->titulo }}
        <br /><strong>Mesa temática:</strong> Eje {{ $ponencia->eje?->orden }}. {{ $ponencia->eje?->titulo }}
      @endif
    </td></tr>
  </table>

  <p style="margin:0 0 14px;">La comisión organizadora revisará tus datos{{ $ponencia ? ' y evaluará tu resumen' : '' }}. Cuando tu inscripción quede confirmada, te enviaremos a este correo tu acceso al Aula virtual.</p>

  @if ($telefono)
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px;background:#ecfdf3;border:1px solid #bbf7d0;border-radius:8px;width:100%;">
      <tr><td style="padding:14px 18px;font-size:14px;line-height:1.7;">
        <strong>¿Alguna consulta?</strong> Comunícate al <strong>{{ $telefono }}</strong>{{ $whatsapp ? ' (llamada o WhatsApp)' : '' }}
        o escribe a <a href="mailto:{{ config('congreso.correo_contacto') }}" style="color:#1e3a8a;">{{ config('congreso.correo_contacto') }}</a>.
        @if ($whatsapp)
          <br /><a href="https://wa.me/{{ $whatsapp }}?text={{ rawurlencode("Hola, tengo una consulta sobre mi inscripción {$inscripcion->codigo}") }}" style="display:inline-block;margin-top:10px;background:#25D366;color:#0b1f5c;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:4px;">Escribir por WhatsApp</a>
        @endif
      </td></tr>
    </table>
  @endif
</x-correo>
