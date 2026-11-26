<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// El congreso empezó el 26 de noviembre: la página deja de recibir inscripciones y solicitudes.
// Se puede reabrir desde el panel (Datos del congreso → Inscripción y pagos → Inscripciones finalizadas).
return new class extends Migration
{
    public function up(): void
    {
        DB::table('ajustes')->updateOrInsert(
            ['clave' => 'inscripciones_finalizadas'],
            ['valor' => json_encode(true), 'updated_at' => now(), 'created_at' => now()],
        );
    }

    public function down(): void
    {
        DB::table('ajustes')->where('clave', 'inscripciones_finalizadas')->delete();
    }
};
