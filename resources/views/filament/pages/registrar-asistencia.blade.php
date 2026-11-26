@php
    $tarjetas = $this->tarjetas();
    $actual = $this->sesionActual();
    $rolActual = $actual ? $this->rol($actual) : null;
    $resumen = $this->resumen();
    $r = $resultado;
    $estilos = [
        'ok' => ['clase' => 'ra-ok', 'icono' => 'heroicon-s-check-circle', 'titulo' => 'Registrado'],
        'confirmado' => ['clase' => 'ra-ok', 'icono' => 'heroicon-s-check-badge', 'titulo' => 'Registrado y confirmado'],
        'ya' => ['clase' => 'ra-info', 'icono' => 'heroicon-s-information-circle', 'titulo' => 'Ya estaba registrado'],
        'bloqueado' => ['clase' => 'ra-warn', 'icono' => 'heroicon-s-exclamation-triangle', 'titulo' => 'No se puede registrar'],
        'no_encontrado' => ['clase' => 'ra-error', 'icono' => 'heroicon-s-x-circle', 'titulo' => 'No encontrado'],
    ];
@endphp

<x-filament-panels::page>
    <style>
        .ra { --ra-borde: #e5e7eb; --ra-fondo: #ffffff; --ra-suave: #f8fafc; --ra-texto: #0f172a; --ra-tenue: #64748b;
              --ra-entrada: #16a34a; --ra-entrada-bg: #f0fdf4; --ra-salida: #ea580c; --ra-salida-bg: #fff7ed; }
        .dark .ra { --ra-borde: rgba(255,255,255,.1); --ra-fondo: rgba(255,255,255,.04); --ra-suave: rgba(255,255,255,.03); --ra-texto: #f1f5f9; --ra-tenue: #94a3b8;
              --ra-entrada-bg: rgba(22,163,74,.12); --ra-salida-bg: rgba(234,88,12,.12); }
        .ra { display: grid; gap: 1.25rem; color: var(--ra-texto); }
        .ra-tarjetas { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
        .ra-tarjeta { text-align: left; border: 2px solid var(--ra-borde); background: var(--ra-fondo); border-radius: 14px; padding: 1rem 1.1rem;
              cursor: pointer; transition: border-color .15s, box-shadow .15s, transform .05s; display: grid; gap: .35rem; }
        .ra-tarjeta:hover { border-color: var(--ra-tenue); }
        .ra-tarjeta:active { transform: scale(.99); }
        .ra-tarjeta.is-entrada.is-activa { border-color: var(--ra-entrada); background: var(--ra-entrada-bg); box-shadow: 0 0 0 4px rgba(22,163,74,.15); }
        .ra-tarjeta.is-salida.is-activa { border-color: var(--ra-salida); background: var(--ra-salida-bg); box-shadow: 0 0 0 4px rgba(234,88,12,.15); }
        .ra-tarjeta.is-otra.is-activa { border-color: var(--primary-600); box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary-600) 18%, transparent); }
        .ra-rol { font-size: .8rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; display: flex; align-items: center; gap: .4rem; }
        .is-entrada .ra-rol { color: var(--ra-entrada); } .is-salida .ra-rol { color: var(--ra-salida); } .is-otra .ra-rol { color: var(--primary-600); }
        .ra-tarjeta-nombre { font-size: 1.05rem; font-weight: 700; }
        .ra-tenue { color: var(--ra-tenue); font-size: .85rem; }
        .ra-check { margin-left: auto; width: 1.35rem; height: 1.35rem; }

        .ra-caja { border: 1px solid var(--ra-borde); background: var(--ra-fondo); border-radius: 16px; padding: 1.25rem; }
        .ra-etiqueta { display: block; font-weight: 600; margin-bottom: .5rem; }
        .ra-fila { display: flex; gap: .75rem; flex-wrap: wrap; }
        .ra-dni { flex: 1 1 260px; min-width: 0; font-size: 1.9rem; font-weight: 700; letter-spacing: .08em; padding: .7rem 1rem; border-radius: 12px;
              border: 2px solid var(--ra-borde); background: var(--ra-suave); color: var(--ra-texto); outline: none; }
        .ra-dni:focus { border-color: var(--primary-600); box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary-600) 20%, transparent); }
        .ra-dni::placeholder { font-size: 1.1rem; font-weight: 500; letter-spacing: 0; color: var(--ra-tenue); }
        .ra-boton { flex: 0 0 auto; display: inline-flex; align-items: center; gap: .5rem; font-size: 1.1rem; font-weight: 700; color: #fff;
              border: 0; border-radius: 12px; padding: .9rem 1.5rem; cursor: pointer; background: var(--primary-600); }
        .ra-boton.is-entrada { background: var(--ra-entrada); } .ra-boton.is-salida { background: var(--ra-salida); }
        .ra-boton:hover { filter: brightness(1.08); }
        .ra-boton[disabled] { opacity: .6; cursor: wait; }

        .ra-resultado { margin-top: 1rem; border-radius: 14px; padding: 1rem 1.1rem; display: flex; gap: .9rem; align-items: flex-start; border: 2px solid; }
        .ra-resultado .ra-icono { width: 2.6rem; height: 2.6rem; flex: 0 0 auto; }
        .ra-resultado-titulo { font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .ra-resultado-nombre { font-size: 1.5rem; font-weight: 800; line-height: 1.2; margin: .1rem 0 .25rem; word-break: break-word; }
        .ra-ok { border-color: #16a34a; background: #f0fdf4; } .ra-ok .ra-icono, .ra-ok .ra-resultado-titulo { color: #16a34a; }
        .ra-info { border-color: #2563eb; background: #eff6ff; } .ra-info .ra-icono, .ra-info .ra-resultado-titulo { color: #2563eb; }
        .ra-warn { border-color: #d97706; background: #fffbeb; } .ra-warn .ra-icono, .ra-warn .ra-resultado-titulo { color: #d97706; }
        .ra-error { border-color: #dc2626; background: #fef2f2; } .ra-error .ra-icono, .ra-error .ra-resultado-titulo { color: #dc2626; }
        .dark .ra-ok { background: rgba(22,163,74,.12); } .dark .ra-info { background: rgba(37,99,235,.12); }
        .dark .ra-warn { background: rgba(217,119,6,.12); } .dark .ra-error { background: rgba(220,38,38,.12); }
        .ra-chips { display: flex; gap: .4rem; flex-wrap: wrap; }
        .ra-chip { font-size: .8rem; padding: .15rem .55rem; border-radius: 999px; background: var(--ra-suave); border: 1px solid var(--ra-borde); }

        .ra-cifras { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        .ra-cifra { border: 1px solid var(--ra-borde); background: var(--ra-fondo); border-radius: 14px; padding: .9rem 1rem; }
        .ra-cifra b { display: block; font-size: 1.9rem; line-height: 1.1; font-variant-numeric: tabular-nums; }
        .ra-barra { height: 8px; border-radius: 999px; background: var(--ra-suave); border: 1px solid var(--ra-borde); overflow: hidden; margin-top: .55rem; }
        .ra-barra span { display: block; height: 100%; background: var(--primary-600); border-radius: 999px; transition: width .3s; }

        .ra-varios summary { cursor: pointer; font-weight: 600; list-style: none; display: flex; align-items: center; gap: .5rem; }
        .ra-varios summary::-webkit-details-marker { display: none; }
        .ra-varios textarea { width: 100%; margin-top: .75rem; border-radius: 12px; border: 1px solid var(--ra-borde); background: var(--ra-suave);
              color: var(--ra-texto); padding: .75rem; font-family: ui-monospace, monospace; }
        .ra-select { border-radius: 10px; border: 1px solid var(--ra-borde); background: var(--ra-suave); color: var(--ra-texto); padding: .4rem .6rem; max-width: 100%; }
        @media (max-width: 640px) { .ra-dni { font-size: 1.5rem; } .ra-boton { width: 100%; justify-content: center; } }
    </style>

    <div class="ra" x-data x-on:enfocar-dni.window="$nextTick(() => $refs.dni?.focus())">

        {{-- 1. ¿Qué se registra? --}}
        @if ($tarjetas->isEmpty())
            <div class="ra-caja">
                <strong>Aún no hay sesiones.</strong>
                <span class="ra-tenue">Créelas en Asistencia → Sesiones (por ejemplo «Día 1 – mañana» y «Día 1 – tarde»).</span>
            </div>
        @else
            <div class="ra-tarjetas">
                @foreach ($tarjetas as $t)
                    @php($tipo = match ($t['rol']) { 'Entrada' => 'is-entrada', 'Salida' => 'is-salida', default => 'is-otra' })
                    <button type="button" wire:click="elegirSesion({{ $t['id'] }})" wire:key="ses-{{ $t['id'] }}"
                        class="ra-tarjeta {{ $tipo }} {{ (int) $data['sesion_id'] === $t['id'] ? 'is-activa' : '' }}">
                        <span class="ra-rol">
                            <x-filament::icon :icon="$t['rol'] === 'Salida' ? 'heroicon-o-arrow-right-start-on-rectangle' : 'heroicon-o-arrow-right-end-on-rectangle'" style="width:1.1rem;height:1.1rem" />
                            {{ $t['rol'] ?? 'Sesión' }}
                            @if ((int) $data['sesion_id'] === $t['id'])
                                <x-filament::icon icon="heroicon-s-check-circle" class="ra-check" />
                            @endif
                        </span>
                        <span class="ra-tarjeta-nombre">{{ $t['nombre'] }}</span>
                        <span class="ra-tenue">{{ $t['cuando'] }}</span>
                        <span class="ra-tenue"><strong>{{ $t['registrados'] }}</strong> registrados</span>
                    </button>
                @endforeach
            </div>
        @endif

        {{-- 2. DNI y Enter --}}
        <div class="ra-caja">
            <form wire:submit="registrar">
                <label class="ra-etiqueta" for="ra-dni">
                    DNI, código o correo
                    @if ($actual)
                        <span class="ra-tenue">· registrando <strong>{{ $rolActual ? mb_strtoupper($rolActual) : $actual->nombre }}</strong> de {{ $actual->nombre }}</span>
                    @endif
                </label>
                <div class="ra-fila">
                    <input id="ra-dni" x-ref="dni" type="text" inputmode="text" autocomplete="off" autofocus
                        wire:model="data.texto" class="ra-dni" placeholder="Escriba el DNI y presione Enter" />
                    <button type="submit" class="ra-boton {{ $rolActual === 'Entrada' ? 'is-entrada' : ($rolActual === 'Salida' ? 'is-salida' : '') }}"
                        wire:loading.attr="disabled" wire:target="registrar">
                        <x-filament::icon icon="heroicon-o-check-circle" style="width:1.4rem;height:1.4rem" />
                        Registrar {{ $rolActual ? mb_strtolower($rolActual) : '' }}
                    </button>
                </div>
            </form>

            @if ($r)
                @php($e = $estilos[$r['tipo']])
                <div class="ra-resultado {{ $e['clase'] }}" wire:key="res-{{ md5(json_encode($r)) }}">
                    <x-filament::icon :icon="$e['icono']" class="ra-icono" />
                    <div style="min-width:0">
                        <div class="ra-resultado-titulo">{{ $e['titulo'] }}</div>
                        <div class="ra-resultado-nombre">{{ $r['nombre'] }}</div>
                        <div style="margin-bottom:.4rem">{{ $r['detalle'] }}</div>
                        @if (! empty($r['dni']))
                            <div class="ra-chips">
                                <span class="ra-chip">DNI {{ $r['dni'] }}</span>
                                <span class="ra-chip">{{ $r['codigo'] }}</span>
                            </div>
                        @endif
                    </div>
                </div>
            @endif
        </div>

        {{-- 3. Cifras de la sesión --}}
        <div class="ra-cifras">
            <div class="ra-cifra">
                <span class="ra-tenue">Registrados en esta sesión</span>
                <b>{{ $resumen['registrados'] }}</b>
                <div class="ra-barra"><span style="width: {{ $resumen['porcentaje'] }}%"></span></div>
            </div>
            <div class="ra-cifra">
                <span class="ra-tenue">Inscritos (confirmados y pendientes)</span>
                <b>{{ $resumen['inscritos'] }}</b>
            </div>
            <div class="ra-cifra">
                <span class="ra-tenue">Faltan registrar</span>
                <b>{{ $resumen['faltan'] }}</b>
                <span class="ra-tenue">{{ $resumen['porcentaje'] }} % de asistencia</span>
            </div>
        </div>

        {{-- 4. Opciones menos usadas --}}
        <div class="ra-caja ra-varios">
            <details>
                <summary>
                    <x-filament::icon icon="heroicon-o-clipboard-document-list" style="width:1.2rem;height:1.2rem" />
                    Registrar varios a la vez u otra sesión
                </summary>
                <div style="margin-top:.75rem">
                    <label class="ra-tenue" for="ra-otra">Otra sesión:</label>
                    <select id="ra-otra" class="ra-select" wire:model.live="data.sesion_id">
                        @foreach ($this->otrasSesiones() as $id => $nombre)
                            <option value="{{ $id }}">{{ $nombre }}</option>
                        @endforeach
                    </select>
                </div>
                <textarea rows="4" wire:model="data.lista"
                    placeholder="Pegue aquí los DNI o correos de la lista de asistentes, uno por línea o separados por comas"></textarea>
                <p class="ra-tenue" style="margin:.4rem 0 .75rem">Las solicitudes pendientes quedan confirmadas al registrarse; las anuladas u observadas no se registran.</p>
                <x-filament::button wire:click="registrar" icon="heroicon-o-clipboard-document-check" color="gray">
                    Registrar la lista
                </x-filament::button>
            </details>
        </div>

        {{-- 5. Quiénes ya se registraron --}}
        <div>{{ $this->table }}</div>
    </div>
</x-filament-panels::page>
