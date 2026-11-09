<?php

namespace App\Support;

use App\Mail\AccesoAula;
use App\Models\Participante;

// Acceso al Aula virtual: usuario (DNI o correo) + contraseña temporal, programa con Zoom y, si falta, los datos de pago
class Accesos
{
    // Contraseña fácil de dictar: sin letras ni números que se confunden (l, 1, O, 0…)
    public static function generarClave(int $largo = 8): string
    {
        $caracteres = 'abcdefghjkmnpqrstuvwxyz23456789';

        return collect(range(1, $largo))->map(fn () => $caracteres[random_int(0, strlen($caracteres) - 1)])->implode('');
    }

    // Crea una contraseña temporal, la envía por correo y la guarda solo si el correo salió bien.
    // Al primer ingreso el Aula pide crear una contraseña personal.
    // Como las contraseñas se guardan cifradas, reenviar el acceso siempre genera una nueva.
    public static function enviar(Participante $participante): bool
    {
        $participante->loadMissing('inscripcion');
        $clave = self::generarClave();

        if (! Correo::enviar($participante->correo, new AccesoAula($participante, $clave))) {
            return false;
        }

        $participante->forceFill(['password' => $clave, 'debe_cambiar_clave' => true, 'acceso_enviado_en' => now()])->saveQuietly();

        return true;
    }
}
