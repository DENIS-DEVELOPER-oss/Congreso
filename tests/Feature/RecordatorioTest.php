<?php

namespace Tests\Feature;

use App\Filament\Resources\Inscripcions\Pages\ListInscripcions;
use App\Mail\RecordatorioAsistencia;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\User;
use App\Support\Recordatorios;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Livewire\Livewire;
use Tests\TestCase;

// Recordatorio de asistencia a los inscritos: nombre tal como se inscribieron, sin repetir envíos y sin anulados
class RecordatorioTest extends TestCase
{
    use RefreshDatabase;

    private function inscrito(string $nombres, string $apellidos, string $correo, string $estado = 'validada'): Inscripcion
    {
        $p = Participante::create([
            'documento' => (string) random_int(10000000, 99999999), 'nombres' => $nombres, 'apellidos' => $apellidos,
            'correo' => $correo, 'telefono' => '951913416', 'institucion' => 'UNA Puno',
        ]);

        return Inscripcion::create(['participante_id' => $p->id, 'tipo_participante' => 'docente', 'monto' => 0, 'estado' => $estado, 'acepta_privacidad' => true]);
    }

    public function test_el_correo_saluda_con_el_nombre_tal_como_se_inscribio(): void
    {
        $i = $this->inscrito('rosa ELENA', 'Mamani Quispe', 'rosa@example.com');

        $html = (new RecordatorioAsistencia($i))->render();

        $this->assertStringContainsString('rosa ELENA Mamani Quispe', $html);
        $this->assertStringContainsString('a partir de las 8:00 a. m.', $html);
        $this->assertStringContainsString('entrada', $html);
        $this->assertStringContainsString('salida', $html);
        $this->assertStringContainsString('DNI', $html);
    }

    public function test_el_organizador_envia_para_los_dos_dias_con_el_grupo_de_whatsapp_sin_tocar_otros_datos(): void
    {
        Mail::fake();
        $this->actingAs(User::factory()->create(['es_admin' => false]));
        $i = $this->inscrito('Rosa', 'Mamani', 'rosa@example.com', 'pendiente');
        $antes = $i->fresh()->only(['estado', 'tipo_participante', 'codigo', 'observacion', 'validado_en']);
        $participante = $i->participante->fresh()->only(['nombres', 'apellidos', 'correo', 'documento', 'password']);
        $grupo = 'https://chat.whatsapp.com/AbCdEf123456';

        Livewire::test(ListInscripcions::class)
            ->callAction('recordatorioTodos', data: ['dia' => 'ambos', 'grupo_whatsapp' => $grupo, 'solo_confirmadas' => false])
            ->assertHasNoActionErrors();

        Mail::assertSent(RecordatorioAsistencia::class, function ($m) use ($grupo) {
            $html = $m->render();

            return $m->hasTo('rosa@example.com') && $m->dia === 'ambos'
                && str_contains($html, $grupo) && str_contains($html, 'jueves 26 y viernes 27');
        });
        // Solo se anota la fecha del recordatorio: estado, datos y acceso de la persona quedan igual
        $this->assertSame($antes, $i->fresh()->only(array_keys($antes)));
        $this->assertSame($participante, $i->participante->fresh()->only(array_keys($participante)));
        $this->assertNotNull($i->fresh()->recordatorio_enviado_en);
        $this->assertSame($grupo, config('congreso.grupo_whatsapp'));
    }

