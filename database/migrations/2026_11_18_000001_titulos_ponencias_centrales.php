<?php

use Database\Seeders\PonentesSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Títulos de las ponencias centrales según la programación oficial (26 y 27 de noviembre).
// Solo completa los que siguen vacíos, para no pisar lo que la organización haya escrito en el panel.
return new class extends Migration
{
    public function up(): void
    {
        foreach (PonentesSeeder::PONENCIAS as $nombre => $ponencia) {
            DB::table('ponentes_centrales')
                ->where('nombre', $nombre)
                ->where(fn ($q) => $q->whereNull('ponencia')->orWhere('ponencia', ''))
                ->update(['ponencia' => $ponencia, 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        foreach (PonentesSeeder::PONENCIAS as $nombre => $ponencia) {
            DB::table('ponentes_centrales')->where('nombre', $nombre)->where('ponencia', $ponencia)->update(['ponencia' => null]);
        }
    }
};
