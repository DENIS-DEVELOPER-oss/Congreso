<?php

namespace App\Http\Controllers;

use App\Http\Requests\GuardarPago;
use App\Http\Requests\GuardarPonencia;
use App\Mail\PonenciaRecibida;
use App\Models\Certificado;
use App\Models\EjeTematico;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Ponencia;
use App\Models\Sesion;
use App\Support\Accesos;
use App\Support\Ajustes;
use App\Support\Correo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

// Aula virtual del participante (página /aula). Rutas con sesión y protección CSRF: ver routes/web.php.
class CuentaController extends Controller
{
    private function participante(Request $request): Participante
    {
        return $request->user('participante');
    }

    // Busca al participante por DNI/pasaporte o por correo
    private function buscar(string $usuario): ?Participante
    {
        $usuario = trim($usuario);

        return str_contains($usuario, '@')
            ? Participante::whereRaw('LOWER(correo) = ?', [strtolower($usuario)])->first()
            : Participante::where('documento', strtoupper($usuario))->first();
    }

    // POST /cuenta/ingresar { usuario (DNI o correo), password }
    public function ingresar(Request $request): JsonResponse
    {
        $d = $request->validate([
            'usuario' => ['required', 'string', 'max:254'],
            'password' => ['required', 'string'],
        ], [
            'usuario.required' => 'Escribe tu DNI o tu correo.',
            'password.required' => 'Escribe tu contraseña.',
        ]);

        $p = $this->buscar($d['usuario']);
        if (! $p || ! $p->tieneAcceso() || ! Auth::guard('participante')->attempt(['id' => $p->id, 'password' => $d['password']], true)) {
            throw ValidationException::withMessages([
                'password' => 'El usuario o la contraseña no son correctos. Usa los datos que te enviamos por correo.',
            ]);
        }
        $request->session()->regenerate();

        // Entrar con la contraseña que llegó al correo demuestra que el correo es suyo
        if (! $p->correoConfirmado()) {
            $p->forceFill(['correo_verificado_en' => now()])->saveQuietly();
        }

        return $this->yo($request);
    }

    // POST /cuenta/salir
    public function salir(Request $request): JsonResponse
    {
        Auth::guard('participante')->logout();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }

    // POST /cuenta/recuperar { documento }: envía una contraseña nueva al correo registrado.
    // Responde lo mismo exista o no la cuenta, para no revelar qué DNI están registrados.
    public function recuperar(Request $request): JsonResponse
    {
        $d = $request->validate(['usuario' => ['required', 'string', 'max:254']], ['usuario.required' => 'Escribe tu DNI o tu correo.']);
        $participante = $this->buscar($d['usuario']);

        if ($participante?->tieneAcceso()) {
            Accesos::enviar($participante);
        }

        return response()->json([
            'mensaje' => 'Si tus datos están registrados, te enviamos una contraseña temporal nueva al correo con el que te registraste.',
        ]);
    }

