<?php

namespace App\Filament\Resources\Inscripcions\Pages;

use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Models\Inscripcion;
use App\Support\Ajustes;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;

class ListInscripcions extends ListRecords
{
    protected static string $resource = InscripcionResource::class;

    // Pestañas rápidas: asistentes y ponentes por separado. Con inscripción gratuita, «Por confirmar» reúne las
    // solicitudes de la web; con pago, «Pendiente» se divide en vouchers por revisar y registrados que aún no pagan.
    public function getTabs(): array
    {
        $ponentes = Inscripcion::where('tipo_participante', 'ponente')->count();
        $asistentes = Inscripcion::where('tipo_participante', '!=', 'ponente')->count();
        $porTipo = [
            'asistentes' => Tab::make('Asistentes')->badge($asistentes)->badgeColor('gray')->icon(Heroicon::OutlinedUser)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('tipo_participante', '!=', 'ponente')),
            'ponentes' => Tab::make('Ponentes')->badge($ponentes)->badgeColor('info')->icon(Heroicon::OutlinedMicrophone)
                ->modifyQueryUsing(fn (Builder $query) => $query->where('tipo_participante', 'ponente')),
        ];

        $conteo = Inscripcion::selectRaw('estado, count(*) as n')->groupBy('estado')->pluck('n', 'estado');
        $porRevisar = Inscripcion::where('estado', 'pendiente')->whereNotNull('voucher')->count();
        $sinPago = ($conteo['pendiente'] ?? 0) - $porRevisar;
        $estado = fn (string $e) => Tab::make(Inscripcion::ESTADOS[$e])
            ->badge($conteo[$e] ?? 0)->badgeColor(InscripcionResource::colorEstado($e))
            ->modifyQueryUsing(fn (Builder $query) => $query->where('estado', $e));

        if (Ajustes::gratuita()) {
            return [
                'todas' => Tab::make('Todas')->badge($conteo->sum()),
                'por_confirmar' => Tab::make('Por confirmar')->badge($conteo['pendiente'] ?? 0)->badgeColor('warning')
                    ->modifyQueryUsing(fn (Builder $query) => $query->where('estado', 'pendiente')),
                ...$porTipo,
                'validada' => $estado('validada')->label('Confirmadas'),
                'anulada' => $estado('anulada'),
            ];
        }

        return [
            'todas' => Tab::make('Todas')->badge($conteo->sum()),
            ...$porTipo,
            'por_revisar' => Tab::make('Por revisar')->badge($porRevisar)->badgeColor('warning')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('estado', 'pendiente')->whereNotNull('voucher')),
            'sin_pago' => Tab::make('Sin pago')->badge($sinPago)->badgeColor('gray')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('estado', 'pendiente')->whereNull('voucher')),
            'validada' => $estado('validada'),
            'observada' => $estado('observada'),
            'anulada' => $estado('anulada'),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Inscribir manualmente')->icon(Heroicon::OutlinedUserPlus),
            // CSV que Excel abre directamente (separador ; y acentos correctos)
            Action::make('exportar')->label('Exportar a Excel')->icon(Heroicon::OutlinedArrowDownTray)->color('gray')
                ->action(fn () => response()->streamDownload(function () {
                    $f = fopen('php://output', 'w');
                    fwrite($f, "\xEF\xBB\xBF");
                    fputcsv($f, ['Código', 'Estado', 'Tipo', 'Resumen', 'Título de la ponencia', 'Eje', 'Monto', 'Medio de pago', 'N.° operación', 'DNI/Pasaporte', 'Nombres', 'Apellidos', 'Correo', 'Correo confirmado', 'Acceso al aula', 'Celular', 'Institución', 'Fecha de registro', 'Asistencias'], ';');
                    Inscripcion::with(['participante', 'resumen.eje'])->withCount('asistencias')->orderBy('id')->chunk(200, function ($lote) use ($f) {
                        foreach ($lote as $i) {
                            fputcsv($f, [
                                $i->codigo, InscripcionResource::nombreEstado($i->estado),
                                config("congreso.tarifas.{$i->tipo_participante}.nombre"),
                                $i->resumen?->codigo, $i->resumen?->titulo, $i->resumen?->eje?->orden, $i->monto,
                                InscripcionResource::medios()[$i->medio_pago] ?? $i->medio_pago, $i->numero_operacion,
                                $i->participante->documento, $i->participante->nombres, $i->participante->apellidos,
                                $i->participante->correo, $i->participante->correoConfirmado() ? 'Sí' : 'No', $i->participante->tieneAcceso() ? 'Enviado' : 'No', $i->participante->telefono, $i->participante->institucion,
                                $i->created_at->format('d/m/Y H:i'), $i->asistencias_count,
                            ], ';');
                        }
                    });
                    fclose($f);
                }, 'inscripciones-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8'])),
        ];
    }
}
