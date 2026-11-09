{{-- Bloque "Confirma tu correo" que va dentro de los correos de constancia --}}
@props(['participante'])
@unless ($participante->correoConfirmado())
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;width:100%;border:1px solid #fbbf24;border-radius:8px;">
    <tr><td style="padding:16px 18px;">
      <p style="margin:0 0 10px;font-weight:bold;color:#1e3a8a;">Paso importante: confirma tu correo</p>
      <p style="margin:0 0 14px;font-size:14px;">Así sabremos que esta dirección es tuya y que te llegarán la validación del pago y tu certificado.</p>
      <a href="{{ $participante->urlConfirmacion() }}" style="display:inline-block;background:#1e3a8a;color:#ffffff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:6px;">Confirmar mi correo</a>
    </td></tr>
  </table>
@endunless
