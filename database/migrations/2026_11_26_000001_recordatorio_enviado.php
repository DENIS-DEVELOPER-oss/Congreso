<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Cuándo se le envió a cada inscrito el recordatorio de asistencia (para no repetirlo si el envío se corta)
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inscripciones', function (Blueprint $table) {
            $table->timestamp('recordatorio_enviado_en')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('inscripciones', function (Blueprint $table) {
            $table->dropColumn('recordatorio_enviado_en');
        });
    }
};
