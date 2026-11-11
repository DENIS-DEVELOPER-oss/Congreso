<x-correo etiqueta="Aula virtual · Acceso" titulo="I Congreso Internacional: Saberes Andinoamazónicos">
  <p style="margin:0 0 14px;">Hola, {{ $participante->nombres }}:</p>
  <p style="margin:0 0 20px;">
    Tu inscripción en el <strong>{{ config('congreso.nombre') }}</strong> está confirmada. Estos son tus datos para ingresar al
    <strong>Aula virtual</strong>, donde encontrarás el programa, el envío de resúmenes y tu certificado.
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
  <p style="margin:0;font-size:13px;color:#64748b;">Al ingresar por primera vez crearás tu propia contraseña.</p>
</x-correo>
