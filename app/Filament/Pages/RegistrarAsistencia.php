<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Inscripcions\InscripcionResource;
use App\Models\Asistencia;
use App\Models\Inscripcion;
use App\Models\Sesion;
use App\Support\Ajustes;
use BackedEnum;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use UnitEnum;

// Registro de asistencia en la puerta: se elige ENTRADA (sesión de la mañana) o SALIDA (sesión de la tarde),
// se escribe el DNI (o código o correo) y Enter. También se puede pegar una lista de DNI o correos.
class RegistrarAsistencia extends Page implements HasTable
{
    use InteractsWithTable;

    protected string $view = 'filament.pages.registrar-asistencia';

    protected static ?string $title = 'Registrar asistencia';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQrCode;

    protected static string|UnitEnum|null $navigationGroup = 'Asistencia';

    protected static ?int $navigationSort = 1;

    // sesion_id: sesión elegida · texto: DNI, código o correo · lista: varios a la vez
    public array $data = ['sesion_id' => null, 'texto' => '', 'lista' => ''];

    // Último resultado que se muestra en grande: tipo (ok | ya | confirmado | bloqueado | no_encontrado), nombre, detalle
    public ?array $resultado = null;

    public function mount(): void
    {
        // Por defecto, la sesión de hoy según la hora: la de la mañana (entrada) hasta las 13:30 y luego la de la tarde (salida)
        $hoy = $this->sesionesDeHoy();
        $sesion = (now()->format('H:i') >= '13:30' ? $hoy->last() : $hoy->first())
            ?? Sesion::orderBy('fecha')->orderBy('id')->first();
        $this->data['sesion_id'] = $sesion?->id;
    }

    public function getSubheading(): ?string
    {
        return 'Elija ENTRADA o SALIDA, escriba el DNI y presione Enter.';
    }

    public function sesionesDeHoy(): Collection
    {
        return Sesion::whereDate('fecha', today())->orderBy('hora_inicio')->orderBy('id')->get();
    }

    // Tarjetas de la parte superior: las sesiones de hoy (o, fuera de las fechas del congreso, todas)
    public function tarjetas(): Collection
    {
        $hoy = $this->sesionesDeHoy();
        $lista = $hoy->isNotEmpty() ? $hoy : Sesion::enOrden()->get();

        return $lista->map(fn (Sesion $s) => [
            'id' => $s->id,
            'rol' => $this->rol($s),
            'nombre' => $s->nombre,
            'cuando' => $s->fechaTexto().($s->horarioTexto() ? ' · '.$s->horarioTexto() : ''),
            'registrados' => $s->asistencias()->count(),
        ]);
    }

    // En cada día, la primera sesión es la ENTRADA y la última la SALIDA
    public function rol(Sesion $s): ?string
    {
        return Sesion::roles(Sesion::whereDate('fecha', $s->fecha)->get())[$s->id] ?? null;
    }

    public function otrasSesiones(): Collection
    {
        return Sesion::enOrden()->get()->mapWithKeys(fn (Sesion $s) => [$s->id => $s->nombre.' · '.$s->fecha->format('d/m')]);
    }

    public function sesionActual(): ?Sesion
    {
        return $this->data['sesion_id'] ? Sesion::find($this->data['sesion_id']) : null;
    }

    // Contadores de la sesión elegida
    public function resumen(): array
    {
        $registrados = Asistencia::where('sesion_id', $this->data['sesion_id'] ?? 0)->count();
        $inscritos = Inscripcion::whereIn('estado', ['validada', 'pendiente'])->count();

        return [
            'registrados' => $registrados,
            'inscritos' => $inscritos,
            'faltan' => max($inscritos - $registrados, 0),
            'porcentaje' => $inscritos ? min(100, (int) round($registrados * 100 / $inscritos)) : 0,
        ];
    }

    public function elegirSesion(int $id): void
    {
        $this->data['sesion_id'] = $id;
        $this->resultado = null;
        $this->resetTable();
        $this->dispatch('enfocar-dni');
    }

