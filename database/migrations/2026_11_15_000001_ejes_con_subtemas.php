<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Mesas de trabajo según el documento oficial de la convocatoria: títulos finales y sus subtemas clave
// (en «descripcion», uno por línea). Se actualizan por su orden para conservar las ponencias ya asociadas.
return new class extends Migration
{
    public function up(): void
    {
        $ejes = [
            1 => ['La perspectiva sociológica de los problemas culturales y la interculturalidad en América Latina.', "Principales enfoques teóricos de la sociología latinoamericana para comprender la sociedad y la cultura, en la perspectiva de la diversidad.\nDiversidad cultural, identidades e interculturalidad en las sociedades latinoamericanas."],
            2 => ['El Buen Vivir y la construcción de una educación universitaria que promueva el diálogo intercultural y la articulación complementaria de los conocimientos científicos y los saberes ancestrales de los pueblos originarios.', "El Buen Vivir como fundamento ético, epistemológico y sociocultural de la educación universitaria latinoamericana, articulada críticamente con el conocimiento científico y los saberes ancestrales de los pueblos originarios.\nAdecuación de la educación universitaria desde el Buen Vivir: formación integral, justicia social y sostenibilidad de la vida."],
            3 => ['Universidad intercultural y educación pertinente para la articulación de saberes tradicionales, ciencia y tecnología para la formación de jóvenes de pueblos originarios.', "Fundamentos teóricos y epistemológicos de la universidad intercultural y la pertinencia educativa para los pueblos originarios.\nDiálogo de saberes tradicionales, conocimiento científico y tecnología en la formación universitaria de los jóvenes de pueblos originarios."],
            4 => ['Descolonización, diálogo intercultural emancipatorio y transformación de la educación superior universitaria desde el Sur Andino.', "Fundamentos teóricos y epistemológicos de la descolonización del conocimiento en la educación superior universitaria.\nDiálogo intercultural emancipatorio, relaciones de poder, desigualdades socioculturales y transformación descolonizadora de saberes en la universidad."],
            5 => ['Avances científicos y tecnológicos orientados a la gestión sostenible de recursos naturales en la perspectiva del diálogo de saberes.', "Innovaciones tecnológicas para la gestión sostenible de recursos naturales.\nAplicación de la ciencia y tecnología en la mejora de la calidad de vida en las comunidades rurales y el rol de las universidades en la investigación científica para la sostenibilidad."],
            6 => ['Sociedad pluricultural y multilingüe peruana: fundamentos para una perspectiva interepistémica del diálogo intercultural en la educación superior universitaria.', "Fundamentos socioculturales de la sociedad pluricultural y multilingüe peruana: identidades, cosmovisiones y saberes ancestrales de los pueblos originarios del Perú, orientados a una educación superior universitaria intercultural.\nFundamentos epistemológicos de la perspectiva interepistémica del diálogo intercultural, orientada al diálogo equitativo y la articulación complementaria entre los conocimientos científicos y los saberes ancestrales."],
        ];
        foreach ($ejes as $orden => [$titulo, $subtemas]) {
            $fila = DB::table('ejes_tematicos')->where('orden', $orden)->first();
            $datos = ['titulo' => $titulo, 'descripcion' => $subtemas, 'updated_at' => now()];
            $fila
                ? DB::table('ejes_tematicos')->where('id', $fila->id)->update($datos)
                : DB::table('ejes_tematicos')->insert($datos + ['orden' => $orden, 'created_at' => now()]);
        }
    }

    public function down(): void
    {
        // Sin vuelta atrás: los textos anteriores eran una versión preliminar
    }
};
