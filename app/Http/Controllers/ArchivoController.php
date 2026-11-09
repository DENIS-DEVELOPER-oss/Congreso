<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\Ponencia;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

// Archivos privados (vouchers y resúmenes): solo los ven los organizadores con sesión iniciada
class ArchivoController extends Controller
{
    public function voucher(Inscripcion $inscripcion): StreamedResponse
    {
        abort_unless($inscripcion->voucher && Storage::exists($inscripcion->voucher), 404);

        return Storage::response($inscripcion->voucher, 'voucher-'.$inscripcion->codigo.'.'.pathinfo($inscripcion->voucher, PATHINFO_EXTENSION));
    }

    public function ponencia(Ponencia $ponencia): StreamedResponse
    {
        abort_unless(Storage::exists($ponencia->archivo), 404);

        return Storage::download($ponencia->archivo, $ponencia->codigo.'.'.pathinfo($ponencia->archivo, PATHINFO_EXTENSION));
    }
}
