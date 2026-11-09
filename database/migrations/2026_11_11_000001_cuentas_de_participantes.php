<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// "Mi cuenta": el participante entra con su DNI y la contraseña que le envía la organización.
// El registro público ya no pide el pago: el medio, el número de operación y el voucher se suben después desde la cuenta.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participantes', function (Blueprint $table) {
            $table->string('password')->nullable()->after('correo_verificado_en');
            $table->rememberToken()->after('password');
            $table->timestamp('acceso_enviado_en')->nullable()->after('remember_token');
        });

        Schema::table('inscripciones', function (Blueprint $table) {
            $table->string('medio_pago', 20)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('participantes', fn (Blueprint $table) => $table->dropColumn(['password', 'remember_token', 'acceso_enviado_en']));
    }
};
