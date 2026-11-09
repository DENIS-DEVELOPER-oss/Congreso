<x-correo>
  <p style="margin:0 0 14px;">Hola, {{ $participante->nombres }}:</p>
  <p style="margin:0 0 18px;">Para completar tu registro en el {{ config('congreso.nombre') }}, confirma que este es tu correo:</p>
  <p style="margin:0 0 22px;">
    <a href="{{ $participante->urlConfirmacion() }}" style="display:inline-block;background:#1e3a8a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:6px;">Confirmar mi correo</a>
  </p>
  <p style="margin:0;font-size:13px;color:#64748b;">Si no te registraste en el congreso, ignora este mensaje.</p>
</x-correo>
