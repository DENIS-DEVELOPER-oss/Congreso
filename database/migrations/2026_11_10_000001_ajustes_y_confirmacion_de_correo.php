<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Datos del congreso que la organización edita desde el panel (tarifas, cuentas, contacto, fechas, firmantes…)
        Schema::create('ajustes', function (Blueprint $table) {
            $table->id();
            $table->string('clave', 60)->unique();
            $table->json('valor')->nullable();
            $table->timestamps();
        });

        // Confirmación de correo: el participante hace clic en el enlace que le llega
        Schema::table('participantes', function (Blueprint $table) {
            $table->timestamp('correo_verificado_en')->nullable()->after('correo');
        });

        // Inscripciones hechas en el panel (pago en efectivo en la puerta): sin voucher ni número de operación
        Schema::table('inscripciones', function (Blueprint $table) {
            $table->string('numero_operacion', 30)->nullable()->change();
            $table->string('voucher')->nullable()->change();
            $table->string('origen', 10)->default('web')->after('acepta_privacidad'); // web | panel
        });
    }

    public function down(): void
    {
        Schema::table('inscripciones', fn (Blueprint $table) => $table->dropColumn('origen'));
        Schema::table('participantes', fn (Blueprint $table) => $table->dropColumn('correo_verificado_en'));
        Schema::dropIfExists('ajustes');
    }
};
