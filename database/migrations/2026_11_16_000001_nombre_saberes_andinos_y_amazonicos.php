<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// El congreso pasó a llamarse «Saberes Andinos y Amazónicos»: corrige los títulos de sesiones ya guardados
// con el nombre anterior (andinoamazónicos / andino-amazónicos). Lo demás sale del código y de config/congreso.php.
return new class extends Migration
{
    private const CAMBIOS = [
        'andino-amazónicos' => 'andinos y amazónicos',
        'Andino-Amazónicos' => 'Andinos y Amazónicos',
        'andinoamazónicos' => 'andinos y amazónicos',
        'Andinoamazónicos' => 'Andinos y Amazónicos',
    ];

    public function up(): void
    {
        DB::table('sesiones')->where('titulo', 'like', '%ndino%maz%')->get(['id', 'titulo'])->each(function ($s) {
            DB::table('sesiones')->where('id', $s->id)->update(['titulo' => strtr($s->titulo, self::CAMBIOS)]);
        });
    }

    public function down(): void
    {
        // Sin vuelta atrás: el nombre anterior ya no se usa
    }
};
