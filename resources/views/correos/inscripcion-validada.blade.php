<x-correo>
  <p style="margin:0 0 14px;">Hola, {{ $inscripcion->participante->nombres }}:</p>

  <x-boton-confirmar :participante="$inscripcion->participante" />

  @if ($inscripcion->estado === 'validada')
    <p style="margin:0 0 14px;">Tu pago fue validado y tu inscripción al {{ config('congreso.nombre') }} está <strong>confirmada</strong>.</p>
    <p style="margin:0 0 18px;font-size:22px;font-weight:bold;color:#1e3a8a;">{{ $inscripcion->codigo }}</p>
    <p style="margin:0 0 18px;">Ya puedes ver los enlaces de Zoom de cada sesión en el Aula virtual. Te esperamos el {{ config('congreso.fechas_texto') }} en el campus de la UNA Puno o en línea.</p>
    <p style="margin:0;"><a href="{{ url('/aula') }}" style="display:inline-block;background:#0b1f5c;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:4px;">Ingresar al aula</a></p>
  @else
    <p style="margin:0 0 14px;">Encontramos un problema al revisar tu inscripción <strong>{{ $inscripcion->codigo }}</strong>:</p>
    <p style="margin:0 0 14px;padding:12px 16px;background:#fff7e6;border-left:3px solid #fbbf24;">{{ $inscripcion->observacion }}</p>
    <p style="margin:0;">Ingresa al Aula virtual y sube nuevamente tu voucher, o responde a este correo.</p>
  @endif
</x-correo>
