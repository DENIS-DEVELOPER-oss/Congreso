<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Programación actualizada del 27 de noviembre: ponencia del Antrop. Rolando Pilco Mallea y nuevo título del Dr. Porfirio Enríquez.
// Solo cambia lo que sigue vacío o con el título anterior, para no pisar lo que la organización haya escrito en el panel.
return new class extends Migration
{
    private const ENRIQUEZ_ANTES = 'Perspectiva interepistémica del diálogo intercultural frente a la hegemonía del saber científico: hacia una propuesta de articulación equitativa de conocimientos en el Perú';

    private const ENRIQUEZ = 'Perspectiva interepistémica del diálogo intercultural: del saber científico hegemónico a la articulación equitativa de conocimientos en la educación universitaria peruana';

    private const PILCO = 'Pueblos indígenas, interculturalidad y educación superior: el caso del pueblo aimara peruano. De construcción colectiva a demandas';

    public function up(): void
    {
        DB::table('ponentes_centrales')->where('nombre', 'Antrop. Rolando Pilco Mallea')
            ->where(fn ($q) => $q->whereNull('ponencia')->orWhere('ponencia', ''))
            ->update(['ponencia' => self::PILCO, 'updated_at' => now()]);

        DB::table('ponentes_centrales')->where('nombre', 'Dr. Porfirio Enríquez Salas')
            ->where(fn ($q) => $q->whereNull('ponencia')->orWhere('ponencia', '')->orWhere('ponencia', self::ENRIQUEZ_ANTES))
            ->update(['ponencia' => self::ENRIQUEZ, 'updated_at' => now()]);
    }

    public function down(): void
    {
        DB::table('ponentes_centrales')->where('nombre', 'Antrop. Rolando Pilco Mallea')->where('ponencia', self::PILCO)->update(['ponencia' => null]);
        DB::table('ponentes_centrales')->where('nombre', 'Dr. Porfirio Enríquez Salas')->where('ponencia', self::ENRIQUEZ)->update(['ponencia' => self::ENRIQUEZ_ANTES]);
    }
};
