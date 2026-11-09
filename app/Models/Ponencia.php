<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ponencia extends Model
{
    public const ESTADOS = [
        'recibida' => 'Recibida',
        'aceptada' => 'Aceptada',
        'observada' => 'Observada',
        'rechazada' => 'Rechazada',
    ];

    protected $fillable = ['autor_id', 'titulo', 'eje_id', 'modalidad', 'coautores', 'palabras_clave', 'archivo', 'estado', 'observacion'];

    // Código correlativo: PON-001
    protected static function booted(): void
    {
        static::created(function (Ponencia $p) {
            $p->forceFill(['codigo' => sprintf('PON-%03d', $p->id)])->saveQuietly();
        });
    }

    public function autor(): BelongsTo
    {
        return $this->belongsTo(Participante::class, 'autor_id');
    }

    public function eje(): BelongsTo
    {
        return $this->belongsTo(EjeTematico::class, 'eje_id');
    }
}
