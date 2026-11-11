<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// El participante confirma en el Aula cómo debe salir su nombre en el certificado
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participantes', function (Blueprint $table) {
            $table->timestamp('nombre_confirmado_en')->nullable()->after('correo_verificado_en');
        });
    }

    public function down(): void
    {
        Schema::table('participantes', function (Blueprint $table) {
            $table->dropColumn('nombre_confirmado_en');
        });
    }
};
