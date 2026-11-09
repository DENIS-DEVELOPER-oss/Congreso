<?php

namespace App\Filament\Resources\Inscripcions\Pages;

use App\Filament\Resources\Inscripcions\InscripcionResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditInscripcion extends EditRecord
{
    protected static string $resource = InscripcionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('voucher')->label('Ver voucher')->icon(Heroicon::OutlinedPhoto)->color('gray')
                ->visible(fn () => filled($this->record->voucher))
                ->url(fn () => route('archivos.voucher', $this->record))
                ->openUrlInNewTab(),
            DeleteAction::make(),
        ];
    }

    // Si se cambió el estado desde el formulario, se registra quién lo hizo y se avisa al participante
    protected function afterSave(): void
    {
        if ($this->record->wasChanged('estado')) {
            InscripcionResource::cambiarEstado($this->record, $this->record->estado, $this->record->observacion);
        }
    }
}
