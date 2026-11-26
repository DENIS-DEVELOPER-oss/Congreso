<?php

namespace App\Support;

use App\Mail\RecordatorioAsistencia;
use App\Models\Inscripcion;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
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

    // Campos de la ventana de envío (admin y organizador): días y enlace del grupo de WhatsApp
    public static function campos(): array
    {
        return [
            Select::make('dia')->label('¿Para qué días es el recordatorio?')->options(RecordatorioAsistencia::DIAS)->required(),
            self::campoGrupoWhatsApp()->default(fn () => config('congreso.grupo_whatsapp')),
        ];
    }

    public static function campoGrupoWhatsApp(): TextInput
    {
        return TextInput::make('grupo_whatsapp')->label('Enlace del grupo de WhatsApp (opcional)')
            ->url()->maxLength(200)->placeholder('https://chat.whatsapp.com/…')
            ->regex('#^https://chat\.whatsapp\.com/\S+$#')
            ->validationMessages(['regex' => 'Pega el enlace de invitación del grupo: empieza con https://chat.whatsapp.com/'])
            ->helperText('Si lo pones, el recordatorio incluye un botón para unirse al grupo donde se compartirán comunicados.');
    }

    // Guarda el enlace del grupo (vacío = sin grupo) para que vaya en este envío y en los siguientes
    public static function guardarGrupo(?string $enlace): void
    {
        $enlace = filled($enlace) ? trim($enlace) : null;
        Ajustes::guardar(['grupo_whatsapp' => $enlace]);
        config(['congreso.grupo_whatsapp' => $enlace]);
    }
}
