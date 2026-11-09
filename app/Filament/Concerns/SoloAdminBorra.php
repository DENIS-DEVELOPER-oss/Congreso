<?php

namespace App\Filament\Concerns;

use Illuminate\Database\Eloquent\Model;

// Los organizadores pueden ver y editar; solo el administrador puede borrar registros
trait SoloAdminBorra
{
    public static function canDelete(Model $record): bool
    {
        return (bool) auth()->user()?->es_admin;
    }

    public static function canDeleteAny(): bool
    {
        return (bool) auth()->user()?->es_admin;
    }
}
