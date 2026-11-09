<x-correo>
  <p style="margin:0 0 14px;">Hola, {{ $ponencia->autor->nombres }}:</p>
  <p style="margin:0 0 14px;">Recibimos tu resumen para el {{ config('congreso.nombre') }}.</p>

  <x-boton-confirmar :participante="$ponencia->autor" />

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#f1f6ff;border-radius:8px;width:100%;">
    <tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;">
      <strong>Código:</strong> {{ $ponencia->codigo }}<br />
      <strong>Título:</strong> {{ $ponencia->titulo }}<br />
      <strong>Eje temático:</strong> {{ $ponencia->eje->titulo }}<br />
      <strong>Modalidad:</strong> {{ config("congreso.modalidades.{$ponencia->modalidad}") }}
    </td></tr>
  </table>

  <p style="margin:0;">El comité científico evaluará tu trabajo y te comunicará el resultado por este medio.</p>
</x-correo>
