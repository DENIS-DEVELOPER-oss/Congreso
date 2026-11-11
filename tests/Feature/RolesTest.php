<?php

namespace Tests\Feature;

use App\Filament\Pages\DatosCongreso;
use App\Filament\Pages\RegistrarAsistencia;
use App\Filament\Resources\Certificados\CertificadoResource;
use App\Filament\Resources\Certificados\Pages\ListCertificados;
use App\Filament\Resources\EjeTematicos\EjeTematicoResource;
use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Filament\Resources\Inscripcions\Pages\CreateInscripcion;
use App\Filament\Resources\Participantes\ParticipanteResource;
use App\Filament\Resources\Ponencias\Pages\ListPonencias;
use App\Filament\Resources\Ponencias\PonenciaResource;
use App\Filament\Resources\PonentesCentrales\PonenteCentralResource;
use App\Filament\Resources\Sesions\SesionResource;
use App\Filament\Resources\Users\Pages\ManageUsers;
use App\Filament\Resources\Users\UserResource;
use App\Mail\AccesoAula;
use App\Mail\AccesoPanel;
use App\Mail\CertificadoListo;
use App\Mail\PonenciaRecibida;
use App\Mail\ResultadoPonencia;
use App\Models\Ajuste;
use App\Models\Asistencia;
use App\Models\Certificado;
use App\Models\EjeTematico;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Ponencia;
use App\Models\Sesion;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

