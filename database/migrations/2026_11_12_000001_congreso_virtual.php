<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Congreso virtual: cada sesión es también una clase del Aula (título, ponente, horario y enlace de Zoom).
// La contraseña que llega por correo es temporal: al primer ingreso se pide crear una propia.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sesiones', function (Blueprint $table) {
            $table->string('titulo', 200)->nullable()->after('nombre');
            $table->string('ponente', 200)->nullable()->after('titulo');
            $table->time('hora_inicio')->nullable()->after('fecha');
            $table->time('hora_fin')->nullable()->after('hora_inicio');
            $table->string('enlace', 500)->nullable()->after('hora_fin'); // enlace de Zoom
            $table->string('material', 500)->nullable()->after('enlace'); // enlace a diapositivas o lecturas
        });

        Schema::table('participantes', function (Blueprint $table) {
            $table->boolean('debe_cambiar_clave')->default(false)->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('sesiones', fn (Blueprint $table) => $table->dropColumn(['titulo', 'ponente', 'hora_inicio', 'hora_fin', 'enlace', 'material']));
        Schema::table('participantes', fn (Blueprint $table) => $table->dropColumn('debe_cambiar_clave'));
    }
};
