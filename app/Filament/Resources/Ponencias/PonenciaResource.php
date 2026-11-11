<?php

namespace App\Filament\Resources\Ponencias;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\Ponencias\Pages\EditPonencia;
use App\Filament\Resources\Ponencias\Pages\ListPonencias;
use App\Mail\ResultadoPonencia;
use App\Models\Ponencia;
use App\Support\Correo;
use BackedEnum;
use Filament\Actions\Action;
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
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class PonenciaResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = Ponencia::class;

    protected static ?string $modelLabel = 'ponencia';

    protected static ?string $pluralModelLabel = 'ponencias';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Académico';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getNavigationBadge(): ?string
    {
        $n = Ponencia::where('estado', 'recibida')->count();

        return $n ? (string) $n : null;
    }

    public static function colorEstado(?string $estado): string
    {
        return match ($estado) {
            'aceptada' => 'success',
            'recibida' => 'info',
            'observada' => 'warning',
            'rechazada' => 'danger',
            default => 'gray',
        };
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Autor')
                ->columns(3)
                ->schema([
                    TextEntry::make('codigo')->label('Código'),
                    TextEntry::make('autor.nombre_completo')->label('Autor principal'),
                    TextEntry::make('autor.correo')->label('Correo'),
                    TextEntry::make('autor.institucion')->label('Institución'),
                    TextEntry::make('coautores')->placeholder('Sin coautores')->columnSpan(2),
                ]),
            Section::make('Trabajo')
                ->columns(2)
                ->schema([
                    TextInput::make('titulo')->label('Título')->required()->maxLength(200)->columnSpanFull(),
                    Select::make('eje_id')->label('Eje temático')->relationship('eje', 'titulo')->required(),
                    Select::make('modalidad')->options(config('congreso.modalidades'))->required(),
                    TextInput::make('palabras_clave')->label('Palabras clave')->columnSpanFull(),
                ]),
            Section::make('Dictamen')
                ->columns(2)
                ->schema([
                    Select::make('estado')->options(Ponencia::ESTADOS)->required(),
                    Textarea::make('observacion')->label('Comentario del comité')->rows(2),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('codigo')->label('Código')->searchable()->weight('bold'),
                TextColumn::make('titulo')->label('Título')->searchable()->limit(55)->wrap()
                    ->tooltip(fn (Ponencia $r) => $r->titulo),
                TextColumn::make('autor.nombre_completo')->label('Autor')
                    ->searchable(query: fn (Builder $query, string $search) => $query->whereHas('autor', fn ($a) => $a
                        ->where('nombres', 'like', "%{$search}%")->orWhere('apellidos', 'like', "%{$search}%")))
                    ->description(fn (Ponencia $r) => $r->autor->institucion),
                TextColumn::make('eje.titulo')->label('Eje')->limit(25)->toggleable(),
                TextColumn::make('modalidad')->formatStateUsing(fn ($state) => config("congreso.modalidades.$state", $state)),
                TextColumn::make('estado')->badge()
                    ->formatStateUsing(fn ($state) => Ponencia::ESTADOS[$state] ?? $state)
                    ->color(fn ($state) => self::colorEstado($state)),
                TextColumn::make('created_at')->label('Recibida')->since()->sortable(),
            ])
            ->filters([
                SelectFilter::make('estado')->options(Ponencia::ESTADOS),
                SelectFilter::make('eje_id')->label('Eje temático')->relationship('eje', 'titulo'),
                SelectFilter::make('modalidad')->options(config('congreso.modalidades')),
            ])
            ->recordActions([
                Action::make('archivo')->label('Resumen')->icon(Heroicon::OutlinedArrowDownTray)->color('gray')
                    ->url(fn (Ponencia $record) => route('archivos.ponencia', $record)),
                Action::make('dictamen')->label('Dictaminar')->icon(Heroicon::OutlinedScale)
                    ->modalHeading(fn (Ponencia $record) => "Dictaminar {$record->codigo}")
                    ->modalDescription('El autor recibirá un correo con el resultado y el comentario.')
                    ->fillForm(fn (Ponencia $record) => [
                        'estado' => $record->estado === 'recibida' ? null : $record->estado,
                        'observacion' => $record->observacion,
                    ])
                    ->schema([
                        Select::make('estado')->label('Resultado')->required()->live()
                            ->options(['aceptada' => 'Aceptada', 'observada' => 'Observada (debe corregir)', 'rechazada' => 'Rechazada']),
                        Textarea::make('observacion')->label('Comentario para el autor')->rows(4)
                            ->required(fn (Get $get) => in_array($get('estado'), ['observada', 'rechazada']))
                            ->helperText(fn (Get $get) => $get('estado') === 'observada' ? 'Indica qué debe corregir: lo verá en el correo y en el Aula.' : null),
                    ])
                    ->action(function (Ponencia $record, array $data) {
                        $record->update($data);
                        $enviado = Correo::enviar($record->autor->correo, new ResultadoPonencia($record->load('autor')));
                        Notification::make()->title("{$record->codigo}: ".Ponencia::ESTADOS[$data['estado']])
                            ->body($enviado ? 'Se envió el resultado al autor.' : 'Se guardó, pero no se pudo enviar el correo.')
                            ->{$enviado ? 'success' : 'warning'}()->send();
                    }),
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
            'index' => ListPonencias::route('/'),
            'edit' => EditPonencia::route('/{record}/edit'),
        ];
    }
}
