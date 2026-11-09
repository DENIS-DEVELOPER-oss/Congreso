@php
  $inscripcion = $participante->inscripcion;
  $gratuita = \App\Support\Ajustes::gratuita();
  $pagado = $gratuita || $inscripcion?->estado === 'validada';
  $conZoom = $pagado || ! config('congreso.zoom_solo_con_pago');
@endphp
<x-correo etiqueta="Aula virtual · Confirmación de acceso" titulo="I Congreso Internacional: Saberes Andino-Amazónicos">
  <p style="margin:0 0 14px;">Estimado(a) {{ $participante->nombres }}:</p>
  <p style="margin:0 0 20px;">
    Tu inscripción {{ $gratuita ? 'gratuita ' : '' }}en el <strong>{{ config('congreso.nombre') }}</strong> {{ $gratuita ? 'está confirmada' : 'fue registrada' }}. Hemos creado tu cuenta en el
    <strong>Aula virtual</strong>, donde encontrarás el enlace de Google Meet de cada sesión, el material y tu certificado.
  </p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
    <tr>
      <td style="padding:10px 0;width:42%;color:#64748b;font-size:14px;">Usuario (DNI o correo)</td>
      <td style="padding:10px 0;font-size:14px;"><strong style="color:#1e3a8a;">{{ $participante->documento }}</strong></td>
    </tr>
    <tr>
      <td style="padding:10px 0;color:#64748b;font-size:14px;border-top:1px solid #f1f5f9;">Contraseña temporal</td>
      <td style="padding:10px 0;border-top:1px solid #f1f5f9;"><span style="font-family:Consolas,Menlo,monospace;font-size:16px;letter-spacing:1px;">{{ $clave }}</span></td>
    </tr>
  </table>

  <p style="margin:0 0 10px;">
    <a href="{{ url('/aula') }}" style="display:inline-block;background:#0b1f5c;color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 24px;border-radius:4px;">Ingresar al aula</a>
  </p>
  <p style="margin:0 0 26px;font-size:13px;color:#64748b;">Al ingresar por primera vez se te pedirá crear una contraseña personal. Luego podrás ingresar con tu DNI o con tu correo.</p>

  @if ($sesiones->isNotEmpty())
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Programa (hora de Perú)</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 22px;border-collapse:collapse;font-size:14px;">
      @foreach ($sesiones as $s)
        <tr>
          <td style="padding:12px 12px 12px 0;border-top:1px solid #e2e8f0;vertical-align:top;width:34%;">
            {{ ucfirst($s->fechaTexto()) }}<br />
            <span style="color:#64748b;">{{ $s->horarioTexto() }}</span>
          </td>
          <td style="padding:12px 0;border-top:1px solid #e2e8f0;vertical-align:top;">
            <strong style="color:#0f172a;">{{ $s->titulo ?? $s->nombre }}</strong><br />
            @if ($s->ponente)<span style="color:#64748b;">{{ $s->ponente }}</span><br />@endif
            @if ($conZoom && $s->enlace)
              <a href="{{ $s->enlace }}" style="color:#1d4ed8;">Unirse por Google Meet</a>
            @endif
          </td>
        </tr>
      @endforeach
    </table>
    @unless ($conZoom)
      <p style="margin:0 0 22px;font-size:13px;color:#64748b;">Los enlaces de Google Meet aparecerán en el Aula virtual cuando se valide tu pago.</p>
    @endunless
  @endif

  @if ($inscripcion && ! $pagado && collect(config('congreso.medios_pago_detalle'))->isNotEmpty())
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Pago de la inscripción</p>
    <p style="margin:0 0 10px;">
      Categoría: <strong>{{ config("congreso.tarifas.{$inscripcion->tipo_participante}.nombre") }}</strong> ·
      Monto: <strong>S/ {{ number_format((float) $inscripcion->monto, 2) }}</strong>
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;width:100%;border-collapse:collapse;font-size:14px;">
      @foreach (config('congreso.medios_pago_detalle') as $m)
        <tr>
          <td style="padding:9px 12px;border:1px solid #e2e8f0;"><strong>{{ $m['nombre'] }}</strong><br /><span style="color:#64748b;">{{ $m['titular'] }}</span></td>
          <td style="padding:9px 12px;border:1px solid #e2e8f0;">{{ $m['etiqueta'] }}<br /><strong>{{ $m['dato'] }}</strong></td>
        </tr>
      @endforeach
    </table>
    <p style="margin:0;">Después de pagar, ingresa al Aula y sube la foto de tu voucher con el número de operación.</p>
  @endif
</x-correo>
