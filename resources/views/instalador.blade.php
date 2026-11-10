<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Instalación del congreso</title>
  <style>
    body { margin: 0; background: #f1f6ff; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #0f172a; }
    main { max-width: 640px; margin: 40px auto; padding: 0 16px; }
    .caja { background: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 10px 30px -18px rgb(15 23 42 / .35); margin-bottom: 20px; }
    h1 { color: #1e3a8a; font-size: 1.5rem; margin: 0 0 4px; }
    h2 { font-size: 1.05rem; margin: 0 0 12px; }
    p { line-height: 1.5; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px solid #eef2f7; font-size: .93rem; }
    li small { display: block; color: #64748b; word-break: break-all; }
    .ok { color: #15803d; font-weight: 700; } .no { color: #b91c1c; font-weight: 700; }
    label { display: block; font-weight: 600; font-size: .9rem; margin: 14px 0 4px; }
    input { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
    button { margin-top: 18px; background: #1e3a8a; color: #fff; border: 0; border-radius: 999px; padding: 12px 22px; font-weight: 700; font-size: 1rem; cursor: pointer; }
    .error { background: #fee2e2; color: #991b1b; padding: 10px 12px; border-radius: 8px; margin-top: 12px; font-size: .9rem; }
    .listo { background: #dcfce7; color: #14532d; padding: 14px; border-radius: 10px; }
    a { color: #1d4ed8; }
  </style>
</head>
<body>
<main>
  <div class="caja">
    <h1>Instalación del congreso</h1>
    <p>Esta página prepara la base de datos y crea la cuenta de administrador. Solo funciona con la clave del archivo <code>.env</code>.</p>
  </div>

  @if ($pasos)
    <div class="caja">
      <h2>Resultado</h2>
      <ul>
        @foreach ($pasos as [$bien, $texto])
          <li><span class="{{ $bien ? 'ok' : 'no' }}">{{ $bien ? '✓' : '✗' }}</span> <span>{{ $texto }}</span></li>
        @endforeach
      </ul>
    </div>
  @endif

  @if ($instalado)
    <div class="caja">
      <p class="listo"><strong>Instalación completa.</strong> Entra al panel en <a href="{{ url('/admin') }}">{{ url('/admin') }}</a>
        y revisa la página en <a href="{{ url('/') }}">{{ url('/') }}</a>.</p>
      <p>Por seguridad, abre el archivo <code>.env</code> y deja vacía la línea <code>INSTALADOR_CLAVE=</code> cuando ya no necesites esta página.</p>
      <form method="post" action="{{ url('/api/instalar/actualizar') }}">
        <input type="hidden" name="clave" value="{{ $clave }}">
        <p style="margin:18px 0 0">¿Subiste archivos nuevos de una actualización? Pulsa este botón para aplicar los cambios de la base de datos.</p>
        <button type="submit">Aplicar actualización</button>
      </form>
    </div>
  @endif

  <div class="caja">
    <h2>Revisión del servidor</h2>
    <ul>
      @foreach ($revision as [$nombre, $bien, $detalle])
        <li><span class="{{ $bien ? 'ok' : 'no' }}">{{ $bien ? '✓' : '✗' }}</span>
          <span>{{ $nombre }}<small>{{ $detalle }}</small></span></li>
      @endforeach
    </ul>
  </div>

  @unless ($instalado)
    <div class="caja">
      <h2>Cuenta de administrador</h2>
      <form method="post" action="{{ url('/api/instalar') }}">
        <input type="hidden" name="clave" value="{{ $clave }}">
        <label for="email">Correo</label>
        <input id="email" name="email" type="email" required value="{{ $email }}">
        <label for="nombre">Nombre</label>
        <input id="nombre" name="nombre" required value="{{ $nombre }}">
        <label for="password">Contraseña del panel (10 caracteres o más)</label>
        <input id="password" name="password" type="password" required minlength="10" autocomplete="new-password">
        <label for="password_confirmation">Repite la contraseña</label>
        <input id="password_confirmation" name="password_confirmation" type="password" required minlength="10" autocomplete="new-password">
        @if ($error)
          <div class="error">{{ $error }}</div>
        @endif
        <button type="submit">Instalar</button>
      </form>
    </div>
  @endunless
</main>
</body>
</html>
