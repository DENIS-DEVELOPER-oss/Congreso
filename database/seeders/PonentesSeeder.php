<?php

namespace Database\Seeders;

use App\Models\PonenteCentral;
use Illuminate\Database\Seeder;

// Los ponentes centrales (los 11 del afiche y el Dr. Juan José Pari Arapa). Solo se cargan si la tabla está vacía
// (no pisa lo editado en el panel); en una base que ya los tenía, el nuevo lo agrega su propia migración.
class PonentesSeeder extends Seeder
{
    // Título de cada ponencia central, según la programación oficial (la migración del 18-11 los carga en bases existentes)
    public const PONENCIAS = [
        'Dr. Adrián Scribano' => 'Reflexiones sociológicas sobre cultura e interculturalidad en Latinoamérica',
        'Mtro. Lorenzo Espinoza Gómez' => 'Desecación de lagos en el valle de México, una apreciación hermenéutica',
        'Dr. Jaime Ríos Burga' => 'El Buen Vivir en la educación universitaria latinoamericana: diálogo intercultural entre los conocimientos científicos y los saberes de los pueblos originarios',
        'Dr. Florentino Vizcarra Pinto' => 'La Universidad Intercultural de Quillabamba, educación pertinente para jóvenes de pueblos originarios y la integración de saberes',
        'Dr. Vicente Alanoca Arocutipa' => 'La apuesta por una descolonización para el diálogo intercultural emancipatorio en la educación superior universitaria desde el sur andino',
        'Dr. Ángel Canales Gutiérrez' => 'Conocimiento científico y tecnológico: aportes para la sostenibilidad y el desarrollo en la perspectiva del diálogo de saberes',
        'Dr. Emilio Chambi Apaza' => 'El diálogo mítico en la cosmovisión andina',
        'Dr. Juan Casazola Ccama' => '«Yaku Unu Mama» y «Madre Agua», sujeto de derechos en gobiernos subnacionales en la región Puno, periodo 2019-2025',
        'Antrop. Rubén Saraza Barriga' => 'El saber sagrado y la interculturalidad en la educación universitaria',
        'Antrop. Rolando Pilco Mallea' => 'Pueblos indígenas, interculturalidad y educación superior: el caso del pueblo aimara peruano. De construcción colectiva a demandas',
        'Dr. Porfirio Enríquez Salas' => 'Perspectiva interepistémica del diálogo intercultural: del saber científico hegemónico a la articulación equitativa de conocimientos en la educación universitaria peruana',
        'Dr. Juan José Pari Arapa' => 'Los caminos de crianza del saber en los niños de Amantaní, Puno',
    ];

    public function run(): void
    {
        if (PonenteCentral::exists()) {
            return;
        }

        // [nombre, institución, país, foto (en public/), reseña]
        $ponentes = [
            ['Dr. Adrián Scribano', 'CONICET', 'Argentina', 'ponentes/adrian-scribano.jpg', 'Sociólogo e investigador principal del Consejo Nacional de Investigaciones Científicas y Técnicas (CONICET) de Argentina.'],
            ['Mtro. Lorenzo Espinoza Gómez', 'Universidad Autónoma Chapingo', 'México', 'ponentes/lorenzo-espinoza.jpg', 'Docente del Departamento de Sociología Rural de la Universidad Autónoma Chapingo.'],
            ['Dr. Jaime Ríos Burga', 'Universidad Nacional Mayor de San Marcos', 'Perú', 'ponentes/jaime-rios.jpg', 'Docente de la Facultad de Ciencias Sociales de la Universidad Nacional Mayor de San Marcos.'],
            ['Dr. Florentino Vizcarra Pinto', 'Universidad Intercultural de Quillabamba (UNIQ)', 'Perú', 'ponentes/florentino-vizcarra.jpg', 'Director académico de Ciencias Sociales de la Universidad Intercultural de Quillabamba.'],
            ['Dr. Vicente Alanoca Arocutipa', 'Universidad Nacional del Altiplano', 'Perú', 'ponentes/vicente-alanoca.jpg', 'Docente de la Escuela Profesional de Antropología de la Facultad de Ciencias Sociales de la Universidad Nacional del Altiplano.'],
            ['Dr. Ángel Canales Gutiérrez', 'Universidad Nacional del Altiplano', 'Perú', 'ponentes/angel-canales.jpg', 'Docente principal de la Facultad de Biología de la Universidad Nacional del Altiplano.'],
            ['Dr. Emilio Chambi Apaza', 'Universidad Nacional del Altiplano', 'Perú', 'ponentes/emilio-chambi.jpg', 'Docente de la Escuela Profesional de Sociología de la Universidad Nacional del Altiplano.'],
            ['Dr. Juan Casazola Ccama', 'Universidad Nacional del Altiplano', 'Perú', 'ponentes/juan-casazola.jpg', 'Docente de la Escuela Profesional de Derecho de la Facultad de Ciencias Jurídicas y Políticas de la Universidad Nacional del Altiplano.'],
            ['Antrop. Rubén Saraza Barriga', 'Sabio originario aimara lupaka', 'Perú', 'ponentes/ruben-saraza.jpg', 'Antropólogo y sabio originario aimara lupaka, dedicado al estudio de la sabiduría ancestral.'],
            ['Antrop. Rolando Pilco Mallea', 'IDECA Puno', 'Perú', 'ponentes/rolando-pilco.jpg', 'Antropólogo y director de IDECA Puno.'],
            ['Dr. Porfirio Enríquez Salas', 'Universidad Nacional del Altiplano', 'Perú', 'ponentes/porfirio-enriquez.jpg', 'Docente de la Escuela Profesional de Sociología de la Universidad Nacional del Altiplano.'],
            ['Dr. Juan José Pari Arapa', 'Universidad Nacional del Altiplano', 'Perú', 'ponentes/juan-jose-pari.jpg', 'Docente de la Escuela Profesional de Educación Física de la Universidad Nacional del Altiplano.'],
        ];
        foreach ($ponentes as $i => [$nombre, $institucion, $pais, $foto, $bio]) {
            PonenteCentral::create(compact('nombre', 'institucion', 'pais', 'foto', 'bio') + ['ponencia' => self::PONENCIAS[$nombre] ?? null, 'orden' => $i + 1]);
        }
    }
}
