<?php

namespace Tests\Feature;

use App\Models\PonenteCentral;
use Database\Seeders\PonentesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Ponentes centrales: carga inicial y la migración que agrega al Dr. Juan José Pari Arapa en una base existente
class PonentesTest extends TestCase
{
    use RefreshDatabase;

    private function migracionPari(): object
    {
        return require database_path('migrations/2026_11_17_000001_ponente_juan_jose_pari.php');
    }

    public function test_la_carga_inicial_trae_doce_ponentes_con_pari_despues_de_porfirio(): void
    {
        $this->seed(PonentesSeeder::class);

        $nombres = PonenteCentral::paraLaPagina()->pluck('nombre')->all();
        $this->assertCount(12, $nombres);
        $this->assertSame(['Dr. Porfirio Enríquez Salas', 'Dr. Juan José Pari Arapa'], array_slice($nombres, -2));
    }

    public function test_la_migracion_lo_agrega_despues_de_porfirio_sin_duplicarlo(): void
    {
        // Base como la del servidor: ponentes ya cargados (y uno agregado después de Porfirio desde el panel)
        foreach (['Dr. Adrián Scribano', 'Dr. Porfirio Enríquez Salas', 'Invitada del panel'] as $i => $nombre) {
            PonenteCentral::create(['nombre' => $nombre, 'orden' => $i + 1]);
        }

        $this->migracionPari()->up();
        $this->migracionPari()->up(); // ejecutarla dos veces no lo duplica

        $this->assertSame(
            ['Dr. Adrián Scribano', 'Dr. Porfirio Enríquez Salas', 'Dr. Juan José Pari Arapa', 'Invitada del panel'],
            PonenteCentral::paraLaPagina()->pluck('nombre')->all(),
        );
        $this->assertSame('/ponentes/juan-jose-pari.jpg', PonenteCentral::where('nombre', 'like', '%Pari%')->first()->aPagina()['foto']);
        $this->assertFileExists(public_path('ponentes/juan-jose-pari.jpg'));
    }

    public function test_con_la_tabla_vacia_la_migracion_no_hace_nada(): void
    {
        $this->migracionPari()->up();

        $this->assertDatabaseCount('ponentes_centrales', 0);
    }
}
