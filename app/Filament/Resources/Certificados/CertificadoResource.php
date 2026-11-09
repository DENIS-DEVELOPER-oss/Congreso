<?php

namespace App\Filament\Resources\Certificados;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\Certificados\Pages\CreateCertificado;
use App\Filament\Resources\Certificados\Pages\EditCertificado;
use App\Filament\Resources\Certificados\Pages\ListCertificados;
use App\Models\Certificado;
use App\Models\Participante;
use App\Support\Certificacion;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use UnitEnum;

class CertificadoResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = Certificado::class;

    protected static ?string $modelLabel = 'certificado';

    protected static ?string $pluralModelLabel = 'certificados';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static string|UnitEnum|null $navigationGroup = 'Certificación';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Certificado')
                ->description('Para asistentes y ponentes usa los botones de emisión masiva. Aquí se emiten a mano los de organizadores, comité u otros casos.')
                ->columns(3)
                ->schema([
                    Select::make('participante_id')->label('Participante')->required()->columnSpanFull()
                        ->relationship('participante', 'nombres')
                        ->getOptionLabelFromRecordUsing(fn (Participante $p) => "{$p->nombre_completo} · {$p->documento}")
                        ->searchable(['nombres', 'apellidos', 'documento'])
                        ->preload(false),
                    Select::make('tipo')->options(Certificado::TIPOS)->required()->live()
                        ->afterStateUpdated(fn (Set $set, $state) => $set('horas', config("congreso.horas.$state"))),
                    TextInput::make('horas')->label('Horas académicas')->numeric()->required()->minValue(1),
                    FileUpload::make('archivo_pdf')->label('PDF propio (opcional)')
                        ->helperText('Déjalo vacío para usar la plantilla automática con el nombre del participante.')
                        ->disk('local')->directory('certificados')->visibility('private')
                        ->acceptedFileTypes(['application/pdf'])->maxSize(5120),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('emitido_en', 'desc')
            ->columns([
                TextColumn::make('participante.nombre_completo')->label('Participante')
                    ->description(fn (Certificado $c) => $c->participante->documento)
                    ->searchable(query: fn (Builder $query, string $search) => $query->whereHas('participante', fn ($p) => $p
                        ->where('nombres', 'like', "%{$search}%")
                        ->orWhere('apellidos', 'like', "%{$search}%")
                        ->orWhere('documento', 'like', "%{$search}%"))),
                TextColumn::make('tipo')->badge()
                    ->formatStateUsing(fn ($state) => Certificado::TIPOS[$state] ?? $state)
                    ->color(fn ($state) => $state === 'ponente' ? 'info' : 'gray'),
                TextColumn::make('horas')->alignCenter(),
                TextColumn::make('codigo_verificacion')->label('Código')->searchable()->copyable()->fontFamily('mono'),
                TextColumn::make('enviado_en')->label('Correo')->badge()
                    ->state(fn (Certificado $c) => $c->enviado_en ? 'Enviado' : 'Sin enviar')
                    ->color(fn (Certificado $c) => $c->enviado_en ? 'success' : 'warning')
                    ->tooltip(fn (Certificado $c) => $c->enviado_en?->format('d/m/Y H:i')),
                TextColumn::make('emitido_en')->label('Emitido')->date('d/m/Y')->sortable(),
            ])
            ->filters([
                SelectFilter::make('tipo')->options(Certificado::TIPOS),
                TernaryFilter::make('enviado_en')->label('Correo')->nullable()
                    ->trueLabel('Enviados')->falseLabel('Sin enviar'),
            ])
            ->recordActions([
                Action::make('descargar')->label('PDF')->icon(Heroicon::OutlinedDocumentArrowDown)->color('gray')
                    ->url(fn (Certificado $record) => $record->url())->openUrlInNewTab(),
                Action::make('enviar')->label(fn (Certificado $record) => $record->enviado_en ? 'Reenviar' : 'Enviar')
                    ->icon(Heroicon::OutlinedEnvelope)
                    ->requiresConfirmation()
                    ->modalDescription(fn (Certificado $record) => "Se enviará el enlace de descarga a {$record->participante->correo}.")
                    ->action(fn (Certificado $record) => Certificacion::enviar($record)
                        ? Notification::make()->title('Certificado enviado')->success()->send()
                        : Notification::make()->title('No se pudo enviar el correo')->body('Revisa la configuración de correo del servidor.')->danger()->send()),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('enviarVarios')->label('Enviar por correo')->icon(Heroicon::OutlinedEnvelope)
                        ->requiresConfirmation()
                        ->action(function (Collection $records) {
                            $ok = $records->filter(fn ($c) => Certificacion::enviar($c))->count();
                            Notification::make()->title("Se enviaron {$ok} de {$records->count()} certificados")
                                ->{$ok === $records->count() ? 'success' : 'warning'}()->send();
                        }),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCertificados::route('/'),
            'create' => CreateCertificado::route('/create'),
            'edit' => EditCertificado::route('/{record}/edit'),
        ];
    }
}
