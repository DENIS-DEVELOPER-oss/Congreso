<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Un dato editable del congreso (clave → valor JSON). Ver App\Support\Ajustes.
class Ajuste extends Model
{
    protected $table = 'ajustes';

    protected $fillable = ['clave', 'valor'];

    protected function casts(): array
    {
        return ['valor' => 'array'];
    }
}
