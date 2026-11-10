<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Carpeta de la aplicación. En Bluehost sin terminal, esta carpeta pública se copia a public_html
// y la aplicación queda al lado, en ../congreso; en los demás casos está en la carpeta superior.
$base = is_file(__DIR__.'/../congreso/artisan') ? __DIR__.'/../congreso' : __DIR__.'/..';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $base.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $base.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $base.'/bootstrap/app.php';

// Las fotos subidas, los afiches y el diseño compilado se sirven desde esta misma carpeta
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());
