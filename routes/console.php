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

// Crea o actualiza una cuenta de organizador (ve inscritos, dictamina ponencias, registra asistencia y emite certificados;
// no borra registros ni crea usuarios): php artisan congreso:organizador --email= --nombre= --password=
Artisan::command('congreso:organizador {--email=} {--nombre=} {--password=}', function () {
    $email = strtolower(trim($this->option('email') ?: text('Correo del organizador', required: true)));
    $nombre = $this->option('nombre') ?: text('Nombre', required: true);
    $clave = $this->option('password') ?: password('Contraseña (mínimo 8 caracteres)', required: true, validate: fn ($v) => strlen($v) < 8 ? 'Usa al menos 8 caracteres.' : null);

    if (strlen($clave) < 8) {
        $this->error('La contraseña debe tener al menos 8 caracteres.');

        return 1;
    }
    // Si la cuenta ya existe y es la de un administrador, se respeta su rol
    $usuario = User::firstOrNew(['email' => $email]);
    $usuario->fill(['name' => $nombre, 'password' => $clave, 'es_admin' => $usuario->exists ? $usuario->es_admin : false])->save();

    $this->info("Listo: {$email} puede entrar a ".url('/admin').' como '.($usuario->es_admin ? 'administrador' : 'organizador').'.');
})->purpose('Crear o actualizar una cuenta de organizador del panel');
