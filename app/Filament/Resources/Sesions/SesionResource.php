<?php

namespace App\Filament\Resources\Sesions;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\Sesions\Pages\ManageSesions;
use App\Models\Sesion;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

// Sesiones del congreso virtual: forman el programa del Aula y del correo de acceso, y en ellas se toma asistencia
// (el % para el certificado se calcula sobre estas sesiones)
class SesionResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = Sesion::class;

    protected static ?string $slug = 'sesiones';

    protected static ?string $modelLabel = 'sesión';

    protected static ?string $pluralModelLabel = 'sesiones';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static string|UnitEnum|null $navigationGroup = 'Asistencia';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('nombre')->label('Nombre corto')->required()->maxLength(60)->placeholder('Día 1 – mañana'),
            DatePicker::make('fecha')->required()->native(false)->displayFormat('d/m/Y'),
            TextInput::make('titulo')->label('Tema de la sesión')->maxLength(200)->columnSpanFull(),
            TextInput::make('ponente')->label('Ponente o responsable')->maxLength(200)->columnSpanFull(),
            TimePicker::make('hora_inicio')->label('Hora de inicio (Perú)')->seconds(false),
            TimePicker::make('hora_fin')->label('Hora de fin (Perú)')->seconds(false),
            TextInput::make('enlace')->label('Enlace de Google Meet')->url()->maxLength(500)->placeholder('https://meet.google.com/abc-defg-hij')->columnSpanFull(),
            TextInput::make('material')->label('Material (opcional)')->url()->maxLength(500)
                ->helperText('Enlace a diapositivas o lecturas (Drive, OneDrive…).')->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('fecha')
            ->columns([
                TextColumn::make('nombre')->description(fn (Sesion $s) => $s->titulo),
                TextColumn::make('fecha')->date('l d/m/Y')->description(fn (Sesion $s) => $s->horarioTexto()),
                TextColumn::make('enlace')->label('Meet')->badge()
                    ->state(fn (Sesion $s) => $s->enlace ? 'Listo' : 'Falta')
                    ->color(fn (Sesion $s) => $s->enlace ? 'success' : 'warning'),
                TextColumn::make('asistencias_count')->label('Asistentes')->counts('asistencias')->alignCenter()->badge(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSesions::route('/'),
        ];
    }
}
