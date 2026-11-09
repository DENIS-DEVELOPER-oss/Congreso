<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inscripcion extends Model
{
    protected $table = 'inscripciones';

    public const ESTADOS = [
        'pendiente' => 'Pendiente',
        'validada' => 'Validada',
        'observada' => 'Observada',
        'anulada' => 'Anulada',
    ];

    protected $fillable = [
        'participante_id', 'tipo_participante', 'monto', 'medio_pago', 'numero_operacion',
        'voucher', 'estado', 'observacion', 'validado_por', 'validado_en', 'acepta_privacidad', 'origen',
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'validado_en' => 'datetime',
            'acepta_privacidad' => 'boolean',
        ];
    }

    // El código se arma con el id: SA-2026-0001
    protected static function booted(): void
    {
        static::created(function (Inscripcion $i) {
            $i->forceFill(['codigo' => sprintf('%s-%04d', config('congreso.prefijo_codigo'), $i->id)])->saveQuietly();
        });
    }

    public function participante(): BelongsTo
    {
        return $this->belongsTo(Participante::class);
    }

    public function validador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validado_por');
    }

    public function asistencias(): HasMany
    {
        return $this->hasMany(Asistencia::class);
    }

    public function scopeValidadas(Builder $q): Builder
    {
        return $q->where('estado', 'validada');
    }

    // Inscripciones validadas que asistieron al porcentaje mínimo de sesiones
    public function scopeCumplenAsistencia(Builder $q): Builder
    {
        return $q->validadas()->has('asistencias', '>=', max(self::asistenciasMinimas(), 1));
    }

    public static function asistenciasMinimas(): int
    {
        return (int) ceil(Sesion::count() * config('congreso.porcentaje_asistencia') / 100);
    }

    // Monto según la tarifa vigente (preventa o regular)
    public static function montoPara(string $tipo): ?float
    {
        $tarifa = config("congreso.tarifas.$tipo");
        if (! $tarifa) {
            return null;
        }
        $fin = config('congreso.fecha_preventa_fin');

        return $fin && now()->lte(\Illuminate\Support\Carbon::parse($fin)->endOfDay()) ? $tarifa['preventa'] : $tarifa['regular'];
    }
}