    public function test_el_enlace_del_grupo_debe_ser_de_whatsapp_y_es_opcional(): void
    {
        Mail::fake();
        $this->actingAs(User::factory()->create(['es_admin' => true]));
        $this->inscrito('Rosa', 'Mamani', 'rosa@example.com');

        Livewire::test(ListInscripcions::class)
            ->callAction('recordatorioTodos', data: ['dia' => '27', 'grupo_whatsapp' => 'https://sitio-falso.com/x', 'solo_confirmadas' => false])
            ->assertHasActionErrors(['grupo_whatsapp']);
        Mail::assertNothingSent();

        Livewire::test(ListInscripcions::class)
            ->callAction('recordatorioTodos', data: ['dia' => '27', 'grupo_whatsapp' => '', 'solo_confirmadas' => false])
            ->assertHasNoActionErrors();
        Mail::assertSent(RecordatorioAsistencia::class, fn ($m) => ! str_contains($m->render(), 'chat.whatsapp.com'));
    }

    public function test_el_comando_envia_a_todos_menos_anulados_y_no_repite(): void
    {
        Mail::fake();
        $this->inscrito('Rosa', 'Mamani', 'rosa@example.com');
        $this->inscrito('Juan', 'Quispe', 'juan@example.com', 'pendiente');
        $this->inscrito('Ana', 'Condori', 'ana@example.com', 'anulada');

        $this->artisan('congreso:recordatorio', ['--pausa' => 0])
            ->expectsConfirmation('Se enviará el recordatorio a 2 persona(s) (Los dos días (26 y 27 de noviembre)). ¿Continuar?', 'yes')
            ->assertSuccessful();

        Mail::assertSent(RecordatorioAsistencia::class, 2);
        Mail::assertSent(RecordatorioAsistencia::class, fn ($m) => $m->hasTo('rosa@example.com'));
        Mail::assertSent(RecordatorioAsistencia::class, fn ($m) => $m->hasTo('juan@example.com'));
        Mail::assertNotSent(RecordatorioAsistencia::class, fn ($m) => $m->hasTo('ana@example.com'));
        $this->assertSame(2, Inscripcion::whereNotNull('recordatorio_enviado_en')->count());

        // Al repetirlo ya no hay a quién enviar
        $this->artisan('congreso:recordatorio', ['--pausa' => 0])
            ->expectsOutput('No hay inscritos pendientes de recibir el recordatorio.')
            ->assertSuccessful();
        Mail::assertSent(RecordatorioAsistencia::class, 2);
    }

    public function test_el_boton_del_panel_envia_por_tandas_sin_repetir(): void
    {
        Mail::fake();
        $this->actingAs(User::factory()->create(['es_admin' => true]));
        foreach (range(1, Recordatorios::LOTE_PANEL + 2) as $n) {
            $this->inscrito("Persona {$n}", 'Prueba', "p{$n}@example.com");
        }
        $this->inscrito('Ana', 'Condori', 'ana@example.com', 'anulada');

        Livewire::test(ListInscripcions::class)->callAction('recordatorioTodos', data: ['dia' => '27', 'solo_confirmadas' => false]);
        Mail::assertSent(RecordatorioAsistencia::class, Recordatorios::LOTE_PANEL);

        Livewire::test(ListInscripcions::class)->callAction('recordatorioTodos', data: ['dia' => '27', 'solo_confirmadas' => false]);
        Mail::assertSent(RecordatorioAsistencia::class, Recordatorios::LOTE_PANEL + 2);
        Mail::assertNotSent(RecordatorioAsistencia::class, fn ($m) => $m->hasTo('ana@example.com'));
        $this->assertSame(0, Recordatorios::pendientes()->count());
    }

    public function test_la_prueba_solo_va_al_correo_indicado_y_no_marca_a_nadie(): void
    {
        Mail::fake();
        $this->inscrito('Rosa', 'Mamani', 'rosa@example.com');

        $this->artisan('congreso:recordatorio', ['--prueba' => 'comision@example.com', '--dia' => '27'])->assertSuccessful();

        Mail::assertSent(RecordatorioAsistencia::class, 1);
        Mail::assertSent(RecordatorioAsistencia::class, fn ($m) => $m->hasTo('comision@example.com') && $m->dia === '27');
        $this->assertSame(0, Inscripcion::whereNotNull('recordatorio_enviado_en')->count());
    }
}
