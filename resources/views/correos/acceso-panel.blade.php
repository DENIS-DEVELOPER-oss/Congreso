<x-correo etiqueta="Panel de organización · Acceso" titulo="I Congreso Internacional: Saberes Andino-Amazónicos">
  <p style="margin:0 0 14px;">Hola, {{ $usuario->name }}:</p>
  <p style="margin:0 0 20px;">
    Te dieron acceso al <strong>panel de organización</strong> del {{ config('congreso.nombre') }} como
    <strong>{{ $usuario->es_admin ? 'administrador' : 'organizador' }}</strong>.
  </p>

  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
    <tr>
      <td style="padding:10px 0;width:38%;color:#64748b;font-size:14px;">Correo</td>
      <td style="padding:10px 0;font-size:14px;"><strong style="color:#1e3a8a;">{{ $usuario->email }}</strong></td>
    </tr>
    <tr>
      <td style="padding:10px 0;color:#64748b;font-size:14px;border-top:1px solid #f1f5f9;">Contraseña</td>
      <td style="padding:10px 0;border-top:1px solid #f1f5f9;"><span style="font-family:Consolas,Menlo,monospace;font-size:16px;letter-spacing:1px;">{{ $clave }}</span></td>
    </tr>
  </table>

  <p style="margin:0 0 10px;">
    <a href="{{ url('/admin') }}" style="display:inline-block;background:#0b1f5c;color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 24px;border-radius:4px;">Ingresar al panel</a>
  </p>
  <p style="margin:0;font-size:13px;color:#64748b;">Te recomendamos cambiar la contraseña desde tu perfil (arriba a la derecha del panel) después de ingresar.</p>
</x-correo>
