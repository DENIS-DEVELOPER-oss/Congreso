<?php

use App\Http\Controllers\Api\InscripcionController;
use App\Http\Controllers\ArchivoController;
use App\Http\Controllers\CertificadoController;
use App\Http\Controllers\CorreoController;
use App\Http\Controllers\CuentaController;
use Illuminate\Support\Facades\Route;

// Páginas públicas (React). Cada una tiene su propio título y descripción para buscadores y redes.
$pagina = fn (string $pagina, string $entrada, string $titulo, string $descripcion, ?string $tituloSocial = null, ?string $descripcionSocial = null) => view('sitio', [
    'pagina' => $pagina,
    'entrada' => $entrada,
    'titulo' => $titulo,
    'descripcion' => $descripcion,
    'tituloSocial' => $tituloSocial ?? $titulo,
    'descripcionSocial' => $descripcionSocial ?? $descripcion,
    'url' => url()->current(),
]);

Route::get('/', fn () => $pagina(
    'inicio',
    'resources/js/main.jsx',
    'Congreso Saberes Andino-Amazónicos 2026 | Sociología UNA Puno',
    'I Congreso Internacional Saberes Andino-Amazónicos y Diálogo Intercultural en la Educación Superior Universitaria, 26 y 27 de noviembre de 2026 en Puno, Perú. Organiza la Escuela Profesional de Sociología de la Universidad Nacional del Altiplano. Convocatoria de ponencias e inscripciones abiertas.',
    'Congreso Saberes Andino-Amazónicos 2026 · Puno, Perú',
    'Formación universitaria con pertinencia intercultural e interepistémica. 26 y 27 de noviembre de 2026. ¡Inscripciones abiertas!',
));

Route::get('/inscripcion', fn () => $pagina(
    'inscripcion',
    'resources/js/paginas/inscripcion.jsx',
    'Inscripción | Congreso Saberes Andino-Amazónicos 2026',
    'Inscríbete al I Congreso Internacional Saberes Andino-Amazónicos (26 y 27 de noviembre de 2026, Puno): tarifas, medios de pago y formulario de inscripción.',
));

Route::get('/aula', fn () => $pagina(
    'cuenta',
    'resources/js/paginas/cuenta.jsx',
    'Aula virtual | Congreso Saberes Andino-Amazónicos 2026',
    'Ingresa al Aula virtual con tu DNI o correo para ver los enlaces de Google Meet, subir tu voucher, enviar tus resúmenes y descargar tus certificados.',
));

// Direcciones anteriores: todo está ahora en el Aula virtual
// Registro público (con sesión y CSRF). Límite de envíos por minuto y por IP, contra abusos
Route::middleware('throttle:10,1')->post('/api/inscripciones', [InscripcionController::class, 'store']);

Route::redirect('/mi-cuenta', '/aula', 301);
Route::redirect('/ponencias', '/aula', 301);
Route::redirect('/certificados', '/aula', 301);

// API del Aula virtual: usa la sesión del participante y la protección CSRF de las rutas web
Route::prefix('cuenta')->controller(CuentaController::class)->group(function () {
    Route::middleware('throttle:8,1')->group(function () {
        Route::post('/ingresar', 'ingresar');
        Route::post('/recuperar', 'recuperar');
    });
    Route::middleware(['auth:participante', 'throttle:30,1'])->group(function () {
        Route::get('/yo', 'yo');
        Route::post('/salir', 'salir');
        Route::post('/pago', 'pago');
        Route::post('/ponencias', 'ponencia');
        Route::post('/clave', 'clave');
    });
});

// Descarga pública del certificado con su código de verificación (el código sirve también para comprobar que es auténtico)
Route::get('/certificados/{codigo}', [CertificadoController::class, 'descargar'])
    ->where('codigo', '[A-Z0-9]{10}')
    ->name('certificados.descargar');

// Enlace del correo de constancia para confirmar la dirección (firmado: no se puede falsificar)
Route::get('/confirmar-correo/{participante}', [CorreoController::class, 'confirmar'])
    ->middleware('signed')
    ->name('correo.confirmar');

// Página pública de verificación (a ella lleva el QR impreso en el certificado)
Route::get('/verificar/{codigo}', [CertificadoController::class, 'verificar'])
    ->where('codigo', '[A-Za-z0-9]{10}')
    ->name('certificados.verificar');

// Vouchers y resúmenes: solo para organizadores con sesión iniciada en el panel
Route::middleware('auth')->group(function () {
    Route::get('/archivos/voucher/{inscripcion}', [ArchivoController::class, 'voucher'])->name('archivos.voucher');
    Route::get('/archivos/ponencia/{ponencia}', [ArchivoController::class, 'ponencia'])->name('archivos.ponencia');
});
