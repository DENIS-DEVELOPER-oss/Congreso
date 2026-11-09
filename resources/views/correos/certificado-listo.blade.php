<x-correo>
  <p style="margin:0 0 14px;">Hola, {{ $certificado->participante->nombres }}:</p>
  <p style="margin:0 0 20px;">Gracias por participar en el {{ config('congreso.nombre') }}. Tu certificado de <strong>{{ strtolower(\App\Models\Certificado::TIPOS[$certificado->tipo]) }}</strong> ({{ $certificado->horas }} horas académicas) ya está disponible.</p>

  <p style="margin:0 0 22px;">
    <a href="{{ $certificado->url() }}" style="display:inline-block;background:#1e3a8a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:6px;">Descargar certificado (PDF)</a>
  </p>

  <p style="margin:0;font-size:13px;color:#64748b;">Código de verificación: {{ $certificado->codigo_verificacion }}. También puedes descargarlo cuando quieras desde el Aula virtual.</p>
</x-correo>
