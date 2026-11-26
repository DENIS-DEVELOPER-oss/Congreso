{{-- El nombre va tal como la persona lo escribió al inscribirse --}}
@php($p = $inscripcion->participante)
<x-correo etiqueta="Recordatorio de asistencia">
  <p style="margin:0 0 14px;">Estimado(a) <strong>{{ trim($p->nombres.' '.$p->apellidos) }}</strong>:</p>

  <p style="margin:0 0 18px;">Reciba un cordial saludo de la Comisión Organizadora. Le recordamos que se encuentra inscrito(a) en calidad de <strong>{{ config("congreso.tarifas.{$inscripcion->tipo_participante}.nombre", ucfirst($inscripcion->tipo_participante)) }}</strong> en el <strong>{{ config('congreso.nombre') }}</strong>, y nos complace confirmarle los detalles de su participación:</p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#f1f6ff;border-radius:8px;width:100%;">
    <tr><td style="padding:14px 18px;font-size:14px;line-height:1.9;">
      <strong>Fecha:</strong> {{ $dia === '27' ? 'viernes 27 de noviembre de 2026 (segundo día y clausura)' : 'jueves 26 y viernes 27 de noviembre de 2026' }}<br />
      <strong>Ingreso y registro:</strong> a partir de las 8:00 a. m.<br />
      <strong>Lugar:</strong> {{ config('congreso.sede') }}, Av. El Sol 300, Puno<br />
      <a href="https://www.google.com/maps?q=-15.834101,-70.023628" style="color:#1d4ed8;">Ver ubicación en el mapa</a>
    </td></tr>
  </table>

  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#fff7e6;border-radius:8px;width:100%;">
    <tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;">
      <strong>Registro de asistencia</strong><br />
      Es indispensable que registre su asistencia con su DNI:<br />
      • Al <strong>ingresar</strong>, registre su <strong>entrada</strong>.<br />
      • Al <strong>retirarse</strong>, registre su <strong>salida</strong>.<br />
      Le solicitamos portar su DNI físico{{ $dia === 'ambos' ? ' y realizar ambos registros en cada jornada' : '' }}.
    </td></tr>
  </table>

  <p style="margin:0 0 6px;">El evento es presencial y de acceso gratuito. Para cualquier consulta, puede comunicarse con nosotros a través del correo electrónico o el número de WhatsApp indicados al pie de este mensaje.</p>
  <p style="margin:0;">Agradecemos su participación y será un gusto contar con su presencia.</p>
</x-correo>
