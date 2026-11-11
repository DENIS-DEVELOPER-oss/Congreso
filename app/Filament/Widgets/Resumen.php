<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Ponencias\PonenciaResource;
use App\Models\Certificado;
use App\Models\Inscripcion;
use App\Models\Ponencia;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

// Cuatro cifras esenciales en el inicio del panel
class Resumen extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected ?string $pollingInterval = '60s';

    protected function getStats(): array
    {
        $inscritos = Inscripcion::where('estado', '!=', 'anulada')->count();
        $hoy = Inscripcion::where('estado', '!=', 'anulada')->whereDate('created_at', today())->count();
        $ponencias = Ponencia::selectRaw('estado, count(*) as n')->groupBy('estado')->pluck('n', 'estado');
        $porEvaluar = $ponencias['recibida'] ?? 0;
        $certificados = Certificado::count();

        return [
            Stat::make('Inscritos', $inscritos)
                ->description($hoy ? "{$hoy} hoy" : 'Ninguno hoy')
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color('success'),
            Stat::make('Resúmenes recibidos', $ponencias->sum())
                ->description(($ponencias['aceptada'] ?? 0).' aceptados · '.($ponencias['observada'] ?? 0).' observados')
                ->descriptionIcon(Heroicon::OutlinedDocumentText)
                ->color('info'),
            Stat::make('Por evaluar', $porEvaluar)
                ->description($porEvaluar ? 'Pulsa para dictaminar' : 'Todo al día')
                ->descriptionIcon(Heroicon::OutlinedScale)
                ->color($porEvaluar ? 'warning' : 'gray')
                ->url(PonenciaResource::getUrl('index')),
            Stat::make('Certificados', $certificados)
                ->description(Certificado::whereNotNull('enviado_en')->count().' enviados por correo')
                ->descriptionIcon(Heroicon::OutlinedTrophy),
        ];
    }
}
