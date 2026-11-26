<?php

use App\Mail\RecordatorioAsistencia;
use App\Models\Inscripcion;
use App\Models\User;
use App\Support\Correo;
use App\Support\Recordatorios;
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

// Recordatorio de asistencia (fecha, ingreso desde las 8:00, registro de entrada y salida con DNI) a todos los inscritos.
// Envía de a uno con una pausa para respetar el límite del correo; si se corta, al repetirlo sigue con los que faltan.
//   php artisan congreso:recordatorio --prueba=tu@correo.com   → solo una muestra a ese correo
//   php artisan congreso:recordatorio                          → a todos los que aún no lo recibieron
//   php artisan congreso:recordatorio --dia=27                 → texto solo para el viernes 27
Artisan::command('congreso:recordatorio {--dia=ambos : ambos o 27} {--prueba= : correo que recibe solo una muestra}
    {--solo-confirmadas : no envía a las solicitudes aún pendientes} {--de-nuevo : vuelve a enviar a quienes ya lo recibieron}
    {--limite=0 : máximo de correos en esta tanda (0 = todos)} {--pausa=3 : segundos entre correo y correo}', function () {
    $dia = (string) $this->option('dia');
    if (! array_key_exists($dia, RecordatorioAsistencia::DIAS)) {
        $this->error('--dia debe ser «ambos» o «27».');

        return 1;
    }

    if ($prueba = $this->option('prueba')) {
        $muestra = Inscripcion::with('participante')->where('estado', '!=', 'anulada')->orderBy('id')->first();
        if (! $muestra) {
            $this->error('Aún no hay inscritos para armar la muestra.');

            return 1;
        }
        $ok = Correo::enviar($prueba, new RecordatorioAsistencia($muestra, $dia));
        $ok ? $this->info("Muestra enviada a {$prueba} (con los datos de {$muestra->participante->nombres} {$muestra->participante->apellidos}).")
            : $this->error('No se pudo enviar: revisa storage/logs/laravel.log y la configuración de correo.');

        return $ok ? 0 : 1;
    }

    $consulta = Recordatorios::pendientes((bool) $this->option('solo-confirmadas'), (bool) $this->option('de-nuevo'));
    $total = (clone $consulta)->count();
    $limite = (int) $this->option('limite');
    $aEnviar = $limite > 0 ? min($limite, $total) : $total;
    if ($aEnviar === 0) {
        $this->info('No hay inscritos pendientes de recibir el recordatorio.');

        return 0;
    }
    if (! $this->confirm("Se enviará el recordatorio a {$aEnviar} persona(s) (".RecordatorioAsistencia::DIAS[$dia].'). ¿Continuar?', true)) {
        return 0;
    }

    $pausa = max(0, (int) $this->option('pausa'));
    $enviados = 0;
    $fallidos = [];
    $barra = $this->output->createProgressBar($aEnviar);
    foreach ($consulta->limit($aEnviar)->get() as $i => $inscripcion) {
        if ($i > 0 && $pausa) {
            sleep($pausa);
        }
        if (Recordatorios::enviar($inscripcion, $dia)) {
            $enviados++;
        } else {
            $fallidos[] = "{$inscripcion->codigo} {$inscripcion->participante->correo}";
        }
        $barra->advance();
    }
    $barra->finish();
    $this->newLine(2);
    $this->info("Enviados: {$enviados} de {$aEnviar}.");
    if ($fallidos) {
        $this->warn('No se pudo enviar a: '.implode(', ', $fallidos).'. Vuelve a ejecutar el comando para reintentar solo esos.');
    }
    $faltan = $total - $aEnviar;
    if ($faltan > 0) {
        $this->line("Quedan {$faltan} por enviar: vuelve a ejecutar el comando.");
    }

    return $fallidos ? 1 : 0;
})->purpose('Enviar a los inscritos el recordatorio de asistencia');
