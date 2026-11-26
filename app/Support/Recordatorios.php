<?php

namespace App\Support;

use App\Mail\RecordatorioAsistencia;
use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Builder;

// Recordatorio de asistencia a los inscritos (desde el panel o con php artisan congreso:recordatorio)
class Recordatorios
{
    // Correos por cada pulsación del botón del panel (más se cortaría por el tiempo límite del servidor)
    public const LOTE_PANEL = 15;

    // Inscritos que deben recibirlo: todos menos los anulados (o solo los confirmados) y, salvo que se pida, solo quienes aún no lo recibieron
    public static function pendientes(bool $soloConfirmadas = false, bool $deNuevo = false): Builder
    {
        return Inscripcion::query()
            ->with('participante')
            ->when($soloConfirmadas, fn (Builder $q) => $q->where('estado', 'validada'), fn (Builder $q) => $q->where('estado', '!=', 'anulada'))
            ->when(! $deNuevo, fn (Builder $q) => $q->whereNull('recordatorio_enviado_en'))
            ->whereHas('participante', fn (Builder $q) => $q->whereNotNull('correo')->where('correo', '!=', ''))
            ->orderBy('id');
    }

    // Envía el recordatorio a la persona inscrita y anota cuándo; devuelve false si el servidor de correo falló
    public static function enviar(Inscripcion $inscripcion, string $dia = 'ambos'): bool
    {
        $ok = Correo::enviar($inscripcion->participante->correo, new RecordatorioAsistencia($inscripcion, $dia));
        if ($ok) {
            $inscripcion->forceFill(['recordatorio_enviado_en' => now()])->saveQuietly();
        }

        return $ok;
    }
}
