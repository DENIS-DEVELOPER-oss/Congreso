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
            ->set('data.sesion_id', $sesion->id)->set('data.texto', '70123456')
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
            ->set('data.sesion_id', $sesion->id)->set('data.lista', "70000001\n70000002")
            ->call('registrar');

        $this->assertSame(0, Asistencia::count());
        $this->assertSame('anulada', $anulada->refresh()->estado);
        $this->assertSame('observada', $observada->refresh()->estado);
    }

    public function test_la_pagina_muestra_entrada_y_salida_y_el_resultado_de_cada_dni(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 27)->setTime(9, 30));
        $i = $this->inscrito('70123456', 'validada');
        $manana = Sesion::create(['nombre' => 'Día 2 – mañana', 'fecha' => '2026-11-27', 'hora_inicio' => '09:00', 'hora_fin' => '13:00']);
        $tarde = Sesion::create(['nombre' => 'Día 2 – tarde', 'fecha' => '2026-11-27', 'hora_inicio' => '14:00', 'hora_fin' => '19:00']);

        $pagina = Livewire::test(RegistrarAsistencia::class)
            ->assertSet('data.sesion_id', $manana->id)
            ->assertSee('Entrada')->assertSee('Salida')->assertSee('Escriba el DNI y presione Enter');

        // Primer registro: tarjeta verde con el nombre; el campo queda vacío para la siguiente persona
        $pagina->set('data.texto', '70123456')->call('registrar')
            ->assertSet('resultado.tipo', 'ok')->assertSet('data.texto', '')
            ->assertSee('Rosa Mamani')->assertDispatched('enfocar-dni');

        // El mismo DNI otra vez: avisa y no duplica
        $pagina->set('data.texto', '70123456')->call('registrar')->assertSet('resultado.tipo', 'ya');
        $this->assertSame(1, Asistencia::where('sesion_id', $manana->id)->count());

        // DNI inexistente
        $pagina->set('data.texto', '11111111')->call('registrar')->assertSet('resultado.tipo', 'no_encontrado');

        // Al pasar a SALIDA se registra aparte
        $pagina->call('elegirSesion', $tarde->id)->assertSet('resultado', null)
            ->set('data.texto', '70123456')->call('registrar')->assertSet('resultado.tipo', 'ok');
        $this->assertSame(2, Asistencia::where('inscripcion_id', $i->id)->count());
    }

    public function test_el_aula_muestra_cuantas_veces_asistio_y_oculta_la_ponencia_al_asistente(): void
    {
        config(['congreso.porcentaje_asistencia' => 75]);
        $asistente = $this->inscrito('70123456', 'validada');
        $manana = Sesion::create(['nombre' => 'Día 1 – mañana', 'fecha' => '2026-11-26', 'hora_inicio' => '08:00']);
        Sesion::create(['nombre' => 'Día 1 – tarde', 'fecha' => '2026-11-26', 'hora_inicio' => '14:00']);
        Sesion::create(['nombre' => 'Día 2 – mañana', 'fecha' => '2026-11-27', 'hora_inicio' => '09:00']);
        Sesion::create(['nombre' => 'Día 2 – tarde', 'fecha' => '2026-11-27', 'hora_inicio' => '14:00']);
        Asistencia::create(['inscripcion_id' => $asistente->id, 'sesion_id' => $manana->id, 'registrado_en' => now()->setTime(8, 12)]);

        $this->actingAs($asistente->participante, 'participante')->getJson('/cuenta/yo')
            ->assertOk()
            ->assertJsonPath('esPonente', false)
            ->assertJsonPath('asistencia.asistidas', 1)
            ->assertJsonPath('asistencia.total', 4)
            ->assertJsonPath('asistencia.minimas', 3)
            ->assertJsonPath('asistencia.cumple', false)
            ->assertJsonPath('asistencia.sesiones.0.rol', 'Entrada')
            ->assertJsonPath('asistencia.sesiones.0.asistio', true)
            ->assertJsonPath('asistencia.sesiones.0.hora', '08:12')
            ->assertJsonPath('asistencia.sesiones.1.rol', 'Salida')
            ->assertJsonPath('asistencia.sesiones.1.asistio', false);

        // Quien se inscribió como ponente sí ve su ponencia
        $ponente = $this->inscrito('70999888', 'validada');
        $ponente->update(['tipo_participante' => 'ponente']);
        $this->actingAs($ponente->participante, 'participante')->getJson('/cuenta/yo')->assertJsonPath('esPonente', true);
    }

    public function test_por_la_tarde_se_elige_la_sesion_de_salida(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 27)->setTime(16, 0));
        Sesion::create(['nombre' => 'Día 2 – mañana', 'fecha' => '2026-11-27', 'hora_inicio' => '09:00']);
        $tarde = Sesion::create(['nombre' => 'Día 2 – tarde', 'fecha' => '2026-11-27', 'hora_inicio' => '14:00']);

        Livewire::test(RegistrarAsistencia::class)->assertSet('data.sesion_id', $tarde->id);
    }
}
