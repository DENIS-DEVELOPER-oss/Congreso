<?php

namespace App\Filament\Resources\EjeTematicos;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\EjeTematicos\Pages\ManageEjeTematicos;
use App\Models\EjeTematico;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

// Ejes temáticos: se muestran en la página y en el formulario de envío de resúmenes
class EjeTematicoResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = EjeTematico::class;

    protected static ?string $slug = 'ejes-tematicos';

    protected static ?string $modelLabel = 'eje temático';

    protected static ?string $pluralModelLabel = 'ejes temáticos';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Académico';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('titulo')->label('Título')->required()->maxLength(255)->columnSpanFull(),
            Textarea::make('descripcion')->label('Descripción')->rows(3)->columnSpanFull(),
            TextInput::make('orden')->numeric()->default(0)->helperText('Los ejes se muestran de menor a mayor.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('orden')
            ->reorderable('orden')
            ->columns([
                TextColumn::make('orden')->label('#')->width('3rem'),
                TextColumn::make('titulo')->label('Título')->searchable()->wrap(),
                TextColumn::make('ponencias_count')->label('Ponencias')->counts('ponencias')->alignCenter(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageEjeTematicos::route('/'),
        ];
    }
}
