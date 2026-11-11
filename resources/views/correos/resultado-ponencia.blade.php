@php
  $resultado = [
      'aceptada' => ['Aceptado', '#15803d', 'Tu trabajo fue aceptado para presentarse en el congreso.'],
      'observada' => ['Observado', '#b45309', 'Tu trabajo necesita algunas correcciones. Revisa el comentario del comité y vuelve a enviarlo desde el Aula virtual.'],
      'rechazada' => ['No aceptado', '#b91c1c', 'Tu trabajo no fue aceptado en esta oportunidad. Agradecemos tu participación; puedes asistir al congreso igualmente.'],
  ][$ponencia->estado];
@endphp
<x-correo etiqueta="Resultado de tu resumen">
  <p style="margin:0 0 14px;">Hola, {{ $ponencia->autor->nombres }}:</p>
  <p style="margin:0 0 6px;font-size:14px;color:#64748b;">{{ $ponencia->codigo }} · {{ $ponencia->titulo }}</p>
  <p style="margin:0 0 16px;font-size:20px;font-weight:bold;color:{{ $resultado[1] }};">{{ $resultado[0] }}</p>
  <p style="margin:0 0 16px;">{{ $resultado[2] }}</p>

  @if ($ponencia->observacion)
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#f1f6ff;border-radius:8px;width:100%;">
      <tr><td style="padding:14px 18px;font-size:14px;line-height:1.6;">
        <strong>Comentario del comité:</strong><br />{!! nl2br(e($ponencia->observacion)) !!}
      </td></tr>
    </table>
  @endif

  <p style="margin:0;">
    <a href="{{ url('/aula') }}" style="display:inline-block;background:#0b1f5c;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:4px;">Ver en el Aula virtual</a>
  </p>
</x-correo>
