<?php

namespace App\Support;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

// Envía un correo sin interrumpir el trámite si el servidor de correo falla (queda registrado en el log)
class Correo
{
    public static function enviar(string $destino, Mailable $correo): bool
    {
        try {
            Mail::to($destino)->send($correo);

            return true;
        } catch (Throwable $e) {
            Log::warning('No se pudo enviar el correo a '.$destino.': '.$e->getMessage());

            return false;
        }
    }
}
