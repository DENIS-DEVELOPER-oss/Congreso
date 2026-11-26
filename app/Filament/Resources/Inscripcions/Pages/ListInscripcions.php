<?php

namespace App\Filament\Resources\Inscripcions\Pages;

use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Models\Inscripcion;
use App\Support\Accesos;
use App\Support\Ajustes;
use App\Support\Recordatorios;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
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
            // Usuario y contraseña del Aula a todos los inscritos que aún no lo tienen, por tandas
            Action::make('accesosTodos')->label('Enviar accesos a todos')->icon(Heroicon::OutlinedKey)->color('primary')
                ->badge(fn () => Accesos::pendientes()->count() ?: null)
                ->modalHeading('Enviar usuario y contraseña del Aula virtual')
                ->modalDescription(fn () => 'Cada persona recibe por correo su usuario (DNI) y una contraseña temporal. '
                    .'Faltan '.Accesos::pendientes()->count().' inscritos sin acceso (las anuladas no se incluyen). '
                    .'Cada vez que pulses «Enviar» se envía a los siguientes '.Accesos::LOTE_PANEL.': vuelve a pulsar hasta que no quede nadie. '
                    .'Nunca se envía a quien ya creó su propia contraseña, para no cambiársela.')
                ->schema([
                    Toggle::make('sin_ingresar')->label('Incluir a quienes ya recibieron su acceso pero nunca ingresaron')
                        ->helperText(fn () => Accesos::pendientes(true)->count().' en total con esta opción. Recibirán una contraseña temporal nueva (la anterior deja de funcionar).'),
                ])
                ->modalSubmitActionLabel('Enviar')
                ->action(function (array $data) {
                    @set_time_limit(120);
                    $sinIngresar = (bool) ($data['sin_ingresar'] ?? false);
                    // Los ya enviados en esta tanda salen de la lista: con «sin ingresar» se excluye a quien recibió acceso hace un momento
                    $lote = Accesos::pendientes($sinIngresar)
                        ->when($sinIngresar, fn (Builder $q) => $q->whereHas('participante', fn (Builder $p) => $p
                            ->where(fn (Builder $p) => $p->whereNull('acceso_enviado_en')->orWhere('acceso_enviado_en', '<', now()->subHours(6)))))
                        ->limit(Accesos::LOTE_PANEL)->get();
                    if ($lote->isEmpty()) {
                        Notification::make()->title('Todos los inscritos ya tienen su acceso')->success()->send();

                        return;
                    }
                    $ok = $lote->filter(fn ($i) => Accesos::enviar($i->participante))->count();
                    $faltan = Accesos::pendientes()->count();
                    Notification::make()
                        ->title("Se enviaron {$ok} de {$lote->count()} accesos")
                        ->body($ok < $lote->count()
                            ? 'Algunos correos no salieron: vuelve a pulsar para reintentar.'
                            : ($faltan ? "Faltan {$faltan} sin acceso: vuelve a pulsar «Enviar accesos a todos»." : 'Listo: todos los inscritos tienen su acceso.'))
                        ->{$ok === $lote->count() ? 'success' : 'warning'}()
                        ->persistent()->send();
                }),
            // Recordatorio a todos los correos registrados, por tandas: cada pulsación envía a los siguientes que aún no lo recibieron
            Action::make('recordatorioTodos')->label('Enviar recordatorio a todos')->icon(Heroicon::OutlinedEnvelope)->color('success')
                ->badge(fn () => Recordatorios::pendientes()->count() ?: null)
                ->modalHeading('Enviar recordatorio de asistencia a todos')
                ->modalDescription(fn () => 'Faltan '.Recordatorios::pendientes()->count().' inscritos por recibirlo (las anuladas no se incluyen). '
                    .'Cada vez que pulses «Enviar» se envía a los siguientes '.Recordatorios::LOTE_PANEL.' y nunca se repite a quien ya lo recibió: '
                    .'vuelve a pulsar el botón hasta que no quede nadie.')
                ->schema([
                    ...Recordatorios::campos(),
                    Toggle::make('solo_confirmadas')->label('Solo inscripciones confirmadas')
                        ->helperText('Apagado: también reciben quienes aún figuran como pendientes.'),
                ])
                ->modalSubmitActionLabel('Enviar')
                ->action(function (array $data) {
                    @set_time_limit(120);
                    Recordatorios::guardarGrupo($data['grupo_whatsapp'] ?? null);
                    $lote = Recordatorios::pendientes((bool) $data['solo_confirmadas'])->limit(Recordatorios::LOTE_PANEL)->get();
                    if ($lote->isEmpty()) {
                        Notification::make()->title('Todos ya recibieron el recordatorio')->success()->send();

                        return;
                    }
                    $ok = $lote->filter(fn ($i) => Recordatorios::enviar($i, $data['dia']))->count();
                    $faltan = Recordatorios::pendientes((bool) $data['solo_confirmadas'])->count();
                    Notification::make()
                        ->title("Se enviaron {$ok} de {$lote->count()} recordatorios")
                        ->body($faltan ? "Faltan {$faltan}: vuelve a pulsar «Enviar recordatorio a todos»." : 'Listo: ya lo recibieron todos.')
                        ->{$ok === $lote->count() ? 'success' : 'warning'}()
                        ->persistent()->send();
                }),
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
