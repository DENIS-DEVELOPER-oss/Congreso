<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarSolicitud;
use App\Mail\InscripcionRecibida;
use App\Models\EjeTematico;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Support\Ajustes;
use App\Support\Avisos;
use App\Support\Correo;
use App\Support\Turnstile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use function Illuminate\Support\defer;

class SolicitudController extends Controller
{
    // POST /api/solicitudes → { codigo, ponencia }
    // Mientras las inscripciones en línea están cerradas: la solicitud queda «pendiente» en el panel (Inscripciones)
    // hasta que la comisión la confirme y envíe el acceso. Al ponente se le guarda además su resumen (Ponencias).
    // La comisión recibe el aviso por correo (con el resumen adjunto) y por WhatsApp.
    public function store(GuardarSolicitud $request): JsonResponse
    {
        // Campo trampa: un humano no lo ve; si llega lleno es un bot y se simula éxito
        if ($request->filled('sitio_web')) {
            return response()->json(['codigo' => null, 'ponencia' => null], 201);
        }
        Turnstile::verificar($request->input('cf_turnstile_response'), $request->ip());

        $d = $request->validated();
        $documento = strtoupper(trim($d['documento']));
        $ponente = $d['tipo'] === 'ponente';

        if (Participante::where('documento', $documento)->whereHas('inscripcion')->exists()) {
            throw ValidationException::withMessages([
                'documento' => $ponente
                    ? 'Ya estás inscrito con este DNI. Envía tu resumen desde el Aula virtual o escríbenos.'
                    : 'Ya existe una inscripción con este DNI o pasaporte. Si necesitas corregir algún dato, escríbenos.',
            ]);
        }

        [$inscripcion, $ponencia] = DB::transaction(function () use ($d, $documento, $ponente, $request) {
            $participante = Participante::updateOrCreate(['documento' => $documento], [
                'nombres' => trim(preg_replace('/\s+/', ' ', $d['nombres'])),
                'apellidos' => trim(preg_replace('/\s+/', ' ', $d['apellidos'])),
                'correo' => strtolower(trim($d['correo'])),
                'telefono' => trim($d['telefono']),
                'institucion' => filled($d['institucion'] ?? null) ? trim($d['institucion']) : null,
            ]);

            $tipo = $ponente ? 'ponente' : $d['tipo_participante'];
            $inscripcion = $participante->inscripcion()->create([
                'tipo_participante' => $tipo,
                'monto' => Ajustes::gratuita() ? 0 : Inscripcion::montoPara($tipo),
                'acepta_privacidad' => true,
                'estado' => 'pendiente',
            ]);

            $ponencia = $ponente ? $participante->ponencias()->create([
                'titulo' => trim($d['titulo']),
                'eje_id' => EjeTematico::where('orden', $d['eje'])->value('id'),
                'modalidad' => 'presencial',
                'coautores' => filled($d['coautores'] ?? null) ? trim($d['coautores']) : null,
                'palabras_clave' => trim($d['palabras_clave']),
                'archivo' => $request->file('archivo')->store('ponencias'),
            ]) : null;

            return [$inscripcion, $ponencia];
        });

        $inscripcion->refresh()->load('participante');
        $ponencia?->refresh()->load('autor', 'eje');

        // Los correos salen después de responder: la persona no espera al servidor de correo
        // Primero la constancia a la persona inscrita (con el número para consultas), luego el aviso a la comisión
        defer(function () use ($inscripcion, $ponencia) {
            Correo::enviar($inscripcion->participante->correo, new InscripcionRecibida($inscripcion, $ponencia));
            Avisos::nuevaInscripcion($inscripcion, $ponencia);
        });

        return response()->json(['codigo' => $inscripcion->codigo, 'ponencia' => $ponencia?->codigo], 201);
    }
}
