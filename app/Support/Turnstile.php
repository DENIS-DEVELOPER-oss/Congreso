<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

// Verificación anti-bots de Cloudflare Turnstile. Si no hay clave secreta configurada, no se exige.
class Turnstile
{
    public static function verificar(?string $token, ?string $ip): void
    {
        $secreto = config('congreso.turnstile_secret');
        if (! $secreto) {
            return;
        }

        $ok = $token && rescue(fn () => Http::asForm()->timeout(8)
            ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $secreto,
                'response' => $token,
                'remoteip' => $ip,
            ])->json('success'), false);

        if (! $ok) {
            throw ValidationException::withMessages(['captcha' => 'No se pudo completar la verificación de seguridad. Inténtalo de nuevo.']);
        }
    }
}