// Lo que hace cada rol durante el congreso: administrador, organizador y participante (Aula virtual).
class RolesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        Storage::fake('local');
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        config(['congreso.inscripcion_gratuita' => true, 'congreso.inscripciones_abiertas' => true]);
    }

    private function admin(): User
    {
        return User::factory()->create(['es_admin' => true]);
    }

    private function organizador(): User
    {
        return User::factory()->create(['es_admin' => false]);
    }

    private function inscrito(string $documento = '70123456', string $correo = 'rosa@example.com'): Inscripcion
    {
        $p = Participante::create([
            'documento' => $documento, 'nombres' => 'Rosa', 'apellidos' => 'Mamani Quispe',
            'correo' => $correo, 'telefono' => '951913416',
        ]);

        return $p->inscripcion()->create(['tipo_participante' => 'estudiante', 'monto' => 0, 'estado' => 'validada', 'acepta_privacidad' => true])->refresh();
    }

    private function ponencia(Participante $autor, string $estado = 'recibida'): Ponencia
    {
        $eje = EjeTematico::firstOrCreate(['titulo' => 'Interculturalidad y educación superior'], ['orden' => 1]);

        return $autor->ponencias()->create([
            'titulo' => 'Saberes andinos en la universidad', 'eje_id' => $eje->id, 'modalidad' => 'presencial',
            'palabras_clave' => 'a, b, c, d, e', 'archivo' => 'ponencias/prueba.pdf', 'estado' => $estado,
        ])->refresh();
    }

    // ---------------- Administrador ----------------

    public function test_admin_crea_un_organizador_que_luego_puede_ingresar(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(ManageUsers::class)
            ->callAction('create', data: [
                'name' => 'Lucía Condori', 'email' => 'lucia@example.com', 'password' => 'Organiza2026',
                'es_admin' => '0', 'enviar_acceso' => true,
            ])
            ->assertHasNoActionErrors();

        $lucia = User::where('email', 'lucia@example.com')->firstOrFail();
        $this->assertFalse($lucia->es_admin);
        Mail::assertSent(AccesoPanel::class, fn ($m) => $m->hasTo('lucia@example.com') && $m->clave === 'Organiza2026');
        $this->assertTrue(Auth::guard('web')->validate(['email' => 'lucia@example.com', 'password' => 'Organiza2026']));
    }

    public function test_admin_abre_las_inscripciones_desde_datos_del_congreso(): void
    {
        config(['congreso.inscripciones_abiertas' => false]);
        $this->actingAs($this->admin());

        Livewire::test(DatosCongreso::class)
            ->fillForm(['inscripciones_abiertas' => true])
            ->call('guardar')
            ->assertHasNoFormErrors();

        $this->assertTrue((bool) Ajuste::where('clave', 'inscripciones_abiertas')->value('valor'));
        $this->assertTrue((bool) config('congreso.inscripciones_abiertas'));
    }

    public function test_solo_el_admin_puede_borrar_registros(): void
    {
        $inscripcion = $this->inscrito();

        $this->actingAs($this->organizador());
        $this->assertFalse(InscripcionResource::canDelete($inscripcion));
        $this->assertFalse(ParticipanteResource::canDeleteAny());

        $this->actingAs($this->admin());
        $this->assertTrue(InscripcionResource::canDelete($inscripcion));
    }

    public function test_el_unico_admin_no_puede_quitarse_el_rol(): void
    {
        $admin = $this->admin();
        $this->assertTrue(UserResource::esUltimoAdmin($admin));
        $this->admin();
        $this->assertFalse(UserResource::esUltimoAdmin($admin));
    }

    // ---------------- Organizador ----------------

    public function test_el_organizador_abre_todos_sus_modulos(): void
    {
        $inscripcion = $this->inscrito();
        $ponencia = $this->ponencia($inscripcion->participante);
        $this->actingAs($this->organizador());

        $urls = [
            Filament::getUrl(),
            InscripcionResource::getUrl('index'), InscripcionResource::getUrl('create'), InscripcionResource::getUrl('edit', ['record' => $inscripcion]),
            ParticipanteResource::getUrl('index'), ParticipanteResource::getUrl('edit', ['record' => $inscripcion->participante]),
            PonenciaResource::getUrl('index'), PonenciaResource::getUrl('edit', ['record' => $ponencia]),
            PonenteCentralResource::getUrl('index'), EjeTematicoResource::getUrl('index'),
            SesionResource::getUrl('index'), RegistrarAsistencia::getUrl(),
            CertificadoResource::getUrl('index'), CertificadoResource::getUrl('create'),
            Filament::getProfileUrl(),
        ];
        foreach ($urls as $url) {
            $this->get($url)->assertOk();
        }
        $this->get(route('archivos.ponencia', $ponencia))->assertNotFound(); // con sesión entra; el archivo de prueba no existe
    }

    public function test_el_organizador_inscribe_a_alguien_en_la_sede_sin_datos_de_pago(): void
    {
        $this->actingAs($this->organizador());

        Livewire::test(CreateInscripcion::class)
            ->assertFormFieldIsHidden('medio_pago')
            ->assertFormFieldIsHidden('monto')
            ->fillForm([
                'documento' => '40111222', 'correo' => 'Juan@Example.com', 'nombres' => 'Juan', 'apellidos' => 'Pérez Choque',
                'tipo_participante' => 'docente', 'avisar' => true, 'acepta_privacidad' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $i = Inscripcion::firstOrFail();
        $this->assertSame('validada', $i->estado);
        $this->assertEquals(0, $i->monto);
        $this->assertNull($i->medio_pago);
        $this->assertSame('juan@example.com', $i->participante->correo);
        Mail::assertSent(AccesoAula::class, fn ($m) => $m->hasTo('juan@example.com'));
    }

    public function test_el_organizador_dictamina_un_resumen(): void
    {
        $ponencia = $this->ponencia($this->inscrito()->participante);
        $this->actingAs($this->organizador());

        // Observar sin comentario no se permite
        Livewire::test(ListPonencias::class)
            ->callTableAction('dictamen', $ponencia, data: ['estado' => 'observada', 'observacion' => null])
            ->assertHasTableActionErrors(['observacion' => 'required']);

        Livewire::test(ListPonencias::class)
            ->callTableAction('dictamen', $ponencia, data: ['estado' => 'observada', 'observacion' => 'Ajusta el resumen a 250 palabras.'])
            ->assertHasNoTableActionErrors();

        $this->assertSame('observada', $ponencia->refresh()->estado);
        Mail::assertSent(ResultadoPonencia::class, fn ($m) => $m->hasTo('rosa@example.com'));
    }

    public function test_el_organizador_registra_asistencia_emite_y_envia_certificados(): void
    {
        $inscripcion = $this->inscrito();
        $otro = $this->inscrito('70999888', 'otro@example.com');
        $this->ponencia($inscripcion->participante, 'aceptada');
        $sesion = Sesion::create(['nombre' => 'Día 1', 'fecha' => '2026-11-26', 'hora_inicio' => '09:00', 'enlace' => 'https://meet.google.com/abc-defg-hij']);
        $this->actingAs($this->organizador());

        // Uno por uno (DNI) y varios a la vez (lista de correos del reporte de Meet)
        Livewire::test(RegistrarAsistencia::class)
            ->fillForm(['sesion_id' => $sesion->id, 'texto' => '70123456'])
            ->call('registrar')
            ->fillForm(['sesion_id' => $sesion->id, 'lista' => "otro@example.com\nnoexiste@example.com"])
            ->call('registrar');
        $this->assertSame(2, Asistencia::count());

        Livewire::test(ListCertificados::class)
            ->callAction('emitirAsistentes')
            ->callAction('emitirPonentes')
            ->callAction('enviarPendientes');

        $this->assertSame(2, Certificado::where('tipo', 'asistente')->count());
        $this->assertSame(1, Certificado::where('tipo', 'ponente')->count());
        $this->assertSame(0, Certificado::whereNull('enviado_en')->count());
        Mail::assertSent(CertificadoListo::class, 3);

        // El participante descarga su certificado y cualquiera puede verificarlo con el código del QR
        $c = Certificado::where('participante_id', $otro->participante_id)->firstOrFail();
        $this->get($c->url())->assertOk()->assertHeader('content-type', 'application/pdf');
        $this->get(route('certificados.verificar', strtolower($c->codigo_verificacion)))->assertOk()->assertSee('Rosa Mamani Quispe');
    }

    // ---------------- Participante (Aula virtual) ----------------

    public function test_recorrido_completo_del_participante(): void
    {
        $eje = EjeTematico::create(['titulo' => 'Buen Vivir', 'orden' => 1]);
        Sesion::create(['nombre' => 'Día 1', 'fecha' => '2026-11-26', 'hora_inicio' => '09:00', 'enlace' => 'https://meet.google.com/abc-defg-hij']);

        // 1. Se inscribe y recibe su contraseña temporal
        $this->postJson('/api/inscripciones', [
            'nombres' => 'Rosa', 'apellidos' => 'Mamani', 'documento' => '70123456', 'telefono' => '951913416',
            'correo' => 'rosa@example.com', 'tipo_participante' => 'estudiante', 'acepta_privacidad' => true,
        ])->assertCreated();
        $clave = null;
        Mail::assertSent(AccesoAula::class, function ($m) use (&$clave) {
            $clave = $m->clave;

            return true;
        });

        // 2. Entra con su DNI y crea su contraseña personal
        $this->postJson('/cuenta/ingresar', ['usuario' => '70123456', 'password' => $clave])
            ->assertOk()->assertJsonPath('participante.debeCambiarClave', true);
        $this->postJson('/cuenta/clave', ['nueva' => 'MiClave2026', 'nueva_confirmation' => 'MiClave2026'])->assertOk();

        // 3. Ve el enlace de Google Meet (congreso gratuito) y confirma su nombre para el certificado
        $this->getJson('/cuenta/yo')
            ->assertJsonPath('sesiones.0.enlace', 'https://meet.google.com/abc-defg-hij')
            ->assertJsonPath('participante.debeCambiarClave', false);
        $this->postJson('/cuenta/perfil', ['nombres' => 'Rosa Elena', 'apellidos' => 'Mamani Quispe', 'institucion' => 'UNA Puno'])
            ->assertOk()->assertJsonPath('participante.nombreConfirmado', true);

        // 4. Envía su resumen (5 palabras clave exactas)
        $resumen = fn () => UploadedFile::fake()->create('resumen.pdf', 200, 'application/pdf');
        $datos = ['titulo' => 'Saberes andinos en la universidad', 'eje' => $eje->id, 'modalidad' => 'presencial', 'palabras_clave' => 'uno, dos, tres'];
        $this->postJson('/cuenta/ponencias', $datos + ['archivo' => $resumen()])->assertUnprocessable()->assertJsonValidationErrors('palabras_clave');
        $codigo = $this->postJson('/cuenta/ponencias', ['palabras_clave' => 'uno, dos, tres, cuatro, cinco', 'archivo' => $resumen()] + $datos)
            ->assertCreated()->json('codigo');
        Mail::assertSent(PonenciaRecibida::class);

        // 5. Solo puede reenviar un resumen observado
        $this->postJson("/cuenta/ponencias/{$codigo}/corregir", ['archivo' => $resumen()])->assertUnprocessable();
        Ponencia::where('codigo', $codigo)->update(['estado' => 'observada', 'observacion' => 'Corregir']);
        $this->postJson("/cuenta/ponencias/{$codigo}/corregir", ['archivo' => $resumen()])
            ->assertOk()->assertJsonPath('ponencias.0.estado', 'recibida');

        // 6. Con el certificado emitido, el nombre ya no se cambia y el certificado aparece en el Aula
        Certificado::create(['participante_id' => Participante::first()->id, 'tipo' => 'asistente']);
        $this->postJson('/cuenta/perfil', ['nombres' => 'Otra', 'apellidos' => 'Persona'])->assertUnprocessable();
        $this->getJson('/cuenta/yo')->assertJsonCount(1, 'certificados')->assertJsonPath('participante.puedeEditarNombre', false);

        // 7. Sale y vuelve a entrar con su correo y su contraseña nueva
        $this->postJson('/cuenta/salir')->assertOk();
        $this->postJson('/cuenta/ingresar', ['usuario' => 'rosa@example.com', 'password' => 'MiClave2026'])->assertOk();
    }

    public function test_un_participante_no_toca_el_resumen_de_otro(): void
    {
        $ajeno = $this->ponencia($this->inscrito()->participante, 'observada');
        $yo = $this->inscrito('70999888', 'otro@example.com')->participante;

        $this->actingAs($yo, 'participante')
            ->postJson("/cuenta/ponencias/{$ajeno->codigo}/corregir", ['archivo' => UploadedFile::fake()->create('r.pdf', 10, 'application/pdf')])
            ->assertNotFound();
        $this->actingAs($yo, 'participante')->get('/admin')->assertRedirect(); // el participante no entra al panel
    }
}
