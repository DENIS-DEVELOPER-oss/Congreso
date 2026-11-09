<?php

use App\Models\EjeTematico;
use Illuminate\Support\Facades\Route;

// API pública de la página (mismo dominio, prefijo /api). El resto (pago, resúmenes, certificados) está en "Mi cuenta".
Route::get('/ejes', fn () => EjeTematico::orderBy('orden')->orderBy('id')->get(['id', 'titulo', 'descripcion', 'icono']));

// El registro (POST /api/inscripciones) está en routes/web.php: usa la sesión para saber si quien prueba es del panel
