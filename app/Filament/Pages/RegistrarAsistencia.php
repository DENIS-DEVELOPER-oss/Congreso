<?php

namespace App\Filament\Pages;

use App\Models\Asistencia;
use App\Models\Inscripcion;
use App\Models\Sesion;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

// Registro de asistencia de las sesiones por Google Meet: uno por uno (código, DNI o correo)
// o varios a la vez pegando la lista del reporte de asistentes de Google Meet
class RegistrarAsistencia extends Page implements HasTable
{
    use InteractsWithTable;

    protected string $view = 'filament.pages.registrar-asistencia';

    protected static ?string $title = 'Registrar asistencia';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQrCode;

    protected static string|UnitEnum|null $navigationGroup = 'Asistencia';

    protected static ?int $navigationSort = 1;

    public ?array $data = [];

    public function mount(): void
    {
        // Por defecto, la primera sesión de hoy (o la primera del congreso)
        $sesion = Sesion::whereDate('fecha', today())->orderBy('id')->first() ?? Sesion::orderBy('fecha')->orderBy('id')->first();
        $this->form->fill(['sesion_id' => $sesion?->id]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Grid::make(3)->schema([
                    Select::make('sesion_id')->label('Sesión')->required()->live()
                        ->options(fn () => Sesion::orderBy('fecha')->orderBy('id')->get()
                            ->mapWithKeys(fn (Sesion $s) => [$s->id => $s->nombre.' · '.$s->fecha->format('d/m').($s->titulo ? ' · '.$s->titulo : '')]))
                        ->helperText(fn () => Sesion::exists() ? null : 'Primero crea las sesiones en Asistencia → Sesiones.'),
                    TextInput::make('texto')->label('Código, DNI o correo de un participante')->autofocus()
                        ->placeholder('SA-2026-0001, 70123456 o nombre@correo.com')
                        ->autocomplete(false)
                        ->columnSpan(2),
                ]),
                Textarea::make('lista')->label('Registrar varios a la vez')->rows(4)
                    ->placeholder("Pega aquí los DNI o correos del reporte de asistentes de Google Meet,\nuno por línea o separados por comas")
                    ->helperText('Se registran solo las inscripciones confirmadas (validadas); al terminar verás el resumen.'),
            ]);
    }

    // Busca una inscripción por código, DNI/pasaporte o correo
    private function buscar(string $texto): ?Inscripcion
    {
        $texto = trim($texto);
        if (str_contains($texto, '@')) {
            return Inscripcion::with('participante')
                ->whereHas('participante', fn ($q) => $q->whereRaw('LOWER(correo) = ?', [strtolower($texto)]))->first();
        }
        $texto = strtoupper($texto);

        return Inscripcion::with('participante')
            ->where('codigo', $texto)
            ->orWhereHas('participante', fn ($q) => $q->where('documento', $texto))
            ->first();
    }

    public function registrar(): void
    {
        $datos = $this->form->getState();
        if (filled($datos['lista'] ?? null)) {
            $this->registrarVarios($datos);

            return;
        }
        if (blank($datos['texto'] ?? null)) {
            Notification::make()->title('Escribe un código, DNI o correo, o pega una lista')->warning()->send();

            return;
        }
        $texto = trim($datos['texto']);
        $inscripcion = $this->buscar($texto);

        if (! $inscripcion) {
            Notification::make()->title("No hay ninguna inscripción con «{$texto}»")->danger()->send();
        } elseif ($inscripcion->estado !== 'validada') {
            Notification::make()->title($inscripcion->participante->nombre_completo)
                ->body('Su inscripción no está validada (estado: '.Inscripcion::ESTADOS[$inscripcion->estado].'). Revísala en Inscripciones.')
                ->warning()->send();
        } else {
            $asistencia = Asistencia::firstOrCreate(
                ['inscripcion_id' => $inscripcion->id, 'sesion_id' => $datos['sesion_id']],
                ['registrado_por' => auth()->id(), 'registrado_en' => now()],
            );
            $asistencia->wasRecentlyCreated
                ? Notification::make()->title('Asistencia registrada')->body($inscripcion->participante->nombre_completo)->success()->send()
                : Notification::make()->title('Ya estaba registrado en esta sesión')
                    ->body($inscripcion->participante->nombre_completo.' · '.$asistencia->registrado_en->format('H:i'))->info()->send();
        }

        // Se limpia el campo para el siguiente participante, manteniendo la sesión elegida
        $this->form->fill(['sesion_id' => $datos['sesion_id'], 'texto' => null, 'lista' => null]);
    }

    // Lista pegada (DNI o correos): registra los validados y resume lo que no se pudo
    private function registrarVarios(array $datos): void
    {
        $valores = collect(preg_split('/[\s,;]+/', $datos['lista']))->map(fn ($v) => trim($v, " \t\"'"))->filter()->unique();
        $nuevos = $ya = 0;
        $sinPago = $noEncontrados = [];

        foreach ($valores as $v) {
            $i = $this->buscar($v);
            if (! $i) {
                $noEncontrados[] = $v;
            } elseif ($i->estado !== 'validada') {
                $sinPago[] = $i->participante->nombre_completo;
            } else {
                $a = Asistencia::firstOrCreate(
                    ['inscripcion_id' => $i->id, 'sesion_id' => $datos['sesion_id']],
                    ['registrado_por' => auth()->id(), 'registrado_en' => now()],
                );
                $a->wasRecentlyCreated ? $nuevos++ : $ya++;
            }
        }

        $detalle = collect([
            $ya ? "{$ya} ya estaban registrados" : null,
            $sinPago ? count($sinPago).' sin inscripción validada: '.implode(', ', array_slice($sinPago, 0, 5)) : null,
            $noEncontrados ? count($noEncontrados).' no encontrados: '.implode(', ', array_slice($noEncontrados, 0, 5)) : null,
        ])->filter()->implode(' · ');

        Notification::make()->title("Se registraron {$nuevos} asistencias")->body($detalle ?: null)
            ->{($sinPago || $noEncontrados) ? 'warning' : 'success'}()->persistent()->send();
        $this->form->fill(['sesion_id' => $datos['sesion_id'], 'texto' => null, 'lista' => null]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->heading('Registrados en esta sesión')
            ->query(fn () => Asistencia::query()
                ->with('inscripcion.participante', 'registrador')
                ->where('sesion_id', $this->data['sesion_id'] ?? 0))
            ->defaultSort('registrado_en', 'desc')
            ->columns([
                TextColumn::make('registrado_en')->label('Hora')->time('H:i'),
                TextColumn::make('inscripcion.codigo')->label('Código'),
                TextColumn::make('inscripcion.participante.nombre_completo')->label('Participante'),
                TextColumn::make('inscripcion.participante.documento')->label('DNI / Pasaporte'),
                TextColumn::make('registrador.name')->label('Registró'),
            ])
            ->paginated([10, 25, 50]);
    }
}
