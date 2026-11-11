@php($p = $inscripcion->participante)
<x-correo etiqueta="Nueva inscripción">
  <p style="margin:0 0 14px;">Llegó una nueva {{ $inscripcion->estado === 'pendiente' ? 'solicitud de inscripción' : 'inscripción' }} desde la web como <strong>{{ $ponencia ? 'ponente' : 'asistente' }}</strong>.</p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#f1f6ff;border-radius:8px;width:100%;">
    <tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;">
      <strong>Código:</strong> {{ $inscripcion->codigo }}<br />
      <strong>Nombres y apellidos:</strong> {{ $p->nombres }} {{ $p->apellidos }}<br />
      <strong>DNI / Pasaporte:</strong> {{ $p->documento }}<br />
      <strong>Celular:</strong> {{ $p->telefono }}<br />
      <strong>Correo:</strong> {{ $p->correo }}<br />
      <strong>Institución:</strong> {{ $p->institucion ?? '—' }}<br />
      <strong>Participa como:</strong> {{ config("congreso.tarifas.{$inscripcion->tipo_participante}.nombre", ucfirst($inscripcion->tipo_participante)) }}
    </td></tr>
  </table>

  @if ($ponencia)
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#fff7e6;border-radius:8px;width:100%;">
      <tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;">
        <strong>Resumen {{ $ponencia->codigo }}</strong> (adjunto a este correo)<br />
        <strong>Título:</strong> {{ $ponencia->titulo }}<br />
        <strong>Mesa temática:</strong> Eje {{ $ponencia->eje?->orden }}. {{ $ponencia->eje?->titulo }}<br />
        <strong>Palabras clave:</strong> {{ $ponencia->palabras_clave }}
        @if ($ponencia->coautores)
          <br /><strong>Coautores:</strong> {!! nl2br(e($ponencia->coautores)) !!}
        @endif
      </td></tr>
    </table>
  @endif

  @if ($inscripcion->estado === 'pendiente')
    <p style="margin:0 0 18px;">Revísala en el panel: <strong>Inscripciones → Por confirmar</strong>{{ $ponencia ? ' (y el resumen en Ponencias)' : '' }}. Al confirmarla, usa «Enviar acceso» para que reciba su usuario del Aula virtual.</p>
  @else
    <p style="margin:0 0 18px;">La inscripción quedó confirmada y la persona ya recibió su acceso al Aula virtual. Puedes verla en el panel: <strong>Inscripciones</strong>.</p>
  @endif
  <p style="margin:0;"><a href="{{ url('/admin') }}" style="display:inline-block;background:#0b1f5c;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:4px;">Abrir el panel</a></p>
</x-correo>
