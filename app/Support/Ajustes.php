<?php

namespace App\Support;

use App\Models\Ajuste;
use App\Models\PonenteCentral;
use Illuminate\Support\Carbon;
use Throwable;

// Datos del congreso que se editan desde el panel. Al arrancar se aplican sobre config('congreso.*'),
// así todo el sistema (validación, montos, correos, certificados y la página) usa los valores guardados.
class Ajustes
{
    // Claves que se pueden editar desde el panel
    public const EDITABLES = [
        'tarifas', 'medios_pago_detalle', 'fecha_preventa_fin', 'correo_contacto', 'telefono', 'whatsapp',
        'fechas_importantes', 'firmantes', 'porcentaje_asistencia', 'horas', 'zoom_solo_con_pago', 'inscripcion_gratuita', 'inscripciones_abiertas',
        'aviso_correo', 'aviso_whatsapp', 'aviso_whatsapp_clave',
    ];

    public static function inscripcionesAbiertas(): bool
    {
        return (bool) config('congreso.inscripciones_abiertas');
    }

    // Con las inscripciones cerradas, los usuarios del panel pueden probar el formulario
    public static function puedeInscribir(): bool
    {
        return self::inscripcionesAbiertas() || auth('web')->check();
    }

    public static function gratuita(): bool
    {
        return (bool) config('congreso.inscripcion_gratuita');
    }

    public static function aplicar(): void
    {
        try {
            $guardados = Ajuste::whereIn('clave', self::EDITABLES)->pluck('valor', 'clave');
        } catch (Throwable) {
            return; // la tabla aún no existe (antes de migrar)
        }

        foreach ($guardados as $clave => $valor) {
            if ($valor !== null) {
                config(["congreso.$clave" => $valor]);
            }
        }

        // Los tipos de participante son fijos: siempre están los cuatro, con lo guardado encima de los valores por defecto
        $porDefecto = self::porDefecto('tarifas');
        config(['congreso.tarifas' => array_replace_recursive($porDefecto, array_intersect_key(config('congreso.tarifas'), $porDefecto))]);

        config(['congreso.medios_pago' => collect(config('congreso.medios_pago_detalle'))->pluck('nombre', 'id')->all()]);

        // Los correos salen de la cuenta del servidor, pero las respuestas llegan al correo de contacto
        if (filled(config('congreso.correo_contacto'))) {
            config(['mail.reply_to' => ['address' => config('congreso.correo_contacto'), 'name' => config('mail.from.name')]]);
        }
    }

    // Valor original de config/congreso.php (sin lo guardado en el panel)
    public static function porDefecto(string $clave): mixed
    {
        static $archivo = null;
        $archivo ??= require config_path('congreso.php');

        return $archivo[$clave] ?? null;
    }

    public static function guardar(array $datos): void
    {
        // Las listas del panel (medios de pago, fechas, firmantes) llegan con claves internas: se guardan como lista simple
        foreach (['medios_pago_detalle', 'fechas_importantes', 'firmantes'] as $lista) {
            if (isset($datos[$lista]) && is_array($datos[$lista])) {
                $datos[$lista] = array_values($datos[$lista]);
            }
        }

        foreach (self::EDITABLES as $clave) {
            if (array_key_exists($clave, $datos)) {
                Ajuste::updateOrCreate(['clave' => $clave], ['valor' => $datos[$clave]]);
            }
        }
        self::aplicar();
    }

    // Datos públicos que necesita la página (React) al cargar: se insertan en el HTML como window.__CONGRESO__.
    // Los precios y las cuentas de pago NO van aquí: solo se ven dentro de "Mi cuenta" y en el correo de acceso.
    public static function paraLaPagina(): array
    {
        $meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

        return [
            'evento' => [
                'inscripcionesAbiertas' => self::inscripcionesAbiertas(),
                'puedeProbarInscripcion' => ! self::inscripcionesAbiertas() && auth('web')->check(),
                'inscripcionGratuita' => self::gratuita(),
                'correo' => config('congreso.correo_contacto'),
                'telefono' => config('congreso.telefono'),
                'whatsapp' => preg_replace('/\D/', '', (string) config('congreso.whatsapp')),
                // Formato que usa la página: "26 nov 2026"
                'fechasImportantes' => collect(config('congreso.fechas_importantes'))
                    ->filter(fn ($f) => ! empty($f['fecha']) && ! empty($f['texto']))
                    ->sortBy('fecha')
                    ->map(function ($f) use ($meses) {
                        $d = Carbon::parse($f['fecha']);

                        return ['fecha' => $d->format('d').' '.$meses[$d->month - 1].' '.$d->year, 'texto' => $f['texto']];
                    })->values(),
            ],
            'ponentes' => self::ponentes(),
        ];
    }

    // Ponentes centrales del panel; null si la tabla aún no existe (la página usa entonces su lista propia)
    private static function ponentes(): ?array
    {
        try {
            return PonenteCentral::paraLaPagina()->get()->map->aPagina()->all();
        } catch (Throwable) {
            return null;
        }
    }
}
