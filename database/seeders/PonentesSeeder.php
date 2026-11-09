<?php

namespace Database\Seeders;

use App\Models\PonenteCentral;
use Illuminate\Database\Seeder;

// Los 11 ponentes centrales del afiche. Solo se cargan si la tabla está vacía (no pisa lo editado en el panel).
class PonentesSeeder extends Seeder
{
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
        ];
        foreach ($ponentes as $i => [$nombre, $institucion, $pais, $foto, $bio]) {
            PonenteCentral::create(compact('nombre', 'institucion', 'pais', 'foto', 'bio') + ['orden' => $i + 1]);
        }
    }
}
