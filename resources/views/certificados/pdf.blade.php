{{-- Plantilla del certificado (A4 horizontal) que genera dompdf. Solo CSS sencillo: dompdf no admite flex ni grid. --}}
@php
  $tipo = mb_strtolower(\App\Models\Certificado::TIPOS[$c->tipo] ?? $c->tipo);
@endphp
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    @page { margin: 0; }
    body { margin: 0; font-family: 'Times New Roman', Times, serif; color: #0f172a; }
    .hoja { position: absolute; top: 0; left: 0; width: 297mm; height: 210mm; background: #fbfaf6; }
    .marco { position: absolute; top: 9mm; left: 9mm; right: 9mm; bottom: 9mm; border: 1.5mm solid #1e3a8a; }
    .marco-interior { position: absolute; top: 12.5mm; left: 12.5mm; right: 12.5mm; bottom: 12.5mm; border: 0.4mm solid #fbbf24; }
    .contenido { position: absolute; top: 19mm; left: 28mm; right: 28mm; text-align: center; }
    .insignias { margin-bottom: 2.5mm; }
    .insignias img { height: 14mm; margin: 0 3mm; vertical-align: middle; }
    .instituciones { font-family: Helvetica, Arial, sans-serif; font-size: 9.5pt; letter-spacing: 0.6pt; text-transform: uppercase; color: #2563eb; line-height: 1.5; }
    .titulo { margin-top: 5mm; font-size: 40pt; letter-spacing: 6pt; color: #1e3a8a; }
    .linea { margin: 3mm auto 0; width: 50mm; border-top: 0.5mm solid #fbbf24; }
    .otorgado { margin-top: 7mm; font-family: Helvetica, Arial, sans-serif; font-size: 11pt; color: #475569; }
    .nombre { margin-top: 3mm; font-size: 30pt; font-style: italic; color: #0b1f5c; }
    .texto { margin: 6mm auto 0; width: 210mm; font-size: 13.5pt; line-height: 1.55; color: #334155; }
    .firma { position: absolute; bottom: 27mm; width: 64mm; text-align: center; font-family: Helvetica, Arial, sans-serif; font-size: 8.5pt; line-height: 1.35; color: #334155; }
    .firma img { display: block; margin: 0 auto 1mm; max-height: 16mm; max-width: 50mm; }
    .firma .raya { border-top: 0.3mm solid #0f172a; margin-bottom: 1.5mm; }
    .firma .quien { font-size: 9.5pt; font-weight: bold; color: #0f172a; }
    .qr { position: absolute; right: 18mm; bottom: 17mm; width: 20mm; height: 20mm; }
    .qr-texto { position: absolute; right: 14mm; bottom: 12.8mm; width: 28mm; text-align: center; font-family: Helvetica, Arial, sans-serif; font-size: 6pt; color: #64748b; }
    .verificacion { position: absolute; bottom: 15mm; left: 0; right: 0; text-align: center; font-family: Helvetica, Arial, sans-serif; font-size: 8pt; color: #64748b; }
  </style>
</head>
<body>
  <div class="hoja">
    <div class="marco"></div>
    <div class="marco-interior"></div>

    <div class="contenido">
      @if ($insignias)
        <div class="insignias">
          @foreach ($insignias as $insignia)
            <img src="{{ $insignia }}" alt="" />
          @endforeach
        </div>
      @endif
      <div class="instituciones">
        Universidad Nacional del Altiplano · Vicerrectorado Académico · Facultad de Ciencias Sociales<br />
        Escuela Profesional de Sociología · Instituto de Investigaciones para el Desarrollo Social Andino (IIDSA)<br />
        Colegio de Sociólogos del Perú
      </div>

      <div class="titulo">CERTIFICADO</div>
      <div class="linea"></div>

      <div class="otorgado">Otorgado a:</div>
      <div class="nombre">{{ $c->participante->nombre_completo }}</div>

      <div class="texto">
        Por su participación en calidad de <strong>{{ $tipo }}</strong> en el {{ config('congreso.nombre') }},
        realizado en la ciudad de Puno, en modalidad presencial y virtual, el {{ config('congreso.fechas_texto') }}, con una duración de
        <strong>{{ $c->horas }} horas académicas</strong>.
      </div>
    </div>

    {{-- Firmas (se configuran en el panel). Bloques con posición fija: dompdf no respeta bien los anchos de tabla. --}}
    @php
      $centros = [1 => [148.5], 2 => [95, 202], 3 => [72, 148.5, 225]][count($firmantes)] ?? [95, 202];
    @endphp
    @foreach ($firmantes as $i => $f)
      <div class="firma" style="left: {{ $centros[$i] - 32 }}mm">
        @if ($f['imagen'])
          <img src="{{ $f['imagen'] }}" alt="" />
        @endif
        <div class="raya"></div>
        @if (! empty($f['nombre']))
          <div class="quien">{{ $f['nombre'] }}</div>
        @endif
        {{ $f['cargo'] }}
      </div>
    @endforeach

    {{-- QR que lleva a la página de verificación --}}
    <img class="qr" src="{{ $qr }}" alt="" />
    <div class="qr-texto">Verifica este certificado</div>

    <div class="verificacion">
      Puno, {{ $c->emitido_en->locale('es')->translatedFormat('j \d\e F \d\e Y') }} · Código de verificación: {{ $c->codigo_verificacion }} · {{ route('certificados.verificar', $c->codigo_verificacion) }}
    </div>
  </div>
</body>
</html>
