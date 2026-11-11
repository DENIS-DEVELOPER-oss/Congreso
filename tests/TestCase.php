<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    // Seguro: las pruebas borran y recrean la base, así que solo corren sobre SQLite en memoria.
    // Se comprueba al crear la aplicación, antes de que RefreshDatabase toque nada. Si la configuración
    // quedó en caché (php artisan optimize) apuntaría a la base real: las pruebas se detienen.
    public function createApplication()
    {
        $app = parent::createApplication();
        $config = $app['config'];

        if ($config->get('database.default') !== 'sqlite' || $config->get('database.connections.sqlite.database') !== ':memory:') {
            throw new RuntimeException('Las pruebas solo corren sobre SQLite en memoria. Ejecuta "php artisan config:clear" y vuelve a intentar.');
        }

        return $app;
    }
}
