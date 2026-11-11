{{-- Tarjeta centrada para páginas públicas sueltas: confirmación de correo y verificación de certificados --}}
@props(['titulo'])
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>{{ $titulo }} | Congreso Saberes Andinoamazónicos</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px;
      background: #0b1f5c; font-family: 'Inter', system-ui, sans-serif; color: #0f172a; }
    .tarjeta { width: 100%; max-width: 480px; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 30px 60px -30px rgb(0 0 0 / .6); }
    .cabecera { background: #1e3a8a; padding: 22px 28px; color: #fff; }
    .cabecera small { color: #fbbf24; letter-spacing: 1.5px; text-transform: uppercase; font-size: 11px; font-weight: 700; }
    .cabecera p { margin: 6px 0 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
    .cuerpo { padding: 32px 28px; text-align: center; }
    .icono { width: 72px; height: 72px; margin: 0 auto 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 34px; }
    .ok { background: #ecfdf5; color: #059669; }
    .aviso { background: #fff7e6; color: #b7791f; }
    .error { background: #fef2f2; color: #dc2626; }
    h1 { margin: 0 0 10px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
    p { margin: 0 0 12px; line-height: 1.6; color: #475569; }
    .datos { margin: 18px 0 4px; padding: 14px 18px; border-radius: 10px; background: #f1f6ff; text-align: left; font-size: 14px; line-height: 1.8; }
    a.boton { display: inline-block; margin-top: 18px; padding: 12px 22px; border-radius: 8px; background: #1e3a8a; color: #fff; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <main class="tarjeta">
    <div class="cabecera">
      <small>I Congreso Internacional</small>
      <p>Saberes Andinoamazónicos</p>
    </div>
    <div class="cuerpo">
      {{ $slot }}
      <a class="boton" href="{{ url('/') }}">Ir a la página del congreso</a>
    </div>
  </main>
</body>
</html>
