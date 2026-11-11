<?php

namespace App\Filament\Resources\Inscripcions;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\Inscripcions\Pages\CreateInscripcion;
use App\Filament\Resources\Inscripcions\Pages\EditInscripcion;
use App\Filament\Resources\Inscripcions\Pages\ListInscripcions;
use App\Mail\InscripcionValidada;
use App\Models\Inscripcion;
use App\Models\Ponencia;
use App\Support\Accesos;
use App\Support\Ajustes;
use App\Support\Correo;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use UnitEnum;

class InscripcionResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = Inscripcion::class;

    protected static ?string $slug = 'inscripciones';

    protected static ?string $modelLabel = 'inscripción';

    protected static ?string $pluralModelLabel = 'inscripciones';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Participantes';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'codigo';

    // Junto al menú: solicitudes por confirmar (inscripción gratuita) o vouchers por revisar (con pago)
    public static function getNavigationBadge(): ?string
    {
        $n = Inscripcion::where('estado', 'pendiente')
            ->when(! Ajustes::gratuita(), fn (Builder $q) => $q->whereNotNull('voucher'))
            ->count();

        return $n ? (string) $n : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    // Medios de pago públicos + los del panel (efectivo)
    public static function medios(): array
    {
        return config('congreso.medios_pago') + config('congreso.medios_pago_panel');
    }

    // Reenvía el enlace para confirmar el correo (si aún no lo confirmó)
    // Envía usuario (DNI) y contraseña nueva de "Mi cuenta" con el monto y los medios de pago
    public static function accionEnviarAcceso(string $nombre = 'enviarAcceso'): Action
    {
        return Action::make($nombre)
            ->label(fn (Inscripcion $record) => $record->participante->tieneAcceso() ? 'Reenviar acceso' : 'Enviar acceso')
            ->icon(Heroicon::OutlinedKey)->color('primary')
            ->requiresConfirmation()
            ->modalHeading('Enviar acceso al Aula virtual')
            ->modalDescription(fn (Inscripcion $record) => "Se enviará a {$record->participante->correo} su usuario ({$record->participante->documento}) "
                .'y una contraseña temporal nueva.'
                .($record->participante->tieneAcceso() ? ' La contraseña anterior dejará de funcionar.' : ''))
            ->action(fn (Inscripcion $record) => Accesos::enviar($record->participante)
                ? Notification::make()->title('Acceso enviado')->body($record->participante->correo)->success()->send()
                : Notification::make()->title('No se pudo enviar el correo')->body('Revisa la configuración de correo del servidor.')->danger()->send());
    }

    // Con inscripción gratuita no hay pago que validar: «Validada» se muestra como «Confirmada»
    public static function nombreEstado(?string $estado): string
    {
        if ($estado === 'validada' && Ajustes::gratuita()) {
            return 'Confirmada';
        }

        return Inscripcion::ESTADOS[$estado] ?? (string) $estado;
    }

    // 951 913 416 → 51951913416 (los números peruanos de 9 dígitos llevan el código del país)
    public static function numeroWhatsApp(?string $telefono): string
    {
        $n = preg_replace('/\D/', '', (string) $telefono);

        return strlen($n) === 9 ? '51'.$n : $n;
    }

    public static function colorEstado(?string $estado): string
    {
        return match ($estado) {
            'validada' => 'success',
            'pendiente' => 'warning',
            'observada' => 'danger',
            default => 'gray',
        };
    }

    // Cambia el estado del pago y avisa al participante por correo
    public static function cambiarEstado(Inscripcion $inscripcion, string $estado, ?string $observacion = null): void
    {
        $inscripcion->update([
            'estado' => $estado,
            'observacion' => $observacion,
            'validado_por' => auth()->id(),
            'validado_en' => now(),
        ]);

        if (! Ajustes::gratuita() && in_array($estado, ['validada', 'observada'])) {
            Correo::enviar($inscripcion->participante->correo, new InscripcionValidada($inscripcion));
        }
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Participante')
                ->description('Para corregir el nombre o el correo, edítalo en Participantes.')
                ->columns(3)
                ->schema([
                    TextEntry::make('codigo')->label('Código'),
                    TextEntry::make('participante.nombre_completo')->label('Nombre'),
                    TextEntry::make('participante.documento')->label('DNI / Pasaporte'),
                    TextEntry::make('participante.correo')->label('Correo'),
                    TextEntry::make('participante.telefono')->label('Celular'),
                    TextEntry::make('participante.institucion')->label('Institución'),
                    TextEntry::make('participante.correo_verificado_en')->label('Correo confirmado')
                        ->dateTime('d/m/Y H:i')->placeholder('Aún no confirma su correo'),
                ]),
            Section::make('Resumen del ponente')
                ->columns(3)
                ->visible(fn (?Inscripcion $record) => (bool) $record?->resumen)
                ->schema([
                    TextEntry::make('resumen.codigo')->label('Código'),
                    TextEntry::make('resumen.titulo')->label('Título')->columnSpan(2),
                    TextEntry::make('resumen.eje.titulo')->label('Mesa temática')
                        ->formatStateUsing(fn ($state, Inscripcion $record) => 'Eje '.$record->resumen->eje?->orden.'. '.$state)->columnSpan(2),
                    TextEntry::make('resumen.estado')->label('Evaluación')->badge()
                        ->formatStateUsing(fn ($state) => Ponencia::ESTADOS[$state] ?? $state),
                    TextEntry::make('resumen.palabras_clave')->label('Palabras clave')->columnSpan(2),
                    TextEntry::make('resumen.archivo')->label('Archivo')
                        ->formatStateUsing(fn () => 'Abrir resumen')
                        ->url(fn (Inscripcion $record) => route('archivos.ponencia', $record->resumen))
                        ->openUrlInNewTab()
                        ->color('primary'),
                ]),
            Section::make(fn () => Ajustes::gratuita() ? 'Categoría' : 'Pago')
                ->columns(2)
                ->schema([
                    Select::make('tipo_participante')->label('Tipo de participante')->required()
                        ->options(collect(config('congreso.tarifas'))->map(fn ($t) => $t['nombre'])),
                    TextInput::make('monto')->label('Monto')->prefix('S/')->numeric()->required()->hidden(fn () => Ajustes::gratuita()),
                    Select::make('medio_pago')->label('Medio de pago')->options(self::medios())->placeholder('Aún no paga')->hidden(fn () => Ajustes::gratuita()),
                    TextInput::make('numero_operacion')->label('N.° de operación')->maxLength(30)->hidden(fn () => Ajustes::gratuita()),
                    TextEntry::make('voucher')->label('Voucher')->hidden(fn () => Ajustes::gratuita())
                        ->placeholder('Sin voucher')
                        ->formatStateUsing(fn () => 'Abrir voucher')
                        ->url(fn (Inscripcion $record) => route('archivos.voucher', $record))
                        ->openUrlInNewTab()
                        ->color('primary'),
                ]),
            Section::make('Revisión')
                ->columns(2)
                ->schema([
                    Select::make('estado')->required()->options(Inscripcion::ESTADOS),
                    Textarea::make('observacion')->label('Observación')->rows(2)
                        ->helperText('Si el estado es "Observada", explica qué debe corregir el participante.'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['participante', 'resumen.eje']))
            ->columns([
                TextColumn::make('codigo')->label('Código')->searchable()->sortable()->weight('bold'),
                TextColumn::make('participante.nombre_completo')->label('Participante')
                    ->description(fn (Inscripcion $r) => $r->participante->documento)
                    ->searchable(query: fn (Builder $query, string $search) => $query->whereHas('participante', fn ($p) => $p
                        ->where('nombres', 'like', "%{$search}%")
                        ->orWhere('apellidos', 'like', "%{$search}%")
                        ->orWhere('documento', 'like', "%{$search}%"))),
                IconColumn::make('correo_confirmado')->label('Correo')->alignCenter()
                    ->state(fn (Inscripcion $r) => $r->participante->correoConfirmado())
                    ->boolean()->trueIcon(Heroicon::OutlinedEnvelopeOpen)->falseIcon(Heroicon::OutlinedEnvelope)
                    ->trueColor('success')->falseColor('warning')
                    ->tooltip(fn (Inscripcion $r) => $r->participante->correoConfirmado() ? 'Correo confirmado' : 'Aún no confirma su correo'),
                TextColumn::make('acceso')->label('Aula')->badge()
                    ->state(fn (Inscripcion $r) => $r->participante->tieneAcceso() ? 'Enviado' : 'Sin enviar')
                    ->color(fn (Inscripcion $r) => $r->participante->tieneAcceso() ? 'success' : 'gray')
                    ->tooltip(fn (Inscripcion $r) => $r->participante->acceso_enviado_en?->format('d/m/Y H:i')),
                TextColumn::make('participante.telefono')->label('Celular')->copyable()->copyMessage('Celular copiado')
                    ->url(fn (Inscripcion $r) => 'https://wa.me/'.self::numeroWhatsApp($r->participante->telefono))->openUrlInNewTab()
                    ->toggleable(),
                TextColumn::make('participante.institucion')->label('Institución')->limit(30)->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('tipo_participante')->label('Tipo')->badge()
                    ->color(fn ($state) => $state === 'ponente' ? 'info' : 'gray')
                    ->formatStateUsing(fn ($state) => config("congreso.tarifas.$state.nombre", $state)),
                TextColumn::make('resumen.codigo')->label('Resumen')->placeholder('—')
                    ->icon(Heroicon::OutlinedDocumentText)->color('primary')
                    ->description(fn (Inscripcion $r) => $r->resumen?->eje ? 'Eje '.$r->resumen->eje->orden : null)
                    ->tooltip(fn (Inscripcion $r) => $r->resumen?->titulo)
                    ->url(fn (Inscripcion $r) => $r->resumen ? route('archivos.ponencia', $r->resumen) : null)->openUrlInNewTab(),
                TextColumn::make('monto')->formatStateUsing(fn ($state) => 'S/ '.number_format((float) $state, 2))->sortable()
                    ->hidden(fn () => Ajustes::gratuita()),
                TextColumn::make('medio_pago')->label('Pago')->placeholder('Sin pago aún')->hidden(fn () => Ajustes::gratuita())
                    ->formatStateUsing(fn ($state) => self::medios()[$state] ?? $state)
                    ->description(fn (Inscripcion $r) => $r->numero_operacion ? 'Op. '.$r->numero_operacion : ($r->origen === 'panel' ? 'Registrado por la organización' : null)),
                TextColumn::make('estado')->badge()
                    ->formatStateUsing(fn ($state) => self::nombreEstado($state))
                    ->color(fn ($state) => self::colorEstado($state)),
                TextColumn::make('created_at')->label('Recibida')->since()->sortable()
                    ->tooltip(fn (Inscripcion $r) => $r->created_at->format('d/m/Y H:i')),
            ])
            ->filters([
                SelectFilter::make('estado')->options(Inscripcion::ESTADOS),
                SelectFilter::make('tipo_participante')->label('Tipo')
                    ->options(collect(config('congreso.tarifas'))->map(fn ($t) => $t['nombre'])),
                SelectFilter::make('medio_pago')->label('Medio de pago')->options(self::medios())->hidden(fn () => Ajustes::gratuita()),
                TernaryFilter::make('correo_confirmado')->label('Correo confirmado')
                    ->queries(
                        true: fn (Builder $query) => $query->whereHas('participante', fn ($p) => $p->whereNotNull('correo_verificado_en')),
                        false: fn (Builder $query) => $query->whereHas('participante', fn ($p) => $p->whereNull('correo_verificado_en')),
                    ),
            ])
            ->recordActions([
                Action::make('voucher')->label('Voucher')->icon(Heroicon::OutlinedPhoto)->color('gray')
                    ->visible(fn (Inscripcion $record) => filled($record->voucher))
                    ->url(fn (Inscripcion $record) => route('archivos.voucher', $record))
                    ->openUrlInNewTab(),
                // Mientras no tenga acceso, el botón queda a la vista; después pasa al menú como "Reenviar acceso"
                self::accionEnviarAcceso()->visible(fn (Inscripcion $record) => ! $record->participante->tieneAcceso()),
                Action::make('resumen')->label('Resumen')->icon(Heroicon::OutlinedDocumentArrowDown)->color('gray')
                    ->visible(fn (Inscripcion $record) => (bool) $record->resumen)
                    ->url(fn (Inscripcion $record) => route('archivos.ponencia', $record->resumen))
                    ->openUrlInNewTab(),
                Action::make('validar')->label(fn () => Ajustes::gratuita() ? 'Confirmar' : 'Validar')->icon(Heroicon::OutlinedCheckCircle)->color('success')
                    ->visible(fn (Inscripcion $record) => $record->estado !== 'validada')
                    ->requiresConfirmation()
                    ->modalHeading(fn () => Ajustes::gratuita() ? 'Confirmar inscripción' : 'Validar pago')
                    ->modalDescription(fn (Inscripcion $record) => Ajustes::gratuita()
                        ? "Confirma la inscripción de {$record->participante->nombre_completo}. Luego usa «Enviar acceso» para que reciba su usuario del Aula virtual."
                        : "Confirma que recibiste S/ {$record->monto}"
                        .($record->medio_pago ? ' por '.(self::medios()[$record->medio_pago] ?? $record->medio_pago) : '')
                        .($record->numero_operacion ? " (operación {$record->numero_operacion})" : '').'. '
                        .'Se avisará al participante por correo.')
                    ->action(function (Inscripcion $record) {
                        self::cambiarEstado($record, 'validada');
                        Notification::make()->title("Inscripción {$record->codigo} validada")->success()->send();
                    }),
                ActionGroup::make([
                    self::accionEnviarAcceso('reenviarAcceso')->visible(fn (Inscripcion $record) => $record->participante->tieneAcceso()),
                    Action::make('observar')->label('Observar')->icon(Heroicon::OutlinedExclamationTriangle)->color('danger')
                        ->schema([
                            Textarea::make('observacion')->label('¿Qué debe corregir el participante?')->required()
                                ->placeholder('Ej.: el monto del voucher no coincide con la tarifa de docente.'),
                        ])
                        ->action(function (Inscripcion $record, array $data) {
                            self::cambiarEstado($record, 'observada', $data['observacion']);
                            Notification::make()->title('Se envió la observación al participante')->warning()->send();
                        }),
                    Action::make('anular')->label('Anular')->icon(Heroicon::OutlinedXCircle)->color('gray')
                        ->requiresConfirmation()
                        ->action(fn (Inscripcion $record) => self::cambiarEstado($record, 'anulada')),
                    EditAction::make(),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('validarVarias')->label('Validar seleccionadas')
                        ->icon(Heroicon::OutlinedCheckCircle)->color('success')
                        ->requiresConfirmation()
                        ->action(function (Collection $records) {
                            $records->where('estado', '!=', 'validada')->each(fn ($r) => self::cambiarEstado($r, 'validada'));
                            Notification::make()->title('Inscripciones validadas')->success()->send();
                        }),
                    BulkAction::make('enviarAccesos')->label('Enviar acceso al Aula virtual')
                        ->icon(Heroicon::OutlinedKey)
                        ->requiresConfirmation()
                        ->modalDescription('Se envía usuario y contraseña (con los datos de pago) solo a quienes aún no tienen acceso.')
                        ->action(function (Collection $records) {
                            $sin = $records->load('participante')->reject(fn ($r) => $r->participante->tieneAcceso());
                            $ok = $sin->filter(fn ($r) => Accesos::enviar($r->participante))->count();
                            Notification::make()->title("Se enviaron {$ok} de {$sin->count()} accesos")
                                ->{$ok === $sin->count() ? 'success' : 'warning'}()->send();
                        }),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListInscripcions::route('/'),
            'create' => CreateInscripcion::route('/create'),
            'edit' => EditInscripcion::route('/{record}/edit'),
        ];
    }
}
