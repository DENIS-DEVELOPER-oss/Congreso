<x-filament-panels::page>
    <form wire:submit="registrar">
        {{ $this->form }}

        <div style="margin-top: 1rem">
            <x-filament::button type="submit" icon="heroicon-o-check-circle" size="lg">
                Registrar
            </x-filament::button>
        </div>
    </form>

    {{ $this->table }}
</x-filament-panels::page>
