<?php

namespace Tests\Feature;

use App\Mail\AccesoAula;
use App\Models\Participante;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

// Flujos esenciales del congreso: páginas, inscripción, Aula virtual y permisos del panel.
// Se ejecutan con: php artisan test
class CongresoTest extends TestCase
{
    use RefreshDatabase;

    private function datosInscripcion(array $cambios = []): array
    {
        return array_merge([
            'nombres' => 'Rosa',
            'apellidos' => 'Mamani Quispe',
            'documento' => '70123456',
            'telefono' => '951913416',
            'correo' => 'rosa.mamani@example.com',
            'institucion' => 'UNA Puno',
            'tipo_participante' => 'estudiante',
            'acepta_privacidad' => true,
        ], $cambios);
    }

    private function usuarioPanel(bool $admin): User
    {
        return User::factory()->create(['es_admin' => $admin]);
    }

    public function test_las_paginas_publicas_cargan(): void
    {
        foreach (['/', '/inscripcion', '/aula', '/api/ejes'] as $ruta) {
            $this->get($ruta)->assertOk();
        }
        $this->get('/mi-cuenta')->assertRedirect('/aula');
    }

    public function test_con_inscripciones_cerradas_el_publico_no_puede_registrarse(): void
    {
        config(['congreso.inscripciones_abiertas' => false]);

        $this->postJson('/api/inscripciones', $this->datosInscripcion())->assertForbidden();
        $this->assertDatabaseCount('participantes', 0);
    }

    public function test_un_organizador_puede_probar_el_formulario_cerrado(): void
    {
        Mail::fake();
        config(['congreso.inscripciones_abiertas' => false]);

        $this->actingAs($this->usuarioPanel(false))
            ->postJson('/api/inscripciones', $this->datosInscripcion())
            ->assertCreated()
            ->assertJsonStructure(['codigo']);

        Mail::assertSent(AccesoAula::class, fn ($m) => $m->hasTo('rosa.mamani@example.com'));
    }

    public function test_inscripcion_abierta_gratuita_queda_validada_y_envia_el_acceso(): void
    {
        Mail::fake();
        config(['congreso.inscripciones_abiertas' => true, 'congreso.inscripcion_gratuita' => true]);

        $codigo = $this->postJson('/api/inscripciones', $this->datosInscripcion())->assertCreated()->json('codigo');

        $this->assertMatchesRegularExpression('/^[A-Z]+-\d{4}-\d{4}$/', $codigo);
        $this->assertDatabaseHas('inscripciones', ['codigo' => $codigo, 'estado' => 'validada', 'monto' => 0]);
        Mail::assertSent(AccesoAula::class);
        $this->assertTrue(Participante::first()->tieneAcceso(), 'La contraseña temporal se guarda tras enviar el correo');

        // El mismo DNI no se registra dos veces
        $this->postJson('/api/inscripciones', $this->datosInscripcion(['correo' => 'otro@example.com']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('documento');
    }

    public function test_el_participante_ingresa_al_aula_con_dni_o_correo(): void
    {
        $p = Participante::create($this->datosInscripcion(['documento' => '70999888']));
        $p->forceFill(['password' => 'clave-temporal', 'debe_cambiar_clave' => true])->save();

        $this->postJson('/cuenta/ingresar', ['usuario' => '70999888', 'password' => 'mala'])
            ->assertUnprocessable();

        $this->postJson('/cuenta/ingresar', ['usuario' => 'ROSA.MAMANI@example.com', 'password' => 'clave-temporal'])
            ->assertOk()
            ->assertJsonPath('participante.documento', '70999888')
            ->assertJsonPath('participante.debeCambiarClave', true);

        $this->getJson('/cuenta/yo')->assertOk()->assertJsonStructure(['participante', 'sesiones', 'ponencias', 'certificados', 'ejes']);
    }

    public function test_el_aula_exige_sesion(): void
    {
        $this->getJson('/cuenta/yo')->assertUnauthorized();
    }

    public function test_solo_el_administrador_gestiona_usuarios_y_datos_del_congreso(): void
    {
        $organizador = $this->usuarioPanel(false);
        $this->actingAs($organizador)->get('/admin')->assertOk();
        $this->actingAs($organizador)->get('/admin/usuarios')->assertForbidden();
        $this->actingAs($organizador)->get('/admin/datos-del-congreso')->assertForbidden();

        $admin = $this->usuarioPanel(true);
        $this->actingAs($admin)->get('/admin/usuarios')->assertOk()->assertSee('Nuevo usuario');
        $this->actingAs($admin)->get('/admin/datos-del-congreso')->assertOk();
    }

    public function test_archivos_privados_e_instalador_no_son_publicos(): void
    {
        $this->get('/archivos/voucher/1')->assertRedirect();
        $this->get('/archivos/ponencia/1')->assertRedirect();

        config(['congreso.instalador_clave' => '']);
        $this->get('/api/instalar?clave=cualquiera')->assertNotFound();
    }
}