    public function updatedDataSesionId(): void
    {
        $this->resultado = null;
        $this->resetTable();
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

    // Con inscripción gratuita, quien llega con su solicitud aún pendiente queda confirmado al registrar su asistencia.
    // Las inscripciones anuladas u observadas siguen sin poder registrarse.
    private function admitir(Inscripcion $inscripcion): bool
    {
        if ($inscripcion->estado === 'pendiente' && Ajustes::gratuita()) {
            InscripcionResource::cambiarEstado($inscripcion, 'validada');
        }

        return $inscripcion->estado === 'validada';
    }

    public function registrar(): void
    {
        $sesion = $this->sesionActual();
        if (! $sesion) {
            Notification::make()->title('Primero elija la sesión (ENTRADA o SALIDA)')->warning()->send();

            return;
        }
        if (filled(trim($this->data['lista'] ?? ''))) {
            $this->registrarVarios($sesion);

            return;
        }
        $texto = trim($this->data['texto'] ?? '');
        if ($texto === '') {
            $this->dispatch('enfocar-dni');

            return;
        }

        $inscripcion = $this->buscar($texto);
        $rol = $this->rol($sesion) ?? $sesion->nombre;

        if (! $inscripcion) {
            $this->resultado = ['tipo' => 'no_encontrado', 'nombre' => "No se encontró «{$texto}»",
                'detalle' => 'Revise el número. Si la persona no está inscrita, puede inscribirla en Inscripciones → Inscribir manualmente.'];
        } else {
            $p = $inscripcion->participante;
            $estabaPendiente = $inscripcion->estado === 'pendiente';
            if (! $this->admitir($inscripcion)) {
                $this->resultado = ['tipo' => 'bloqueado', 'nombre' => $p->nombre_completo,
                    'detalle' => 'Su inscripción está '.mb_strtolower(Inscripcion::ESTADOS[$inscripcion->estado] ?? $inscripcion->estado).'. Revísela en Inscripciones antes de registrarla.',
                    'dni' => $p->documento, 'codigo' => $inscripcion->codigo];
            } else {
                $asistencia = Asistencia::firstOrCreate(
                    ['inscripcion_id' => $inscripcion->id, 'sesion_id' => $sesion->id],
                    ['registrado_por' => auth()->id(), 'registrado_en' => now()],
                );
                $this->resultado = $asistencia->wasRecentlyCreated
                    ? ['tipo' => $estabaPendiente ? 'confirmado' : 'ok', 'nombre' => $p->nombre_completo,
                        'detalle' => "{$rol} registrada a las ".$asistencia->registrado_en->format('H:i')
                            .($estabaPendiente ? ' · Su inscripción quedó confirmada.' : ''),
                        'dni' => $p->documento, 'codigo' => $inscripcion->codigo]
                    : ['tipo' => 'ya', 'nombre' => $p->nombre_completo,
                        'detalle' => "Ya tenía registrada su {$rol} a las ".$asistencia->registrado_en->format('H:i').'. No se duplica.',
                        'dni' => $p->documento, 'codigo' => $inscripcion->codigo];
            }
        }

        // Se limpia el campo para la siguiente persona, manteniendo la sesión elegida
        $this->data['texto'] = '';
        $this->dispatch('enfocar-dni');
    }

    // Lista pegada (DNI o correos): registra los admitidos y resume lo que no se pudo
    private function registrarVarios(Sesion $sesion): void
    {
        $valores = collect(preg_split('/[\s,;]+/', $this->data['lista']))->map(fn ($v) => trim($v, " \t\"'"))->filter()->unique();
        $nuevos = $ya = 0;
        $bloqueados = $noEncontrados = [];

        foreach ($valores as $v) {
            $i = $this->buscar($v);
            if (! $i) {
                $noEncontrados[] = $v;
            } elseif (! $this->admitir($i)) {
                $bloqueados[] = $i->participante->nombre_completo;
            } else {
                $a = Asistencia::firstOrCreate(
                    ['inscripcion_id' => $i->id, 'sesion_id' => $sesion->id],
                    ['registrado_por' => auth()->id(), 'registrado_en' => now()],
                );
                $a->wasRecentlyCreated ? $nuevos++ : $ya++;
            }
        }

        $detalle = collect([
            $ya ? "{$ya} ya estaban registrados" : null,
            $bloqueados ? count($bloqueados).' con inscripción anulada u observada: '.implode(', ', array_slice($bloqueados, 0, 5)) : null,
            $noEncontrados ? count($noEncontrados).' no encontrados: '.implode(', ', array_slice($noEncontrados, 0, 5)) : null,
        ])->filter()->implode(' · ');

        Notification::make()->title("Se registraron {$nuevos} asistencias")->body($detalle ?: null)
            ->{($bloqueados || $noEncontrados) ? 'warning' : 'success'}()->persistent()->send();
        $this->data['lista'] = '';
        $this->data['texto'] = '';
        $this->resultado = null;
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
                TextColumn::make('registrado_en')->label('Hora')->time('H:i')->badge()->color('gray'),
                TextColumn::make('inscripcion.participante.nombre_completo')->label('Participante')->weight('bold')
                    ->description(fn (Asistencia $a) => $a->inscripcion->codigo)
                    ->searchable(query: fn ($query, string $search) => $query->whereHas('inscripcion.participante', fn ($p) => $p
                        ->where('nombres', 'like', "%{$search}%")
                        ->orWhere('apellidos', 'like', "%{$search}%")
                        ->orWhere('documento', 'like', "%{$search}%"))),
                TextColumn::make('inscripcion.participante.documento')->label('DNI / Pasaporte'),
                TextColumn::make('registrador.name')->label('Registró')->color('gray')->toggleable(),
            ])
            ->emptyStateHeading('Aún no hay registros en esta sesión')
            ->emptyStateDescription('Escriba un DNI arriba y presione Enter.')
            ->emptyStateIcon(Heroicon::OutlinedIdentification)
            ->paginated([10, 25, 50]);
    }
}
