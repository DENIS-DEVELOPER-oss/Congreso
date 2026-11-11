<?php

namespace App\Http\Controllers;

use App\Models\Certificado;
use Barryvdh\DomPDF\Facade\Pdf;
use chillerlan\QRCode\Output\QROutputInterface;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\View\View;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CertificadoController extends Controller
{
    // GET /certificados/{codigo}: PDF del certificado (subido por la organización o generado con la plantilla)
    public function descargar(string $codigo): Response
    {
        $certificado = Certificado::with('participante')->where('codigo_verificacion', $codigo)->firstOrFail();
        $nombre = 'certificado-'.Str::slug($certificado->participante->nombre_completo).'.pdf';

        if ($certificado->archivo_pdf && Storage::exists($certificado->archivo_pdf)) {
            return Storage::response($certificado->archivo_pdf, $nombre);
        }

        return Pdf::loadView('certificados.pdf', [
            'c' => $certificado,
            'qr' => self::qr(route('certificados.verificar', $certificado->codigo_verificacion)),
            'firmantes' => self::firmantes(),
            'insignias' => self::insignias(),
        ])
            ->setPaper('a4', 'landscape')
            ->stream($nombre);
    }

    // GET /verificar/{codigo}: página que confirma si un certificado es auténtico (a ella lleva el QR)
    public function verificar(string $codigo): View
    {
        return view('verificar', [
            'codigo' => strtoupper($codigo),
            'c' => Certificado::with('participante')->where('codigo_verificacion', strtoupper($codigo))->first(),
        ]);
    }

    // QR como imagen PNG incrustada (dompdf no carga imágenes externas)
    private static function qr(string $texto): string
    {
        $opciones = new QROptions(['outputType' => QROutputInterface::GDIMAGE_PNG, 'scale' => 6, 'addQuietzone' => false]);

        return (new QRCode($opciones))->render($texto);
    }

    // Insignias de las instituciones organizadoras (public/insignias), incrustadas en el PDF
    private static function insignias(): array
    {
        return collect(['unap', 'vicerrectorado-academico', 'facultad-ciencias-sociales', 'sociologia'])
            ->map(fn ($n) => public_path("insignias/{$n}.png"))
            ->filter(fn ($ruta) => is_file($ruta))
            ->map(fn ($ruta) => 'data:image/png;base64,'.base64_encode(file_get_contents($ruta)))
            ->values()->all();
    }

    // Firmantes configurados en el panel, con la imagen de su firma incrustada si la subieron
    private static function firmantes(): array
    {
        return collect(config('congreso.firmantes'))->map(function ($f) {
            $firma = $f['firma'] ?? null;
            $f['imagen'] = $firma && Storage::exists($firma)
                ? 'data:'.Storage::mimeType($firma).';base64,'.base64_encode(Storage::get($firma))
                : null;

            return $f;
        })->values()->all();
    }
}
