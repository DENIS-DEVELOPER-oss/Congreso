<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tablas del congreso:
// participante ─1:1─ inscripcion ─1:N─ asistencia ─N:1─ sesion
// participante ─1:N─ ponencia ─N:1─ eje_tematico
// participante ─1:N─ certificado
return new class extends Migration
{
    public function up(): void
    {
        // Dos roles: administrador (es_admin = true) y organizador (es_admin = false)
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('es_admin')->default(false)->after('password');
        });

        Schema::create('participantes', function (Blueprint $table) {
            $table->id();
            $table->string('documento', 12)->unique(); // DNI o pasaporte
            $table->string('nombres', 100);
            $table->string('apellidos', 100)->default('');
            $table->string('correo', 254)->index();
            $table->string('telefono', 20)->nullable();
            $table->string('institucion', 200)->nullable();
            $table->timestamps();
        });

        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->nullable()->unique(); // SA-2026-0001, se asigna al guardar
            $table->foreignId('participante_id')->unique()->constrained('participantes')->cascadeOnDelete(); // una por persona
            $table->string('tipo_participante', 20); // estudiante | docente | profesional | ponente
            $table->decimal('monto', 8, 2);
            $table->string('medio_pago', 20); // yape | plin | bn | cci
            $table->string('numero_operacion', 30);
            $table->string('voucher'); // ruta del archivo en storage/app/private
            $table->string('estado', 12)->default('pendiente')->index(); // pendiente | validada | observada | anulada
            $table->text('observacion')->nullable();
            $table->foreignId('validado_por')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validado_en')->nullable();
            $table->boolean('acepta_privacidad');
            $table->timestamps();

            $table->unique(['medio_pago', 'numero_operacion']); // el mismo voucher no sirve dos veces
        });

        Schema::create('ejes_tematicos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 255);
            $table->text('descripcion')->nullable();
            $table->string('icono', 40)->nullable(); // nombre del ícono de la página (lucide)
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();
        });

        Schema::create('ponencias', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->nullable()->unique(); // PON-001
            $table->foreignId('autor_id')->constrained('participantes')->cascadeOnDelete();
            $table->string('titulo', 200);
            $table->foreignId('eje_id')->constrained('ejes_tematicos')->restrictOnDelete();
            $table->string('modalidad', 20); // oral | poster
            $table->text('coautores')->nullable();
            $table->string('palabras_clave', 250);
            $table->string('archivo');
            $table->string('estado', 15)->default('recibida')->index(); // recibida | aceptada | observada | rechazada
            $table->text('observacion')->nullable();
            $table->timestamps();
        });

        Schema::create('sesiones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 60); // "Día 1 – mañana"
            $table->date('fecha');
            $table->timestamps();
        });

        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inscripcion_id')->constrained('inscripciones')->cascadeOnDelete();
            $table->foreignId('sesion_id')->constrained('sesiones')->cascadeOnDelete();
            $table->foreignId('registrado_por')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('registrado_en')->useCurrent();

            $table->unique(['inscripcion_id', 'sesion_id']); // una marca por persona y sesión
        });

        Schema::create('certificados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participante_id')->constrained('participantes')->cascadeOnDelete();
            $table->string('tipo', 15); // asistente | ponente | organizador | comite
            $table->unsignedSmallInteger('horas');
            $table->string('codigo_verificacion', 10)->unique();
            $table->string('archivo_pdf')->nullable(); // opcional: PDF propio; si está vacío se genera con la plantilla
            $table->timestamp('emitido_en')->useCurrent();
            $table->timestamp('enviado_en')->nullable(); // vacío = aún no se envió por correo
            $table->timestamps();

            $table->unique(['participante_id', 'tipo']); // no se emite dos veces el mismo certificado
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificados');
        Schema::dropIfExists('asistencias');
        Schema::dropIfExists('sesiones');
        Schema::dropIfExists('ponencias');
        Schema::dropIfExists('ejes_tematicos');
        Schema::dropIfExists('inscripciones');
        Schema::dropIfExists('participantes');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('es_admin'));
    }
};
