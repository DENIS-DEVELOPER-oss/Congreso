<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Nuevo ponente central: Dr. Juan José Pari Arapa, justo después del Dr. Porfirio Enríquez Salas.
// Solo actúa si la tabla ya tiene ponentes (en una base vacía los carga PonentesSeeder) y si aún no está.
return new class extends Migration
{
    private const NOMBRE = 'Dr. Juan José Pari Arapa';

    public function up(): void
    {
        if (! DB::table('ponentes_centrales')->exists() || DB::table('ponentes_centrales')->where('nombre', self::NOMBRE)->exists()) {
            return;
        }

        $porfirio = DB::table('ponentes_centrales')->where('nombre', 'like', '%Porfirio%')->value('orden');
        $orden = $porfirio !== null ? $porfirio + 1 : DB::table('ponentes_centrales')->max('orden') + 1;

        // Los que estaban después de Porfirio bajan un lugar
        DB::table('ponentes_centrales')->where('orden', '>=', $orden)->increment('orden');

        DB::table('ponentes_centrales')->insert([
            'nombre' => self::NOMBRE,
            'institucion' => 'Universidad Nacional del Altiplano',
            'pais' => 'Perú',
            'foto' => 'ponentes/juan-jose-pari.jpg',
            'bio' => 'Docente de la Escuela Profesional de Educación Física de la Universidad Nacional del Altiplano.',
            'magistral' => false,
            'visible' => true,
            'orden' => $orden,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('ponentes_centrales')->where('nombre', self::NOMBRE)->delete();
    }
};
