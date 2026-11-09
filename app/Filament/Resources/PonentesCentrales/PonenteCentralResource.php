<?php

namespace App\Filament\Resources\PonentesCentrales;

use App\Filament\Concerns\SoloAdminBorra;
use App\Filament\Resources\PonentesCentrales\Pages\ManagePonentesCentrales;
use App\Models\PonenteCentral;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use UnitEnum;

// Ponentes centrales: lo que se guarda aquí aparece al instante en la sección "Ponentes" de la página
class PonenteCentralResource extends Resource
{
    use SoloAdminBorra;

    protected static ?string $model = PonenteCentral::class;

    protected static ?string $slug = 'ponentes-centrales';

    protected static ?string $modelLabel = 'ponente central';

    protected static ?string $pluralModelLabel = 'ponentes centrales';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMicrophone;

    protected static string|UnitEnum|null $navigationGroup = 'Académico';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('nombre')->label('Nombre con grado')->placeholder('Dr. Nombre Apellido')->required()->maxLength(150),
            TextInput::make('pais')->label('País')->required()->default('Perú')->maxLength(60)
                ->datalist(['Perú', 'Argentina', 'México', 'Bolivia', 'Chile', 'Colombia', 'Ecuador', 'Brasil', 'España']),
            TextInput::make('institucion')->label('Institución')->maxLength(200)->columnSpanFull(),
            TextInput::make('ponencia')->label('Título de su conferencia')->maxLength(255)->columnSpanFull()
                ->helperText('Opcional. Se muestra en su perfil.'),
            Textarea::make('bio')->label('Reseña breve')->rows(3)->columnSpanFull(),
            FileUpload::make('foto')->label('Foto')
                ->disk('publico')->directory('ponentes')->visibility('public')
                ->image()->imageEditor()->imageAspectRatio('4:5')->maxSize(3072)
                ->helperText('Foto vertical (4:5), JPG o PNG de hasta 3 MB. Sin foto se muestran sus iniciales.')
                ->columnSpanFull(),
            Toggle::make('magistral')->label('Conferencista magistral'),
            Toggle::make('visible')->label('Mostrar en la página')->default(true),
            TextInput::make('orden')->numeric()->default(0)->helperText('Se muestran de menor a mayor.'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('orden')
            ->reorderable('orden')
            ->columns([
                ImageColumn::make('foto')->disk('publico')->circular()->label(''),
                TextColumn::make('nombre')->searchable()->weight('bold')
                    ->description(fn (PonenteCentral $record) => $record->institucion),
                TextColumn::make('pais')->label('País')->badge(),
                ToggleColumn::make('visible')->label('En la página'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePonentesCentrales::route('/'),
        ];
    }
}
