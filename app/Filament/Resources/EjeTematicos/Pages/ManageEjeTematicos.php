<?php

namespace App\Filament\Resources\EjeTematicos\Pages;

use App\Filament\Resources\EjeTematicos\EjeTematicoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageEjeTematicos extends ManageRecords
{
    protected static string $resource = EjeTematicoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
