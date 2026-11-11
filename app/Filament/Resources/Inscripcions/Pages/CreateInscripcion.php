<?php

namespace App\Filament\Resources\Inscripcions\Pages;

use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Support\Accesos;
use App\Support\Ajustes;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Pages\CreateRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

// Inscripción hecha por la organización (p. ej. alguien que llega a la sede o pidió ayuda para registrarse).
// Si la inscripción es gratuita no se piden datos de pago: queda confirmada al guardar.
class CreateInscripcion extends CreateRecord
{
    protected static string $resource = InscripcionResource::class;

    protected static ?string $title = 'Inscribir manualmente';

    protected static bool $canCreateAnother = false;

    public function form(Schema $schema): Schema
    {
        $medios = config('congreso.medios_pago') + config('congreso.medios_pago_panel');
        $gratuita = Ajustes::gratuita();

        return $schema->components([
            Section::make('Participante')
                ->description('Escribe primero el DNI: si la persona ya está registrada se completan sus datos.')
                ->columns(2)
                ->schema([
                    TextInput::make('documento')->label('DNI / Pasaporte')->required()
                        ->regex('/^(\d{8}|[A-Za-z0-9]{6,12})$/')->maxLength(12)
                        ->live(onBlur: true)
                        ->afterStateUpdated(function (?string $state, Set $set) {
                            $p = $state ? Participante::where('documento', strtoupper(trim($state)))->first() : null;
                            if ($p) {
                                foreach (['nombres', 'apellidos', 'correo', 'telefono', 'institucion'] as $campo) {
                                    $set($campo, $p->$campo);
                                }
                            }
                        }),
                    TextInput::make('correo')->email()->required()->maxLength(254),
                    TextInput::make('nombres')->required()->maxLength(100),
                    TextInput::make('apellidos')->required()->maxLength(100),
                    TextInput::make('telefono')->label('Celular')->tel()->maxLength(20),
                    TextInput::make('institucion')->label('Institución')->maxLength(200),
                ]),
            Section::make($gratuita ? 'Inscripción' : 'Pago')
                ->columns(2)
                ->schema([
                    Select::make('tipo_participante')->label('Tipo de participante')->required()->live()
                        ->options(collect(config('congreso.tarifas'))->map(fn ($t) => $t['nombre']))
                        ->afterStateUpdated(fn (?string $state, Set $set) => $set('monto', $state ? Inscripcion::montoPara($state) : null)),
                    TextInput::make('monto')->prefix('S/')->numeric()->required()->minValue(0)->hidden($gratuita),
                    Select::make('medio_pago')->label('Medio de pago')->required()->live()->options($medios)->default('efectivo')->hidden($gratuita),
                    TextInput::make('numero_operacion')->label('N.° de operación')->maxLength(30)
                        ->required(fn (Get $get) => $get('medio_pago') !== 'efectivo')
                        ->hidden(fn (Get $get) => $gratuita || $get('medio_pago') === 'efectivo')
                        ->rules(fn (Get $get) => [Rule::unique('inscripciones', 'numero_operacion')->where('medio_pago', $get('medio_pago'))]),
                    FileUpload::make('voucher')->label('Voucher (opcional)')
                        ->disk('local')->directory('vouchers')->visibility('private')
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])->maxSize(5120)
                        ->hidden(fn (Get $get) => $gratuita || $get('medio_pago') === 'efectivo')
                        ->columnSpanFull(),
                    Toggle::make('pagado')->label('El pago ya fue recibido (inscripción validada)')->default(true)->columnSpanFull()->hidden($gratuita),
                    Toggle::make('avisar')->label('Enviar el correo de acceso al Aula virtual (usuario, contraseña temporal y programa)')->default(true)->columnSpanFull(),
                    Checkbox::make('acepta_privacidad')->label('El participante autorizó el uso de sus datos personales para la gestión del congreso')
                        ->accepted()->columnSpanFull(),
                ]),
        ]);
    }

    protected function handleRecordCreation(array $data): Model
    {
        $documento = strtoupper(trim($data['documento']));
        if (Participante::where('documento', $documento)->whereHas('inscripcion')->exists()) {
            throw ValidationException::withMessages(['data.documento' => 'Esta persona ya tiene una inscripción. Búscala en la lista.']);
        }

        $gratuita = Ajustes::gratuita();
        $medio = $gratuita ? null : $data['medio_pago'];
        $pagado = $gratuita || $data['pagado'];

        $inscripcion = DB::transaction(function () use ($data, $documento, $gratuita, $medio, $pagado) {
            $participante = Participante::updateOrCreate(['documento' => $documento], [
                'nombres' => trim($data['nombres']),
                'apellidos' => trim($data['apellidos']),
                'correo' => strtolower(trim($data['correo'])),
                'telefono' => $data['telefono'] ?? null,
                'institucion' => $data['institucion'] ?? null,
            ]);

            return $participante->inscripcion()->create([
                'tipo_participante' => $data['tipo_participante'],
                'monto' => $gratuita ? 0 : $data['monto'],
                'medio_pago' => $medio,
                'numero_operacion' => in_array($medio, [null, 'efectivo'], true) ? null : $data['numero_operacion'],
                'voucher' => in_array($medio, [null, 'efectivo'], true) ? null : ($data['voucher'] ?? null),
                'estado' => $pagado ? 'validada' : 'pendiente',
                'validado_por' => $pagado ? auth()->id() : null,
                'validado_en' => $pagado ? now() : null,
                'acepta_privacidad' => true,
                'origen' => 'panel',
            ]);
        });

        $inscripcion->refresh()->load('participante');
        if ($data['avisar']) {
            Accesos::enviar($inscripcion->participante);
        }

        return $inscripcion;
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return "Inscripción {$this->record->codigo} registrada";
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
