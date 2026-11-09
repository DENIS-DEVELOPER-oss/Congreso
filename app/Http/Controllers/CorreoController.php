<?php

namespace App\Http\Controllers;

use App\Models\Participante;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CorreoController extends Controller
{
    // GET /confirmar-correo/{participante}?h=…&signature=… (enlace del correo de constancia)
    public function confirmar(Request $request, Participante $participante): View
    {
        // El correo cambió después de enviar el enlace: este enlace ya no corresponde
        if (! hash_equals($participante->huellaCorreo(), (string) $request->query('h'))) {
            return view('correo-confirmado', ['estado' => 'cambio', 'participante' => $participante]);
        }

        $yaEstaba = $participante->correoConfirmado();
        if (! $yaEstaba) {
            $participante->forceFill(['correo_verificado_en' => now()])->saveQuietly();
        }

        return view('correo-confirmado', ['estado' => $yaEstaba ? 'ya' : 'ok', 'participante' => $participante]);
    }
}
