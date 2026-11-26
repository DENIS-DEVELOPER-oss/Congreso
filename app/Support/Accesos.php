<?php

namespace App\Support;

use App\Mail\AccesoAula;
use App\Models\Inscripcion;
use App\Models\Participante;
use Illuminate\Database\Eloquent\Builder;

// Acceso al Aula virtual: usuario (DNI o correo) + contraseña temporal, programa del congreso y, si falta, los datos de pago
class Accesos
{
    // Contraseña fácil de dictar: sin letras ni números que se confunden (l, 1, O, 0…)
    public static function generarClave(int $largo = 8): string
    {
        $caracteres = 'abcdefghjkmnpqrstuvwxyz23456789';

        return collect(range(1, $largo))->map(fn () => $caracteres[random_int(0, strlen($caracteres) - 1)])->implode('');
    }

    // Correos por cada pulsación de «Enviar accesos a todos» (más se cortaría por el tiempo límite del servidor)
    public const LOTE_PANEL = 15;

    // Inscritos (menos los anulados) que aún no tienen acceso al Aula. Con $sinIngresar, también quienes lo recibieron
    // pero nunca entraron (siguen con la contraseña temporal). Nunca incluye a quien ya creó su propia contraseña,
    // porque reenviar el acceso cambia la contraseña.
    public static function pendientes(bool $sinIngresar = false): Builder
    {
        return Inscripcion::query()
            ->with('participante')
            ->where('estado', '!=', 'anulada')
            ->whereHas('participante', fn (Builder $q) => $q
                ->whereNotNull('correo')->where('correo', '!=', '')
                ->where(fn (Builder $q) => $q->whereNull('password')
                    ->when($sinIngresar, fn (Builder $q) => $q->orWhere('debe_cambiar_clave', true))))
            ->orderBy('id');
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
