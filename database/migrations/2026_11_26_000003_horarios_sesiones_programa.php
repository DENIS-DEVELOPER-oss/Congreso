<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Horarios de las sesiones según el programa oficial: el día 1 empieza a las 8:00 y las mesas de la tarde a las 14:00.
// Solo cambia las sesiones que siguen con el horario inicial, para no pisar lo que la organización haya editado en el panel.
return new class extends Migration
{
    // [nombre, horario inicial, horario del programa]
    private const CAMBIOS = [
        ['Día 1 – mañana', ['09:00', '13:00'], ['08:00', '12:30']],
        ['Día 1 – tarde', ['15:00', '19:00'], ['14:00', '19:00']],
        ['Día 2 – tarde', ['15:00', '19:00'], ['14:00', '19:00']],
    ];

    public function up(): void
    {
        foreach (self::CAMBIOS as [$nombre, $antes, $ahora]) {
            $this->cambiar($nombre, $antes, $ahora);
        }
    }

    public function down(): void
    {
        foreach (self::CAMBIOS as [$nombre, $antes, $ahora]) {
            $this->cambiar($nombre, $ahora, $antes);
        }
    }

    private function cambiar(string $nombre, array $de, array $a): void
    {
        DB::table('sesiones')->where('nombre', $nombre)
            ->whereIn('hora_inicio', [$de[0], $de[0].':00'])
            ->whereIn('hora_fin', [$de[1], $de[1].':00'])
            ->update(['hora_inicio' => $a[0], 'hora_fin' => $a[1], 'updated_at' => now()]);
    }
};
