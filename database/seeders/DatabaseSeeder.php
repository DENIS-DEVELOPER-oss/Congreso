<?php

namespace Database\Seeders;

use App\Models\EjeTematico;
use App\Models\Sesion;
use Illuminate\Database\Seeder;

// Datos iniciales: ejes temáticos oficiales y las 4 sesiones del congreso.
// Se puede ejecutar varias veces sin duplicar. El administrador se crea con: php artisan congreso:admin
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Ejes temáticos oficiales (afiche de la convocatoria)
        $ejes = [
            'La perspectiva sociológica de los problemas culturales y la interculturalidad en América Latina.',
            'El Buen Vivir en la construcción de una educación universitaria para el diálogo intercultural de conocimientos científicos y saberes de los pueblos originarios.',
            'Universidad intercultural y la articulación de saberes tradicionales, ciencia y tecnología para la formación de jóvenes de pueblos originarios.',
            'Descolonización, diálogo intercultural emancipatorio y transformación de la educación superior universitaria desde el Sur Andino.',
            'Avances científicos y tecnológicos orientados a la gestión sostenible de recursos naturales en la perspectiva del diálogo de saberes.',
            'La pluriculturalidad peruana: fundamentos para una perspectiva interepistémica del diálogo intercultural en la educación superior universitaria.',
        ];
        foreach ($ejes as $i => $titulo) {
            EjeTematico::updateOrCreate(['titulo' => $titulo], ['descripcion' => null, 'orden' => $i + 1]);
        }
        // Se quitan los ejes de ejemplo que no tengan ponencias asociadas
        EjeTematico::whereNotIn('titulo', $ejes)->whereDoesntHave('ponencias')->delete();

        // Programa del aula virtual (horario de Perú). Títulos y ponentes por confirmar: se editan en el panel.
        $sesiones = [
            ['Día 1 – mañana', '2026-11-26', '09:00', '13:00', 'Inauguración y conferencias centrales', 'Ponentes centrales'],
            ['Día 1 – tarde', '2026-11-26', '15:00', '19:00', 'Mesas temáticas: saberes andino-amazónicos', 'Ponentes de las mesas'],
            ['Día 2 – mañana', '2026-11-27', '09:00', '13:00', 'Diálogo intercultural en la educación superior universitaria', 'Panel de ponentes centrales'],
            ['Día 2 – tarde', '2026-11-27', '15:00', '19:00', 'Mesas temáticas y clausura', 'Comisión organizadora'],
        ];
        foreach ($sesiones as [$nombre, $fecha, $inicio, $fin, $titulo, $ponente]) {
            Sesion::updateOrCreate(['nombre' => $nombre], [
                'fecha' => $fecha, 'hora_inicio' => $inicio, 'hora_fin' => $fin, 'titulo' => $titulo, 'ponente' => $ponente,
            ]);
        }

        $this->call(PonentesSeeder::class);
    }
}
