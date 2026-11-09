<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarInscripcion;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Support\Accesos;
use App\Support\Ajustes;
use App\Support\Turnstile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InscripcionController extends Controller
{
    // POST /api/inscripciones → { codigo }
    // Registro público: datos personales y categoría. El monto queda guardado según la tarifa vigente
    // y en el momento se envía el correo de acceso al Aula virtual (usuario, contraseña temporal, programa y pago).
    public function store(GuardarInscripcion $request): JsonResponse
    {
        // Campo trampa: un humano no lo ve; si llega lleno es un bot y se simula éxito
        if ($request->filled('sitio_web')) {
            return response()->json(['codigo' => null], 201);
        }
        Turnstile::verificar($request->input('cf_turnstile_response'), $request->ip());

        $d = $request->validated();
        $documento = strtoupper(trim($d['documento']));

        if (Participante::where('documento', $documento)->whereHas('inscripcion')->exists()) {
            throw ValidationException::withMessages([
                'documento' => 'Ya existe un registro con este DNI o pasaporte. Si necesitas corregir algún dato, escríbenos.',
            ]);
        }

        $inscripcion = DB::transaction(function () use ($d, $documento) {
            $participante = Participante::updateOrCreate(['documento' => $documento], [
                'nombres' => trim($d['nombres']),
                'apellidos' => trim($d['apellidos']),
                'correo' => strtolower(trim($d['correo'])),
                'telefono' => trim($d['telefono']),
                'institucion' => filled($d['institucion'] ?? null) ? trim($d['institucion']) : null,
            ]);

            $gratuita = Ajustes::gratuita();

            return $participante->inscripcion()->create([
                'tipo_participante' => $d['tipo_participante'],
                'monto' => $gratuita ? 0 : Inscripcion::montoPara($d['tipo_participante']),
                'acepta_privacidad' => true,
                // Inscripción gratuita: queda confirmada al instante (no hay pago que revisar)
                'estado' => $gratuita ? 'validada' : 'pendiente',
                'validado_en' => $gratuita ? now() : null,
            ]);
        });

        $inscripcion->refresh()->load('participante');
        Accesos::enviar($inscripcion->participante);

        return response()->json(['codigo' => $inscripcion->codigo], 201);
    }
}
