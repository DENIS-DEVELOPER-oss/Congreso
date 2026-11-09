<x-filament-panels::page>
    <form wire:submit="guardar">
        {{ $this->form }}

        <div style="margin-top: 1.5rem">
            <x-filament::button type="submit" icon="heroicon-o-check" size="lg">
                Guardar cambios
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
