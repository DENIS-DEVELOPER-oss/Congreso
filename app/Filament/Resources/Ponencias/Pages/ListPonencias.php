<?php

namespace App\Filament\Resources\Ponencias\Pages;

use App\Filament\Resources\Ponencias\PonenciaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPonencias extends ListRecords
{
    protected static string $resource = PonenciaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
