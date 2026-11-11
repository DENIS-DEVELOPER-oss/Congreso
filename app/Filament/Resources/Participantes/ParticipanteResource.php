<?php

namespace App\Filament\Resources\Participantes;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Filament\Resources\Participantes\Pages\EditParticipante;
use App\Filament\Resources\Participantes\Pages\ListParticipantes;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Support\Accesos;
use App\Support\Correo;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use UnitEnum;

// Datos personales: aquí se corrigen nombres y correos antes de emitir los certificados
class ParticipanteResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = Participante::class;

    protected static ?string $modelLabel = 'participante';

    protected static ?string $pluralModelLabel = 'participantes';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|UnitEnum|null $navigationGroup = 'Participantes';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'documento';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Datos personales')
                ->description('El nombre se imprime tal cual en el certificado: revisa tildes y mayúsculas.')
                ->columns(2)
                ->schema([
                    TextInput::make('nombres')->required()->maxLength(100),
                    TextInput::make('apellidos')->maxLength(100),
                    TextInput::make('documento')->label('DNI / Pasaporte')->required()->maxLength(12)->unique(ignoreRecord: true),
                    TextInput::make('correo')->email()->required()->maxLength(254),
                    TextInput::make('telefono')->label('Celular')->tel()->maxLength(20),
                    TextInput::make('institucion')->label('Institución')->maxLength(200),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('documento')->label('DNI / Pasaporte')->searchable()->copyable(),
                TextColumn::make('nombres')->searchable()->sortable(),
                TextColumn::make('apellidos')->searchable()->sortable(),
                TextColumn::make('correo')->searchable()->copyable()->toggleable(),
                IconColumn::make('correo_verificado_en')->label('Confirmado')->alignCenter()
                    ->state(fn (Participante $p) => $p->correoConfirmado())->boolean()
                    ->tooltip(fn (Participante $p) => $p->correo_verificado_en?->format('d/m/Y H:i') ?? 'Aún no confirma su correo'),
                TextColumn::make('acceso')->label('Aula')->badge()
                    ->state(fn (Participante $p) => $p->tieneAcceso() ? 'Enviado' : 'Sin enviar')
                    ->color(fn (Participante $p) => $p->tieneAcceso() ? 'success' : 'gray'),
                TextColumn::make('telefono')->label('Celular')->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('institucion')->label('Institución')->searchable()->limit(30)->toggleable(),
                TextColumn::make('inscripcion.estado')->label('Inscripción')->badge()
                    ->formatStateUsing(fn ($state) => Inscripcion::ESTADOS[$state] ?? $state)
                    ->color(fn ($state) => InscripcionResource::colorEstado($state))
                    ->placeholder('Sin inscripción'),
                TextColumn::make('ponencias_count')->label('Ponencias')->counts('ponencias')->alignCenter(),
            ])
            ->filters([
                TernaryFilter::make('correo_verificado_en')->label('Correo confirmado')->nullable()
                    ->trueLabel('Confirmado')->falseLabel('Sin confirmar'),
            ])
            ->recordActions([
                Action::make('enviarAcceso')->label(fn (Participante $record) => $record->tieneAcceso() ? 'Reenviar acceso' : 'Enviar acceso')
                    ->icon(Heroicon::OutlinedKey)
                    ->requiresConfirmation()
                    ->modalDescription(fn (Participante $record) => "Se enviará a {$record->correo} su usuario ({$record->documento}) y una contraseña nueva."
                        .($record->tieneAcceso() ? ' La contraseña anterior dejará de funcionar.' : ''))
                    ->action(fn (Participante $record) => Accesos::enviar($record)
                        ? Notification::make()->title('Acceso enviado')->success()->send()
                        : Notification::make()->title('No se pudo enviar el correo')->danger()->send()),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListParticipantes::route('/'),
            'edit' => EditParticipante::route('/{record}/edit'),
        ];
    }
}
