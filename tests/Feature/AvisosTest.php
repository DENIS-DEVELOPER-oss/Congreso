<?php

namespace Tests\Feature;

use App\Filament\Pages\DatosCongreso;
use App\Mail\AvisoPrueba;
use App\Mail\InscripcionRecibida;
use App\Mail\SolicitudRecibida;
use App\Models\Ajuste;
use App\Models\EjeTematico;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

// Avisos a la comisión por cada nueva inscripción: correo (con el resumen del ponente) y WhatsApp (CallMeBot)
class AvisosTest extends TestCase
{
    use RefreshDatabase;

    private const CALLMEBOT = 'https://api.callmebot.com/whatsapp.php*';

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        Storage::fake();
        config([
            'congreso.inscripcion_gratuita' => true,
            'congreso.correo_contacto' => 'comision@example.com',
            'congreso.aviso_correo' => null,
            'congreso.aviso_whatsapp' => '51930805537',
            'congreso.aviso_whatsapp_clave' => '123456',
        ]);
    }

    private function persona(array $cambios = []): array
    {
        return array_merge([
            'nombres' => 'Rosa', 'apellidos' => 'Mamani Quispe', 'documento' => '70123456', 'telefono' => '951913416',
            'correo' => 'rosa@example.com', 'institucion' => 'UNA Puno', 'acepta_privacidad' => '1',
        ], $cambios);
    }

    public function test_solicitud_de_asistente_avisa_por_correo_y_whatsapp(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('Message queued. You will receive it in a few seconds.')]);
        config(['congreso.inscripciones_abiertas' => false]);

        $codigo = $this->postJson('/api/solicitudes', $this->persona(['tipo' => 'asistente', 'tipo_participante' => 'docente']))
            ->assertCreated()->json('codigo');

        Mail::assertSent(SolicitudRecibida::class, fn ($m) => $m->hasTo('comision@example.com'));
        Http::assertSent(function (Request $r) use ($codigo) {
            return str_starts_with($r->url(), 'https://api.callmebot.com/whatsapp.php')
                && $r['phone'] === '+51930805537' && $r['apikey'] === '123456'
                && str_contains($r['text'], $codigo) && str_contains($r['text'], 'Rosa Mamani Quispe')
                && str_contains($r['text'], 'Docente') && str_contains($r['text'], 'por confirmar');
        });
    }

    public function test_solicitud_de_ponente_avisa_con_su_resumen(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('Message queued.')]);
        config(['congreso.inscripciones_abiertas' => false, 'congreso.aviso_correo' => 'avisos@example.com']);
        EjeTematico::create(['titulo' => 'Universidad intercultural', 'orden' => 3]);

        $r = $this->post('/api/solicitudes', $this->persona([
            'tipo' => 'ponente', 'eje' => 3, 'titulo' => 'Saberes aimaras en la universidad',
            'palabras_clave' => 'ayllu; territorio; identidad; Buen Vivir; interculturalidad',
            'archivo' => UploadedFile::fake()->create('resumen.docx', 90),
        ]), ['Accept' => 'application/json'])->assertCreated()->json();

        // Con un correo propio para avisos, ya no se usa el de contacto
        Mail::assertSent(SolicitudRecibida::class, fn ($m) => $m->hasTo('avisos@example.com') && count($m->attachments()) === 1);
        Mail::assertNotSent(SolicitudRecibida::class, fn ($m) => $m->hasTo('comision@example.com'));
        Http::assertSent(fn (Request $q) => str_contains($q['text'], "Resumen {$r['ponencia']} · Eje 3: Saberes aimaras en la universidad"));
    }

    public function test_inscripcion_abierta_tambien_avisa_a_la_comision(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('Message queued.')]);
        config(['congreso.inscripciones_abiertas' => true]);

        $this->postJson('/api/inscripciones', $this->persona(['tipo_participante' => 'estudiante']))->assertCreated();

        Mail::assertSent(SolicitudRecibida::class, fn ($m) => $m->hasTo('comision@example.com')
            && str_contains($m->render(), 'quedó confirmada'));
        Http::assertSentCount(1);
    }

    public function test_sin_clave_de_whatsapp_solo_avisa_por_correo(): void
    {
        Http::fake();
        config(['congreso.inscripciones_abiertas' => false, 'congreso.aviso_whatsapp_clave' => null]);

        $this->postJson('/api/solicitudes', $this->persona(['tipo' => 'asistente', 'tipo_participante' => 'estudiante']))->assertCreated();

        Mail::assertSent(SolicitudRecibida::class);
        Http::assertNothingSent();
    }

    public function test_si_whatsapp_falla_la_inscripcion_igual_se_guarda(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('APIKey is invalid. You need to get a new one.')]);
        config(['congreso.inscripciones_abiertas' => false]);

        $this->postJson('/api/solicitudes', $this->persona(['tipo' => 'asistente', 'tipo_participante' => 'estudiante']))->assertCreated();

        $this->assertDatabaseCount('inscripciones', 1);
        Mail::assertSent(SolicitudRecibida::class);
    }

    public function test_el_admin_guarda_los_avisos_y_envia_una_prueba(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('Message queued.')]);
        $this->actingAs(User::factory()->create(['es_admin' => true]));

        Livewire::test(DatosCongreso::class)
            ->fillForm(['aviso_correo' => 'avisos@example.com', 'aviso_whatsapp' => '51987654321', 'aviso_whatsapp_clave' => '998877'])
            ->call('guardar')
            ->assertHasNoFormErrors()
            ->callAction('probarAvisos')
            ->assertNotified();

        $this->assertSame('998877', Ajuste::where('clave', 'aviso_whatsapp_clave')->value('valor'));
        Mail::assertSent(AvisoPrueba::class, fn ($m) => $m->hasTo('avisos@example.com'));
        Http::assertSent(fn (Request $q) => $q['phone'] === '+51987654321' && $q['apikey'] === '998877');
    }

    public function test_la_persona_inscrita_recibe_su_constancia_con_el_numero_de_consultas(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('Message queued.')]);
        config(['congreso.inscripciones_abiertas' => false, 'congreso.telefono' => '+51 930 805 537', 'congreso.whatsapp' => '51930805537']);

        $codigo = $this->postJson('/api/solicitudes', $this->persona(['tipo' => 'asistente', 'tipo_participante' => 'docente']))
            ->assertCreated()->json('codigo');

        Mail::assertSent(InscripcionRecibida::class, function ($m) use ($codigo) {
            $html = $m->render();

            return $m->hasTo('rosa@example.com') && ! $m->hasTo('comision@example.com')
                && str_contains($html, $codigo) && str_contains($html, '+51 930 805 537')
                && str_contains($html, 'https://wa.me/51930805537') && str_contains($html, 'comision@example.com');
        });
        // La comisión también recibe su aviso, por correo y por WhatsApp
        Mail::assertSent(SolicitudRecibida::class, fn ($m) => $m->hasTo('comision@example.com'));
        Http::assertSentCount(1);
    }

    public function test_si_falla_el_aviso_a_la_comision_la_persona_igual_recibe_su_constancia(): void
    {
        Http::fake([self::CALLMEBOT => Http::response('APIKey is invalid.')]);
        config(['congreso.inscripciones_abiertas' => false]);

        $this->postJson('/api/solicitudes', $this->persona(['tipo' => 'asistente', 'tipo_participante' => 'estudiante']))->assertCreated();

        Mail::assertSent(InscripcionRecibida::class, fn ($m) => $m->hasTo('rosa@example.com'));
    }

    public function test_la_clave_de_whatsapp_no_llega_a_la_pagina(): void
    {
        $this->get('/')->assertOk()->assertDontSee('123456');
    }
}
