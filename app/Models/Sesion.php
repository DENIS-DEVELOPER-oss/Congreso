<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

// Sesión del congreso: aparece en el Aula y en el correo de acceso, y en ella se registra la asistencia
class Sesion extends Model
{
    protected $table = 'sesiones';

    protected $fillable = ['nombre', 'titulo', 'ponente', 'fecha', 'hora_inicio', 'hora_fin', 'enlace', 'material'];

    protected function casts(): array
    {
        return ['fecha' => 'date'];
    }

    public function asistencias(): HasMany
    {
        return $this->hasMany(Asistencia::class);
    }

    public function scopeEnOrden(Builder $q): Builder
    {
        return $q->orderBy('fecha')->orderBy('hora_inicio')->orderBy('id');
    }

    // En cada día con dos o más sesiones, la primera es la ENTRADA y la última la SALIDA: [id => 'Entrada' | 'Salida']
    public static function roles(?Collection $sesiones = null): array
    {
        $sesiones ??= self::enOrden()->get();
        $roles = [];
        foreach ($sesiones->sortBy([['fecha', 'asc'], ['hora_inicio', 'asc'], ['id', 'asc']])->groupBy(fn (Sesion $s) => $s->fecha->toDateString()) as $delDia) {
            if ($delDia->count() >= 2) {
                $roles[$delDia->first()->id] = 'Entrada';
                $roles[$delDia->last()->id] = 'Salida';
            }
        }

        return $roles;
    }

    // "Jueves 26 de noviembre"
    public function fechaTexto(): string
    {
        return Carbon::parse($this->fecha)->locale('es')->translatedFormat('l j \d\e F');
    }

    // "9:00 a. m. a 1:00 p. m." (hora de Perú)
    public function horarioTexto(): ?string
    {
        if (! $this->hora_inicio) {
            return null;
        }
        $f = fn ($h) => str_replace(['AM', 'PM'], ['a. m.', 'p. m.'], Carbon::parse($h)->format('g:i A'));

        return $f($this->hora_inicio).($this->hora_fin ? ' a '.$f($this->hora_fin) : '');
    }
}
