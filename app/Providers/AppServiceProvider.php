<?php

namespace App\Providers;

use App\Support\Ajustes;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Datos del congreso guardados desde el panel (tarifas, cuentas, contacto, fechas, firmantes…)
        Ajustes::aplicar();
    }
}
