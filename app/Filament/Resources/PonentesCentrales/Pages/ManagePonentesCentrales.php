<?php

namespace App\Filament\Resources\PonentesCentrales\Pages;

use App\Filament\Resources\PonentesCentrales\PonenteCentralResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManagePonentesCentrales extends ManageRecords
{
    protected static string $resource = PonenteCentralResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Agregar ponente'),
        ];
    }
}
