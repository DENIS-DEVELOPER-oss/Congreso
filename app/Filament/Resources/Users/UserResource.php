<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\ManageUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

// Cuentas del panel. Solo el administrador las ve y crea organizadores u otros administradores.
class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $slug = 'usuarios';

    protected static ?string $modelLabel = 'usuario';

    protected static ?string $pluralModelLabel = 'usuarios';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static string|UnitEnum|null $navigationGroup = 'Configuración';

    public static function canViewAny(): bool
    {
        return (bool) auth()->user()?->es_admin;
    }

    // ¿Es el único administrador que queda? (no se le puede quitar el rol ni borrar)
    public static function esUltimoAdmin(User $user): bool
    {
        return $user->es_admin && User::where('es_admin', true)->count() <= 1;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('Nombre completo')->required()->maxLength(255),
            TextInput::make('email')->label('Correo')->email()->required()->unique(ignoreRecord: true)
                ->helperText('Con este correo inicia sesión en el panel.'),
            TextInput::make('password')->label('Contraseña')->password()->revealable()
                ->required(fn (string $operation) => $operation === 'create')
                ->dehydrated(fn ($state) => filled($state))
                ->minLength(8)
                ->default(fn () => Str::password(12, symbols: false))
                ->helperText(fn (string $operation) => $operation === 'edit'
                    ? 'Déjala vacía para no cambiarla.'
                    : 'Se propone una contraseña segura; puedes cambiarla. Pulsa el ojo para verla.'),
            Radio::make('es_admin')->label('Rol')
                ->options(['0' => 'Organizador', '1' => 'Administrador'])
                ->descriptions([
                    '0' => 'Ve inscritos, dictamina ponencias, registra asistencia y emite certificados. No borra registros ni crea usuarios.',
                    '1' => 'Todo lo anterior, y además borra registros, crea usuarios y cambia los datos del congreso.',
                ])
                ->default('0')
                ->formatStateUsing(fn ($state) => $state ? '1' : '0')
                ->required()
                // Nadie se quita a sí mismo el rol, y siempre debe quedar al menos un administrador
                ->disabled(fn (?User $record) => $record && ($record->is(auth()->user()) || self::esUltimoAdmin($record)))
                ->helperText(fn (?User $record) => $record?->is(auth()->user()) ? 'No puedes cambiar tu propio rol.' : null),
            Toggle::make('enviar_acceso')->label('Enviarle por correo sus datos de acceso al panel')
                ->default(true)
                ->visible(fn (string $operation) => $operation === 'create'),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at')
            ->columns([
                TextColumn::make('name')->label('Nombre')->searchable()->weight('bold')
                    ->description(fn (User $record) => $record->is(auth()->user()) ? 'Tú' : null),
                TextColumn::make('email')->label('Correo')->searchable()->copyable(),
                TextColumn::make('es_admin')->label('Rol')->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'Administrador' : 'Organizador')
                    ->color(fn (bool $state) => $state ? 'primary' : 'gray'),
                TextColumn::make('created_at')->label('Creado')->date('d/m/Y'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()
                    ->hidden(fn (User $record) => $record->is(auth()->user()) || self::esUltimoAdmin($record))
                    ->after(fn () => Notification::make()->title('Usuario eliminado')->success()->send()),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageUsers::route('/'),
        ];
    }
}
