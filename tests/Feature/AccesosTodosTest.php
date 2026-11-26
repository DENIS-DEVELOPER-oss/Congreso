<?php

namespace Tests\Feature;

use App\Filament\Resources\Inscripcions\Pages\ListInscripcions;
use App\Mail\AccesoAula;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\User;
use App\Support\Accesos;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Livewire\Livewire;
use Tests\TestCase;

// «Enviar accesos a todos»: usuario y contraseña del Aula por tandas, sin cambiar la contraseña de quien ya creó la suya
class AccesosTodosTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        $this->actingAs(User::factory()->create(['es_admin' => false])); // también lo usa el organizador
    }

    private function inscrito(string $dni, string $estado = 'validada', array $cuenta = []): Inscripcion
    {
        $p = Participante::create([
            'documento' => $dni, 'nombres' => 'Rosa', 'apellidos' => 'Mamani', 'correo' => "{$dni}@example.com",
            'telefono' => '951913416', 'institucion' => 'UNA Puno',
        ]);
        if ($cuenta) {
            $p->forceFill($cuenta)->save();
        }

        return Inscripcion::create(['participante_id' => $p->id, 'tipo_participante' => 'docente', 'monto' => 0, 'estado' => $estado, 'acepta_privacidad' => true]);
    }

    public function test_envia_por_tandas_solo_a_quienes_no_tienen_acceso(): void
    {
        foreach (range(1, Accesos::LOTE_PANEL + 1) as $n) {
            $this->inscrito((string) (70000000 + $n), $n % 2 ? 'validada' : 'pendiente');
        }
        $anulada = $this->inscrito('71000000', 'anulada');
        $conClavePropia = $this->inscrito('72000000', 'validada', ['password' => 'MiClave2026', 'debe_cambiar_clave' => false]);

        Livewire::test(ListInscripcions::class)->callAction('accesosTodos', data: ['sin_ingresar' => false]);
        Mail::assertSent(AccesoAula::class, Accesos::LOTE_PANEL);

        Livewire::test(ListInscripcions::class)->callAction('accesosTodos', data: ['sin_ingresar' => false]);
        Mail::assertSent(AccesoAula::class, Accesos::LOTE_PANEL + 1);
        $this->assertSame(0, Accesos::pendientes()->count());

        // Ni el anulado ni quien ya creó su contraseña reciben nada; su contraseña no cambia
        Mail::assertNotSent(AccesoAula::class, fn ($m) => $m->hasTo('71000000@example.com') || $m->hasTo('72000000@example.com'));
        $this->assertNull($anulada->participante->fresh()->password);
        $this->assertTrue(Hash::check('MiClave2026', $conClavePropia->participante->fresh()->password));
    }

    public function test_con_la_opcion_reenvia_a_quienes_nunca_ingresaron_una_sola_vez(): void
    {
        $nunca = $this->inscrito('70123456', 'validada', ['password' => 'temporal1', 'debe_cambiar_clave' => true, 'acceso_enviado_en' => now()->subDay()]);
        $this->inscrito('70999888', 'validada', ['password' => 'MiClave2026', 'debe_cambiar_clave' => false]);

        Livewire::test(ListInscripcions::class)->callAction('accesosTodos', data: ['sin_ingresar' => true]);
        Mail::assertSent(AccesoAula::class, 1);
        Mail::assertSent(AccesoAula::class, fn ($m) => $m->hasTo('70123456@example.com'));
        $this->assertFalse(Hash::check('temporal1', $nunca->participante->fresh()->password));

        // Pulsar otra vez no le vuelve a cambiar la contraseña que acaba de recibir
        Livewire::test(ListInscripcions::class)->callAction('accesosTodos', data: ['sin_ingresar' => true]);
        Mail::assertSent(AccesoAula::class, 1);
    }
}
