{{-- Diseño común de los correos (estilos en línea para Gmail y Outlook): cabecera blanca, etiqueta y contenido --}}
@props(['etiqueta' => null, 'titulo' => null])
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
            <tr>
              <td style="padding:0 4px 16px;border-bottom:1px solid #e2e8f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;font-weight:bold;">I Congreso Internacional</p>
                      <p style="margin:2px 0 0;font-size:18px;font-weight:bold;color:#1e3a8a;">Saberes Andinoamazónicos</p>
                    </td>
                    <td style="vertical-align:middle;text-align:right;font-size:11px;line-height:1.5;color:#64748b;">
                      Escuela Profesional de Sociología · IIDSA<br />Universidad Nacional del Altiplano
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 4px 8px;font-size:15px;line-height:1.6;">
                @if ($etiqueta)
                  <p style="margin:0 0 6px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;">{{ $etiqueta }}</p>
                @endif
                @if ($titulo)
                  <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#0f172a;">{{ $titulo }}</h1>
                @endif
                {{ $slot }}
                <p style="margin:28px 0 0;">Atentamente,<br /><strong>Comisión organizadora</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 4px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.5;color:#64748b;">
                {{ config('congreso.nombre') }} · {{ config('congreso.fechas_texto') }} · {{ config('congreso.modalidad') }}<br />
                Consultas: <a href="mailto:{{ config('congreso.correo_contacto') }}" style="color:#1e3a8a;">{{ config('congreso.correo_contacto') }}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
