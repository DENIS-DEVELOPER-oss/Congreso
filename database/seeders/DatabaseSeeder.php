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
        // Mesas de trabajo oficiales (documento de la convocatoria), con sus subtemas clave uno por línea
        $ejes = [
            ['La perspectiva sociológica de los problemas culturales y la interculturalidad en América Latina.', "Principales enfoques teóricos de la sociología latinoamericana para comprender la sociedad y la cultura, en la perspectiva de la diversidad.\nDiversidad cultural, identidades e interculturalidad en las sociedades latinoamericanas."],
            ['El Buen Vivir y la construcción de una educación universitaria que promueva el diálogo intercultural y la articulación complementaria de los conocimientos científicos y los saberes ancestrales de los pueblos originarios.', "El Buen Vivir como fundamento ético, epistemológico y sociocultural de la educación universitaria latinoamericana, articulada críticamente con el conocimiento científico y los saberes ancestrales de los pueblos originarios.\nAdecuación de la educación universitaria desde el Buen Vivir: formación integral, justicia social y sostenibilidad de la vida."],
            ['Universidad intercultural y educación pertinente para la articulación de saberes tradicionales, ciencia y tecnología para la formación de jóvenes de pueblos originarios.', "Fundamentos teóricos y epistemológicos de la universidad intercultural y la pertinencia educativa para los pueblos originarios.\nDiálogo de saberes tradicionales, conocimiento científico y tecnología en la formación universitaria de los jóvenes de pueblos originarios."],
            ['Descolonización, diálogo intercultural emancipatorio y transformación de la educación superior universitaria desde el Sur Andino.', "Fundamentos teóricos y epistemológicos de la descolonización del conocimiento en la educación superior universitaria.\nDiálogo intercultural emancipatorio, relaciones de poder, desigualdades socioculturales y transformación descolonizadora de saberes en la universidad."],
            ['Avances científicos y tecnológicos orientados a la gestión sostenible de recursos naturales en la perspectiva del diálogo de saberes.', "Innovaciones tecnológicas para la gestión sostenible de recursos naturales.\nAplicación de la ciencia y tecnología en la mejora de la calidad de vida en las comunidades rurales y el rol de las universidades en la investigación científica para la sostenibilidad."],
            ['Sociedad pluricultural y multilingüe peruana: fundamentos para una perspectiva interepistémica del diálogo intercultural en la educación superior universitaria.', "Fundamentos socioculturales de la sociedad pluricultural y multilingüe peruana: identidades, cosmovisiones y saberes ancestrales de los pueblos originarios del Perú, orientados a una educación superior universitaria intercultural.\nFundamentos epistemológicos de la perspectiva interepistémica del diálogo intercultural, orientada al diálogo equitativo y la articulación complementaria entre los conocimientos científicos y los saberes ancestrales."],
        ];
        foreach ($ejes as $i => [$titulo, $subtemas]) {
            EjeTematico::updateOrCreate(['orden' => $i + 1], ['titulo' => $titulo, 'descripcion' => $subtemas]);
        }
        // Se quitan los ejes de ejemplo que no tengan ponencias asociadas
        EjeTematico::whereNotIn('titulo', array_column($ejes, 0))->whereDoesntHave('ponencias')->delete();

        // Programa del aula virtual (horario de Perú). Títulos y ponentes por confirmar: se editan en el panel.
        $sesiones = [
            ['Día 1 – mañana', '2026-11-26', '09:00', '13:00', 'Inauguración y conferencias centrales', 'Ponentes centrales'],
            ['Día 1 – tarde', '2026-11-26', '15:00', '19:00', 'Mesas temáticas: saberes andinos y amazónicos', 'Ponentes de las mesas'],
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
