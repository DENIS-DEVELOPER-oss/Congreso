<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

// Ponente central del congreso (sección "Ponentes" de la página). La foto se guarda en public/ponentes/.
class PonenteCentral extends Model
{
    protected $table = 'ponentes_centrales';

    protected $fillable = ['nombre', 'institucion', 'pais', 'foto', 'ponencia', 'bio', 'magistral', 'visible', 'orden'];

    protected function casts(): array
    {
        return ['magistral' => 'boolean', 'visible' => 'boolean', 'orden' => 'integer'];
    }

    public function scopeParaLaPagina(Builder $query): Builder
    {
        return $query->where('visible', true)->orderBy('orden')->orderBy('id');
    }

    // Formato que usa la página (resources/js/data/ponentes.js)
    public function aPagina(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'institucion' => $this->institucion,
            'pais' => $this->pais,
            'foto' => $this->foto ? '/'.ltrim($this->foto, '/') : null,
            'ponencia' => $this->ponencia,
            'bio' => $this->bio,
            'magistral' => $this->magistral,
        ];
    }
}
