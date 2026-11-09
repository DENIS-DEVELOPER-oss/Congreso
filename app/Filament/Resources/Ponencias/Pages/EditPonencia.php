<?php

namespace App\Filament\Resources\Ponencias\Pages;

use App\Filament\Resources\Ponencias\PonenciaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPonencia extends EditRecord
{
    protected static string $resource = PonenciaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
