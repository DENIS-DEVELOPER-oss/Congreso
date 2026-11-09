<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Models\Certificado;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Ponencia;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

// Cifras del congreso en el inicio del panel: cuántos participan, pagos por revisar, ponencias y certificados
class Resumen extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected ?string $pollingInterval = '60s';

    protected function getStats(): array
    {
        $porEstado = Inscripcion::selectRaw('estado, count(*) as n')->groupBy('estado')->pluck('n', 'estado');
        $validadas = Inscripcion::validadas();
        $porTipo = (clone $validadas)->selectRaw('tipo_participante, count(*) as n')->groupBy('tipo_participante')->pluck('n', 'tipo_participante');
        $detalleTipos = collect(config('congreso.tarifas'))
            ->map(fn ($t, $tipo) => ($porTipo[$tipo] ?? 0).' '.mb_strtolower($t['nombre']).'s')
            ->implode(' · ');
        $ponencias = Ponencia::selectRaw('estado, count(*) as n')->groupBy('estado')->pluck('n', 'estado');
        $sinConfirmar = Participante::whereNull('correo_verificado_en')->whereHas('inscripcion', fn ($q) => $q->where('estado', '!=', 'anulada'))->count();
        $porRevisar = Inscripcion::where('estado', 'pendiente')->whereNotNull('voucher')->count();
        $sinAcceso = Participante::whereNull('password')->whereHas('inscripcion', fn ($q) => $q->where('estado', '!=', 'anulada'))->count();
        $certificados = Certificado::count();
        $enviados = Certificado::whereNotNull('enviado_en')->count();

        return [
            Stat::make('Participantes confirmados', $porEstado['validada'] ?? 0)
                ->description($detalleTipos.($sinConfirmar ? " · {$sinConfirmar} sin confirmar su correo" : ''))
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color('success'),
            Stat::make('Vouchers por revisar', $porRevisar)
                ->description(($porEstado['pendiente'] ?? 0) - $porRevisar.' registrados sin pago · '.($porEstado['observada'] ?? 0).' observados · '.$sinAcceso.' sin acceso al aula')
                ->descriptionIcon(Heroicon::OutlinedClock)
                ->color($porRevisar ? 'warning' : 'gray')
                ->url(InscripcionResource::getUrl('index', ['tab' => 'por_revisar'])),
            Stat::make('Recaudado (validado)', 'S/ '.number_format((float) Inscripcion::validadas()->sum('monto'), 2))
                ->description('Solo pagos validados')
                ->descriptionIcon(Heroicon::OutlinedBanknotes),
            Stat::make('Ponencias recibidas', $ponencias->sum())
                ->description(($ponencias['aceptada'] ?? 0).' aceptadas · '.($ponencias['recibida'] ?? 0).' por evaluar')
                ->descriptionIcon(Heroicon::OutlinedDocumentText)
                ->color('info'),
            Stat::make('Certificados', $certificados)
                ->description("{$enviados} enviados por correo")
                ->descriptionIcon(Heroicon::OutlinedTrophy),
        ];
    }
}
