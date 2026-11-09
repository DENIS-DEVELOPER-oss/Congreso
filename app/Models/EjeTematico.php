<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EjeTematico extends Model
{
    protected $table = 'ejes_tematicos';

    protected $fillable = ['titulo', 'descripcion', 'icono', 'orden'];

    public function ponencias(): HasMany
    {
        return $this->hasMany(Ponencia::class, 'eje_id');
    }
}