    // GET /cuenta/yo: todo lo que muestra la página de la cuenta
    public function yo(Request $request): JsonResponse
    {
        $p = $this->participante($request)->load('inscripcion', 'ponencias.eje', 'certificados');
        $i = $p->inscripcion;
        $gratuita = Ajustes::gratuita();
        $pagoPendiente = ! $gratuita && $i && $i->estado !== 'validada';
        $verZoom = $gratuita || ($i && $i->estado === 'validada') || ! config('congreso.zoom_solo_con_pago');

        return response()->json([
            'inscripcionGratuita' => $gratuita,
            'participante' => [
                'nombres' => $p->nombres,
                'nombre' => $p->nombre_completo,
                'documento' => $p->documento,
                'correo' => $p->correo,
                'correoConfirmado' => $p->correoConfirmado(),
                'debeCambiarClave' => (bool) $p->debe_cambiar_clave,
            ],
            // Programa del aula; el enlace de Zoom solo si el pago está validado (o si la organización lo permite)
            'zoomBloqueado' => ! $verZoom,
            'sesiones' => Sesion::enOrden()->get()->map(fn (Sesion $s) => [
                'id' => $s->id,
                'fecha' => ucfirst($s->fechaTexto()),
                'dia' => $s->fecha->toDateString(),
                'horario' => $s->horarioTexto(),
                'titulo' => $s->titulo ?? $s->nombre,
                'ponente' => $s->ponente,
                'enlace' => $verZoom ? $s->enlace : null,
                'tieneEnlace' => filled($s->enlace),
                'material' => $verZoom ? $s->material : null,
            ]),
            'inscripcion' => $i ? [
                'codigo' => $i->codigo,
                'estado' => $i->estado,
                'estadoTexto' => Inscripcion::ESTADOS[$i->estado] ?? $i->estado,
                'categoria' => config("congreso.tarifas.{$i->tipo_participante}.nombre"),
                'monto' => (float) $i->monto,
                'medioPago' => $i->medio_pago,
                'numeroOperacion' => $i->numero_operacion,
                'tieneVoucher' => filled($i->voucher),
                'observacion' => $i->observacion,
            ] : null,
            // Los datos de pago solo se muestran dentro de la cuenta y mientras falte validar el pago
            'mediosPago' => $pagoPendiente ? array_values(config('congreso.medios_pago_detalle')) : [],
            'ponencias' => $p->ponencias->sortByDesc('created_at')->values()->map(fn (Ponencia $x) => [
                'codigo' => $x->codigo,
                'titulo' => $x->titulo,
                'eje' => $x->eje?->titulo,
                'modalidad' => config("congreso.modalidades.{$x->modalidad}"),
                'estado' => $x->estado,
                'estadoTexto' => Ponencia::ESTADOS[$x->estado] ?? $x->estado,
                'observacion' => $x->observacion,
                'fecha' => $x->created_at->format('d/m/Y'),
            ]),
            'certificados' => $p->certificados->map(fn (Certificado $c) => [
                'tipo' => 'Certificado de '.Str::lower(Certificado::TIPOS[$c->tipo] ?? $c->tipo),
                'horas' => $c->horas,
                'url' => $c->url(),
            ]),
            'ejes' => EjeTematico::orderBy('orden')->orderBy('id')->get(['id', 'titulo']),
        ]);
    }

    // POST /cuenta/pago (multipart): voucher, medio y número de operación
    public function pago(GuardarPago $request): JsonResponse
    {
        $i = $this->participante($request)->inscripcion;
        abort_unless($i, 404);
        if ($i->estado === 'validada') {
            throw ValidationException::withMessages(['voucher' => 'Tu pago ya fue validado: no necesitas subir otro voucher.']);
        }

        $anterior = $i->voucher;
        $i->update([
            'medio_pago' => $request->validated('medio_pago'),
            'numero_operacion' => trim($request->validated('numero_operacion')),
            'voucher' => $request->file('voucher')->store('vouchers'),
            'estado' => 'pendiente', // si estaba observada, vuelve a revisión
        ]);
        if ($anterior && $anterior !== $i->voucher) {
            Storage::delete($anterior);
        }

        return $this->yo($request);
    }

    // POST /cuenta/ponencias (multipart): resumen del participante que inició sesión
    public function ponencia(GuardarPonencia $request): JsonResponse
    {
        $p = $this->participante($request);
        $d = $request->validated();

        $ponencia = $p->ponencias()->create([
            'titulo' => trim($d['titulo']),
            'eje_id' => $d['eje'],
            'modalidad' => $d['modalidad'],
            'coautores' => $d['coautores'] ?? null,
            'palabras_clave' => trim($d['palabras_clave']),
            'archivo' => $request->file('archivo')->store('ponencias'),
        ]);
        $ponencia->refresh()->load('autor', 'eje');
        Correo::enviar($p->correo, new PonenciaRecibida($ponencia));

        return response()->json(['codigo' => $ponencia->codigo], 201);
    }

    // POST /cuenta/clave { actual, nueva, nueva_confirmation }
    public function clave(Request $request): JsonResponse
    {
        $p = $this->participante($request);
        $primera = (bool) $p->debe_cambiar_clave;
        $d = $request->validate([
            'actual' => [$primera ? 'nullable' : 'required', 'string'],
            'nueva' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'actual.required' => 'Escribe tu contraseña actual.',
            'nueva.required' => 'Escribe la contraseña nueva.',
            'nueva.min' => 'La contraseña nueva debe tener al menos 8 caracteres.',
            'nueva.confirmed' => 'Las dos contraseñas nuevas no coinciden.',
        ]);

        if (! $primera && ! Hash::check($d['actual'], $p->password)) {
            throw ValidationException::withMessages(['actual' => 'La contraseña actual no es correcta.']);
        }
        $p->forceFill(['password' => $d['nueva'], 'debe_cambiar_clave' => false])->save();

        return response()->json(['ok' => true]);
    }
}
