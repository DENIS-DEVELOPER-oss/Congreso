<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

// Crea (o convierte en administrador) una cuenta del panel: php artisan congreso:admin
Artisan::command('congreso:admin {--email=} {--nombre=} {--password=}', function () {
    $email = $this->option('email') ?: text('Correo del administrador', required: true);
    $nombre = $this->option('nombre') ?: text('Nombre', default: 'Administrador', required: true);
    $clave = $this->option('password') ?: password('Contraseña (mínimo 8 caracteres)', required: true, validate: fn ($v) => strlen($v) < 8 ? 'Usa al menos 8 caracteres.' : null);

    User::updateOrCreate(['email' => $email], ['name' => $nombre, 'password' => $clave, 'es_admin' => true]);
    $this->info("Listo: {$email} puede entrar a ".url('/admin').' como administrador.');
})->purpose('Crear la cuenta de administrador del panel');
