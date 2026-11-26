<?php

namespace Tests\Feature;

use App\Filament\Pages\RegistrarAsistencia;
use App\Models\Asistencia;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Sesion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Livewire\Livewire;
use Tests\TestCase;

// Registro de asistencia en la puerta con el DNI: entrada (sesión de la mañana) y salida (sesión de la tarde)
class AsistenciaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        config(['congreso.inscripcion_gratuita' => true]);
        $this->actingAs(User::factory()->create(['es_admin' => false]));
    }

    private function inscrito(string $dni, string $estado): Inscripcion
    {
        $p = Participante::create([
            'documento' => $dni, 'nombres' => 'Rosa', 'apellidos' => 'Mamani', 'correo' => "{$dni}@example.com",
            'telefono' => '951913416', 'institucion' => 'UNA Puno',
        ]);

        return Inscripcion::create(['participante_id' => $p->id, 'tipo_participante' => 'docente', 'monto' => 0, 'estado' => $estado, 'acepta_privacidad' => true]);
    }

    public function test_quien_llega_con_solicitud_pendiente_queda_confirmado_y_registrado(): void
    {
        $i = $this->inscrito('70123456', 'pendiente');
        $sesion = Sesion::create(['nombre' => 'Día 2 – mañana', 'fecha' => '2026-11-27', 'hora_inicio' => '09:00']);

        Livewire::test(RegistrarAsistencia::class)
            ->fillForm(['sesion_id' => $sesion->id, 'texto' => '70123456'])
            ->call('registrar');

        $this->assertSame('validada', $i->refresh()->estado);
        $this->assertSame(1, Asistencia::where('inscripcion_id', $i->id)->count());
    }

    public function test_anuladas_y_observadas_no_se_registran(): void
    {
        $anulada = $this->inscrito('70000001', 'anulada');
        $observada = $this->inscrito('70000002', 'observada');
        $sesion = Sesion::create(['nombre' => 'Día 2 – mañana', 'fecha' => '2026-11-27', 'hora_inicio' => '09:00']);

        Livewire::test(RegistrarAsistencia::class)
            ->fillForm(['sesion_id' => $sesion->id, 'lista' => "70000001\n70000002"])
            ->call('registrar');

        $this->assertSame(0, Asistencia::count());
        $this->assertSame('anulada', $anulada->refresh()->estado);
        $this->assertSame('observada', $observada->refresh()->estado);
    }

    public function test_por_la_tarde_se_elige_la_sesion_de_salida(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 27)->setTime(16, 0));
        Sesion::create(['nombre' => 'Día 2 – mañana', 'fecha' => '2026-11-27', 'hora_inicio' => '09:00']);
        $tarde = Sesion::create(['nombre' => 'Día 2 – tarde', 'fecha' => '2026-11-27', 'hora_inicio' => '14:00']);

        Livewire::test(RegistrarAsistencia::class)->assertSet('data.sesion_id', $tarde->id);
    }
}
