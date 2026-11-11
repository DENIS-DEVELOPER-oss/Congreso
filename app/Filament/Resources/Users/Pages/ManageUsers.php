<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use App\Mail\AccesoPanel;
use App\Models\User;
use App\Support\Correo;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ManageRecords;

class ManageUsers extends ManageRecords
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Nuevo usuario')
                ->modalHeading('Nuevo usuario del panel')
                ->successNotification(null)
                // Se crea aquí para enviar la contraseña tal como se escribió (en la base queda cifrada)
                ->using(function (array $data): User {
                    $enviar = (bool) ($data['enviar_acceso'] ?? false);
                    unset($data['enviar_acceso']);
                    $usuario = User::create($data);

                    $rol = $usuario->es_admin ? 'administrador' : 'organizador';
                    $enviado = $enviar && Correo::enviar($usuario->email, new AccesoPanel($usuario, $data['password']));
                    Notification::make()
                        ->title("{$usuario->name} ya es {$rol}")
                        ->body($enviar
                            ? ($enviado ? "Le enviamos sus datos de acceso a {$usuario->email}." : 'No se pudo enviar el correo: compártele sus datos tú mismo.')
                            : 'Compártele su correo y contraseña para que ingrese al panel.')
                        ->{$enviar && ! $enviado ? 'warning' : 'success'}()
                        ->send();

                    return $usuario;
                }),
        ];
    }
}
