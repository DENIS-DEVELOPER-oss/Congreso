<?php

namespace App\Support;

use App\Mail\SolicitudRecibida;
use App\Models\Inscripcion;
use App\Models\Ponencia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

// Avisa a la comisión organizadora de cada nueva inscripción: por correo (con el resumen adjunto si es ponente)
// y por WhatsApp. Ninguno interrumpe la inscripción si falla: queda registrado en el log.
class Avisos
{
    public static function correoDestino(): ?string
    {
        return config('congreso.aviso_correo') ?: config('congreso.correo_contacto');
    }

    public static function whatsappActivo(): bool
    {
        return filled(config('congreso.aviso_whatsapp')) && filled(config('congreso.aviso_whatsapp_clave'));
    }

    // Devuelve qué avisos salieron bien: ['correo' => bool, 'whatsapp' => bool|null] (null: WhatsApp sin configurar)
    public static function nuevaInscripcion(Inscripcion $inscripcion, ?Ponencia $ponencia = null): array
    {
        $inscripcion->loadMissing('participante');
        $ponencia?->loadMissing('eje');

        $destino = self::correoDestino();

        return [
            'correo' => $destino ? Correo::enviar($destino, new SolicitudRecibida($inscripcion, $ponencia)) : false,
            'whatsapp' => self::whatsappActivo() ? self::whatsapp(self::textoInscripcion($inscripcion, $ponencia)) : null,
        ];
    }

    public static function textoInscripcion(Inscripcion $inscripcion, ?Ponencia $ponencia = null): string
    {
        $p = $inscripcion->participante;
        $categoria = config("congreso.tarifas.{$inscripcion->tipo_participante}.nombre", $inscripcion->tipo_participante);
        $lineas = [
            '*Nueva inscripción* · '.config('congreso.nombre_corto'),
            "{$inscripcion->codigo} · {$categoria}".($inscripcion->estado === 'pendiente' ? ' · por confirmar' : ''),
            "{$p->nombres} {$p->apellidos} (DNI {$p->documento})",
            "Cel. {$p->telefono} · {$p->correo}",
        ];
        if ($p->institucion) {
            $lineas[] = $p->institucion;
        }
        if ($ponencia) {
            $lineas[] = "Resumen {$ponencia->codigo} · Eje {$ponencia->eje?->orden}: {$ponencia->titulo}";
        }
        $lineas[] = 'Panel: '.url('/admin');

        return implode("\n", $lineas);
    }

    // Envía un WhatsApp al número de avisos mediante CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/)
    public static function whatsapp(string $texto): bool
    {
        if (! self::whatsappActivo()) {
            return false;
        }

        try {
            $respuesta = Http::timeout(15)->get('https://api.callmebot.com/whatsapp.php', [
                'phone' => '+'.preg_replace('/\D/', '', (string) config('congreso.aviso_whatsapp')),
                'text' => $texto,
                'apikey' => config('congreso.aviso_whatsapp_clave'),
            ]);
            // CallMeBot responde 200 incluso con errores: el motivo viene en el texto
            $ok = $respuesta->successful() && ! preg_match('/error|invalid|not (allowed|registered)|wrong/i', strip_tags($respuesta->body()));
            if (! $ok) {
                Log::warning('No se pudo enviar el aviso por WhatsApp: '.mb_substr(trim(strip_tags($respuesta->body())), 0, 300));
            }

            return $ok;
        } catch (Throwable $e) {
            Log::warning('No se pudo enviar el aviso por WhatsApp: '.$e->getMessage());

            return false;
        }
    }
}
