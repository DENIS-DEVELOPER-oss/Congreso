<?php

use App\Http\Controllers\InstaladorController;
use App\Models\EjeTematico;
use Illuminate\Support\Facades\Route;

// API pública de la página (mismo dominio, prefijo /api). El resto (pago, resúmenes, certificados) está en "Mi cuenta".
Route::get('/ejes', fn () => EjeTematico::orderBy('orden')->orderBy('id')->get(['id', 'titulo', 'descripcion', 'icono']));

// El registro (POST /api/inscripciones) está en routes/web.php: usa la sesión para saber si quien prueba es del panel

// Instalación desde el navegador (hosting sin terminal). Solo responde si INSTALADOR_CLAVE está en el .env.
Route::controller(InstaladorController::class)->prefix('instalar')->group(function () {
    Route::get('/', 'mostrar');
    Route::post('/', 'instalar');
    Route::post('/actualizar', 'actualizar');
});
