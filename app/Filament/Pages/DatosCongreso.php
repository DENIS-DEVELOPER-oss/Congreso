<?php

namespace App\Filament\Pages;

use App\Support\Ajustes;
use BackedEnum;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

// Datos reales del congreso que se muestran en la página, los correos y los certificados.
// Solo el administrador puede cambiarlos.
class DatosCongreso extends Page
{
    protected string $view = 'filament.pages.datos-congreso';

    protected static ?string $title = 'Datos del congreso';

    protected static ?string $slug = 'datos-del-congreso';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

    protected static string|UnitEnum|null $navigationGroup = 'Configuración';

    protected static ?int $navigationSort = 1;

    public ?array $data = [];

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->es_admin;
    }

    public function mount(): void
    {
        $this->form->fill(collect(Ajustes::EDITABLES)->mapWithKeys(fn ($clave) => [$clave => config("congreso.$clave")])->all());
    }

    public function form(Schema $schema): Schema
    {
        $tarifa = fn (string $tipo, string $nombre) => Section::make($nombre)->compact()->columns(4)->schema([
            TextInput::make("tarifas.$tipo.titulo")->label('Título en la página')->required(),
            TextInput::make("tarifas.$tipo.detalle")->label('Detalle')->columnSpan(1),
            TextInput::make("tarifas.$tipo.preventa")->label('Preventa')->prefix('S/')->numeric()->minValue(0)->required(),
            TextInput::make("tarifas.$tipo.regular")->label('Regular')->prefix('S/')->numeric()->minValue(0)->required(),
        ]);

        return $schema
            ->statePath('data')
            ->components([
                Tabs::make()->persistTabInQueryString()->tabs([
                    Tab::make('Inscripción y pagos')->icon(Heroicon::OutlinedBanknotes)->schema([
                        Toggle::make('inscripciones_abiertas')->label('Inscripciones abiertas al público')
                            ->helperText('Desactivado: el formulario de la página muestra «Inscripciones muy pronto». Mientras tanto, si inicias sesión en este panel, puedes probar el formulario en /inscripcion.'),
                        Toggle::make('inscripcion_gratuita')->label('La inscripción es gratuita')
                            ->helperText('Activado: al registrarse la inscripción queda confirmada, sin pago ni voucher, y no se muestran montos. Desactivado: se usan las tarifas y medios de pago de abajo.'),
                        $tarifa('estudiante', 'Estudiantes'),
                        $tarifa('docente', 'Docentes'),
                        $tarifa('profesional', 'Profesionales'),
                        $tarifa('ponente', 'Ponentes'),
                        DatePicker::make('fecha_preventa_fin')->label('Último día de la tarifa de preventa')
                            ->native(false)->displayFormat('d/m/Y')
                            ->helperText('Déjalo vacío si no hay preventa: se cobra siempre la tarifa regular.'),
                        Repeater::make('medios_pago_detalle')->label('Medios de pago')
                            ->helperText('Revisa bien los números: es a donde los participantes enviarán su dinero.')
                            ->columns(2)->reorderable()->minItems(1)
                            ->itemLabel(fn (array $state) => $state['nombre'] ?? null)
                            ->schema([
                                TextInput::make('nombre')->required()->placeholder('Yape'),
                                TextInput::make('id')->label('Código interno')->required()->alphaDash()->maxLength(20)
                                    ->helperText('Corto y sin espacios (yape, bn, cci). No lo cambies si ya hay inscripciones con este medio.'),
                                TextInput::make('etiqueta')->required()->placeholder('Número / Cuenta corriente / CCI'),
                                TextInput::make('dato')->label('Número o cuenta')->required(),
                                TextInput::make('titular')->required()->columnSpanFull(),
                            ]),
                    ]),

                    Tab::make('Contacto y fechas')->icon(Heroicon::OutlinedPhone)->schema([
                        Grid::make(3)->schema([
                            TextInput::make('correo_contacto')->label('Correo de contacto')->email()->required(),
                            TextInput::make('telefono')->label('Teléfono')->tel()->placeholder('+51 951 000 000'),
                            TextInput::make('whatsapp')->label('WhatsApp')->placeholder('51951000000')
                                ->helperText('Solo números, con el 51 de Perú adelante.')->regex('/^\d{9,15}$/'),
                        ]),
                        Repeater::make('fechas_importantes')->label('Fechas importantes (portada)')
                            ->columns(3)->reorderable()
                            ->itemLabel(fn (array $state) => $state['texto'] ?? null)
                            ->schema([
                                DatePicker::make('fecha')->required()->native(false)->displayFormat('d/m/Y'),
                                TextInput::make('texto')->required()->columnSpan(2)->placeholder('Cierre de envío de resúmenes'),
                            ]),
                    ]),

                    Tab::make('Aula virtual')->icon(Heroicon::OutlinedVideoCamera)->schema([
                        Toggle::make('zoom_solo_con_pago')->label('Mostrar los enlaces de las sesiones solo a quienes tienen el pago validado')
                            ->helperText('Los enlaces y horarios de cada sesión se cargan en Asistencia → Sesiones.'),
                    ]),

                    Tab::make('Certificados')->icon(Heroicon::OutlinedTrophy)->schema([
                        Grid::make(5)->schema([
                            TextInput::make('porcentaje_asistencia')->label('% de asistencia mínima')->numeric()->suffix('%')
                                ->minValue(1)->maxValue(100)->required(),
                            TextInput::make('horas.asistente')->label('Horas: asistente')->numeric()->required(),
                            TextInput::make('horas.ponente')->label('Horas: ponente')->numeric()->required(),
                            TextInput::make('horas.organizador')->label('Horas: organizador')->numeric()->required(),
                            TextInput::make('horas.comite')->label('Horas: comité')->numeric()->required(),
                        ]),
                        Repeater::make('firmantes')->label('Firmas del certificado')
                            ->columns(3)->minItems(1)->maxItems(3)
                            ->itemLabel(fn (array $state) => $state['cargo'] ?? null)
                            ->schema([
                                TextInput::make('nombre')->placeholder('Dr. Nombre Apellido'),
                                TextInput::make('cargo')->required()->columnSpan(2),
                                FileUpload::make('firma')->label('Imagen de la firma (PNG con fondo transparente)')
                                    ->image()->disk('local')->directory('firmas')->visibility('private')
                                    ->maxSize(1024)->columnSpanFull(),
                            ]),
                    ]),
                ]),
            ]);
    }

    public function guardar(): void
    {
        Ajustes::guardar($this->form->getState());
        Notification::make()->title('Datos guardados')->body('La página, los correos y los certificados ya usan los nuevos datos.')->success()->send();
    }
}
