<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Throwable;

// Instalación desde el navegador para hostings sin terminal (Bluehost sin SSH): /api/instalar?clave=...
// Solo funciona si INSTALADOR_CLAVE está en el .env (12+ caracteres) y se bloquea sola al terminar.
// Va en las rutas "api" (sin sesión ni cookies cifradas) porque al principio todavía no existe APP_KEY.
class InstaladorController extends Controller
{
    private function bloqueo(): string
    {
        return storage_path('app/instalado.lock');
    }

    private function autorizar(Request $request): void
    {
        $clave = (string) env('INSTALADOR_CLAVE', '');
        abort_if(strlen($clave) < 12 || ! hash_equals($clave, (string) $request->input('clave')), 404);
    }

    // Comprobaciones previas que se muestran en la página
    private function revisar(): array
    {
        $r = [];
        $r[] = ['PHP 8.2 o superior', version_compare(PHP_VERSION, '8.2.0', '>='), 'Versión actual: '.PHP_VERSION];
        foreach (['pdo_mysql', 'mbstring', 'openssl', 'gd', 'intl', 'fileinfo', 'zip'] as $ext) {
            $r[] = ["Extensión $ext", extension_loaded($ext), extension_loaded($ext) ? 'Activa' : 'Falta: actívala en cPanel → Select PHP Version'];
        }
        foreach (['storage', 'bootstrap/cache'] as $dir) {
            $r[] = ["Escritura en $dir", is_writable(base_path($dir)), base_path($dir)];
        }
        $r[] = ['Escritura en .env', is_writable(base_path('.env')), is_file(base_path('.env')) ? base_path('.env') : 'No existe .env: renombra .env.produccion.example a .env'];
        $r[] = ['Escritura en la carpeta de fotos', is_writable(public_path('ponentes')), public_path('ponentes')];
        try {
            DB::connection()->getPdo();
            $r[] = ['Conexión a la base de datos', true, config('database.connections.mysql.database')];
        } catch (Throwable $e) {
            $r[] = ['Conexión a la base de datos', false, 'Revisa DB_DATABASE, DB_USERNAME y DB_PASSWORD en .env ('.Str::limit($e->getMessage(), 140).')'];
        }

        return $r;
    }

    private function vista(Request $request, bool $instalado, ?array $pasos = null, ?string $error = null): View
    {
        return view('instalador', [
            'clave' => $request->input('clave'),
            'instalado' => $instalado,
            'revision' => $this->revisar(),
            'pasos' => $pasos,
            'error' => $error,
            'email' => $request->input('email', 'axiomresearch322@gmail.com'),
            'nombre' => $request->input('nombre', 'Administrador'),
        ]);
    }

    public function mostrar(Request $request): View
    {
        $this->autorizar($request);

        return $this->vista($request, is_file($this->bloqueo()));
    }

    public function instalar(Request $request): View
    {
        $this->autorizar($request);
        $pasos = [];
        $instalado = is_file($this->bloqueo());

        if (! $instalado) {
            $validador = Validator::make($request->all(), [
                'email' => ['required', 'email'],
                'nombre' => ['required', 'string', 'max:100'],
                'password' => ['required', 'string', 'min:10', 'confirmed'],
            ], [
                'password.min' => 'La contraseña del panel debe tener al menos 10 caracteres.',
                'password.confirmed' => 'Las dos contraseñas no coinciden.',
            ]);
            // Sin sesión no hay redirección con errores: se vuelve a mostrar la página con el mensaje
            if ($validador->fails()) {
                return $this->vista($request, false, null, $validador->errors()->first());
            }
            $datos = $validador->validated();

            try {
                // 1. Clave de la aplicación (si el .env aún no la tiene)
                if (! config('app.key')) {
                    $key = 'base64:'.base64_encode(random_bytes(32));
                    $env = file_get_contents(base_path('.env'));
                    $env = preg_match('/^APP_KEY=.*$/m', $env)
                        ? preg_replace('/^APP_KEY=.*$/m', 'APP_KEY='.$key, $env)
                        : "APP_KEY=$key\n".$env;
                    file_put_contents(base_path('.env'), $env);
                    config(['app.key' => $key]);
                    $pasos[] = [true, 'Clave de la aplicación generada'];
                } else {
                    $pasos[] = [true, 'La clave de la aplicación ya existía'];
                }

                // 2. Tablas y datos iniciales (ejes, ponentes y sesiones)
                Artisan::call('migrate', ['--seed' => true, '--force' => true]);
                $pasos[] = [true, 'Tablas creadas y datos iniciales cargados'];

                // 3. Administrador del panel
                User::updateOrCreate(['email' => $datos['email']], [
                    'name' => $datos['nombre'], 'password' => $datos['password'], 'es_admin' => true,
                ]);
                $pasos[] = [true, "Administrador {$datos['email']} listo"];

                // 4. Cachés limpias
                Artisan::call('optimize:clear');
                $pasos[] = [true, 'Cachés limpiadas'];

                // 5. Correo de prueba (si falla, la instalación sigue: solo hay que revisar el .env)
                try {
                    Mail::raw('El sistema del congreso quedó instalado y puede enviar correos.', fn ($m) => $m
                        ->to($datos['email'])->subject('Prueba de correo del congreso'));
                    $pasos[] = [true, "Correo de prueba enviado a {$datos['email']} (revisa también spam)"];
                } catch (Throwable $e) {
                    $pasos[] = [false, 'No se pudo enviar el correo de prueba: revisa MAIL_PASSWORD en .env ('.Str::limit($e->getMessage(), 160).')'];
                }

                file_put_contents($this->bloqueo(), now()->toDateTimeString());
                $instalado = true;
            } catch (Throwable $e) {
                $pasos[] = [false, 'Error: '.Str::limit($e->getMessage(), 400)];
            }
        }

        return $this->vista($request, $instalado, $pasos);
    }

    // Después de cada actualización de archivos: aplica migraciones nuevas y limpia cachés
    public function actualizar(Request $request): View
    {
        $this->autorizar($request);
        $pasos = [];
        try {
            Artisan::call('migrate', ['--force' => true]);
            $pasos[] = [true, 'Base de datos actualizada'];
            Artisan::call('optimize:clear');
            $pasos[] = [true, 'Cachés limpiadas'];
        } catch (Throwable $e) {
            $pasos[] = [false, 'Error: '.Str::limit($e->getMessage(), 400)];
        }

        return $this->vista($request, is_file($this->bloqueo()), $pasos);
    }
}
