<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $titulo }}</title>
    <meta name="description" content="{{ $descripcion }}" />
    <link rel="canonical" href="{{ $url }}" />
    <meta name="theme-color" content="#0b1f5c" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />

    {{-- Vista previa al compartir (Facebook, WhatsApp, LinkedIn, X) --}}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_PE" />
    <meta property="og:site_name" content="Congreso Saberes Andinoamazónicos" />
    <meta property="og:url" content="{{ $url }}" />
    <meta property="og:title" content="{{ $tituloSocial }}" />
    <meta property="og:description" content="{{ $descripcionSocial }}" />
    <meta property="og:image" content="{{ url('/og-image.jpg') }}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Afiche del Congreso Saberes Andinoamazónicos 2026" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{ $tituloSocial }}" />
    <meta name="twitter:description" content="{{ $descripcionSocial }}" />
    <meta name="twitter:image" content="{{ url('/og-image.jpg') }}" />

    @if ($pagina === 'inicio')
      {{-- Datos estructurados del evento para Google --}}
      <script type="application/ld+json">
        {!! json_encode([
          '@context' => 'https://schema.org',
          '@type' => 'EducationEvent',
          'name' => 'I Congreso Internacional: Saberes Andinoamazónicos y Diálogo Intercultural en la Educación Superior Universitaria',
          'description' => 'Formación universitaria con pertinencia intercultural e interepistémica.',
          'startDate' => config('congreso.fecha_inicio'),
          'endDate' => config('congreso.fecha_fin'),
          'eventStatus' => 'https://schema.org/EventScheduled',
          'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
          'inLanguage' => 'es',
          'url' => url('/'),
          'image' => [url('/og-image.jpg')],
          'location' => [
            [
              '@type' => 'Place',
              'name' => 'Educación Continua – Universidad Nacional del Altiplano',
              'geo' => ['@type' => 'GeoCoordinates', 'latitude' => -15.834101, 'longitude' => -70.023628],
              'hasMap' => 'https://maps.app.goo.gl/SMHZJWjXdK15YHa49',
              'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Av. El Sol 300',
                'postalCode' => '21001',
                'addressLocality' => 'Puno',
                'addressCountry' => 'PE',
              ],
            ],
          ],
          'isAccessibleForFree' => true,
          'organizer' => [
            '@type' => 'Organization',
            'name' => 'Escuela Profesional de Sociología – Universidad Nacional del Altiplano',
            'url' => url('/'),
          ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
      </script>
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,500..800;1,600..800&family=Inter:wght@400..700&display=swap"
      rel="stylesheet"
    />
    {{-- Datos públicos que la organización edita en el panel (contacto y fechas): la página los lee al cargar --}}
    <script>window.__CONGRESO__ = @json(\App\Support\Ajustes::paraLaPagina());</script>
    @viteReactRefresh
    @vite($entrada)
  </head>
  <body>
    <noscript>Activa JavaScript para ver el sitio del Congreso Saberes Andinoamazónicos.</noscript>
    <div id="root"></div>
  </body>
</html>
