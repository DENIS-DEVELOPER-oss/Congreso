<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Certificado extends Model
{
    public const TIPOS = [
        'asistente' => 'Asistente',
        'ponente' => 'Ponente',
        'organizador' => 'Organizador',
        'comite' => 'Comité',
    ];

    protected $fillable = ['participante_id', 'tipo', 'horas', 'archivo_pdf', 'emitido_en', 'enviado_en'];

    protected function casts(): array
    {
        return [
            'emitido_en' => 'datetime',
            'enviado_en' => 'datetime',
        ];
    }

    // Código de verificación aleatorio de 10 caracteres: también es la dirección de descarga
    protected static function booted(): void
    {
        static::creating(function (Certificado $c) {
            do {
                $codigo = Str::upper(Str::random(10));
            } while (self::where('codigo_verificacion', $codigo)->exists());
            $c->codigo_verificacion = $codigo;
            $c->horas ??= config("congreso.horas.{$c->tipo}", 0);
            $c->emitido_en ??= now();
        });
    }

    public function participante(): BelongsTo
    {
        return $this->belongsTo(Participante::class);
    }

    public function url(): string
    {
        return route('certificados.descargar', $this->codigo_verificacion);
    }
}
