<?php

namespace App\Support;

use App\Mail\CertificadoListo;
use App\Models\Certificado;
use App\Models\Inscripcion;
use App\Models\Ponencia;

// Emisión y envío de certificados desde el panel
class Certificacion
{
    // Asistentes: inscripción validada y asistencia mínima. Devuelve cuántos certificados nuevos se crearon.
    public static function emitirAsistentes(): int
    {
        $nuevos = 0;
        Inscripcion::cumplenAsistencia()->pluck('participante_id')->each(function ($id) use (&$nuevos) {
            $nuevos += (int) Certificado::firstOrCreate(['participante_id' => $id, 'tipo' => 'asistente'])->wasRecentlyCreated;
        });

        return $nuevos;
    }

    // Ponentes: autores de ponencias aceptadas
    public static function emitirPonentes(): int
    {
        $nuevos = 0;
        Ponencia::where('estado', 'aceptada')->pluck('autor_id')->unique()->each(function ($id) use (&$nuevos) {
            $nuevos += (int) Certificado::firstOrCreate(['participante_id' => $id, 'tipo' => 'ponente'])->wasRecentlyCreated;
        });

        return $nuevos;
    }

    // Envía el enlace del certificado por correo y marca la fecha de envío
    public static function enviar(Certificado $certificado): bool
    {
        $certificado->loadMissing('participante');
        $ok = Correo::enviar($certificado->participante->correo, new CertificadoListo($certificado));
        if ($ok) {
            $certificado->update(['enviado_en' => now()]);
        }

        return $ok;
    }
}
