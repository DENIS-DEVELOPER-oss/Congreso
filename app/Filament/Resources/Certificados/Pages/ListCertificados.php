<?php

namespace App\Filament\Resources\Certificados\Pages;

use App\Filament\Resources\Certificados\CertificadoResource;
use App\Models\Certificado;
use App\Models\Inscripcion;
use App\Models\Sesion;
use App\Support\Certificacion;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;

class ListCertificados extends ListRecords
{
    protected static string $resource = CertificadoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ActionGroup::make([
                Action::make('emitirAsistentes')->label('Emitir a asistentes')->icon(Heroicon::OutlinedUserGroup)
                    ->requiresConfirmation()
                    ->modalDescription(fn () => 'Se emitirá el certificado de asistente a cada inscripción validada que asistió al menos a '
                        .Inscripcion::asistenciasMinimas().' de '.Sesion::count().' sesiones ('.config('congreso.porcentaje_asistencia').' %). '
                        .'Quienes ya lo tienen no se duplican.')
                    ->action(function () {
                        $n = Certificacion::emitirAsistentes();
                        Notification::make()->title("Se emitieron {$n} certificados de asistente")->success()->send();
                    }),
                Action::make('emitirPonentes')->label('Emitir a ponentes')->icon(Heroicon::OutlinedMicrophone)
                    ->requiresConfirmation()
                    ->modalDescription('Se emitirá el certificado de ponente al autor de cada ponencia aceptada.')
                    ->action(function () {
                        $n = Certificacion::emitirPonentes();
                        Notification::make()->title("Se emitieron {$n} certificados de ponente")->success()->send();
                    }),
                Action::make('enviarPendientes')->label('Enviar los que faltan')->icon(Heroicon::OutlinedEnvelope)
                    ->requiresConfirmation()
                    ->modalDescription(fn () => 'Se enviará por correo cada certificado que aún no se envió ('
                        .Certificado::whereNull('enviado_en')->count().').')
                    ->action(function () {
                        $pendientes = Certificado::with('participante')->whereNull('enviado_en')->get();
                        $ok = $pendientes->filter(fn ($c) => Certificacion::enviar($c))->count();
                        Notification::make()->title("Se enviaron {$ok} de {$pendientes->count()} certificados")
                            ->{$ok === $pendientes->count() ? 'success' : 'warning'}()->send();
                    }),
            ])->label('Emitir y enviar')->icon(Heroicon::OutlinedSparkles)->button()->color('primary'),
            CreateAction::make()->label('Emitir uno a mano')->color('gray'),
        ];
    }
}
