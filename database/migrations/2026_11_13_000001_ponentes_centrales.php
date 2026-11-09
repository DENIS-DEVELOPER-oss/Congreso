<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Ponentes centrales: los organizadores los agregan y editan desde el panel y se muestran en la página
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ponentes_centrales', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150);
            $table->string('institucion', 200)->nullable();
            $table->string('pais', 60)->default('Perú');
            $table->string('foto')->nullable(); // ruta dentro de public/ (por ejemplo ponentes/nombre.jpg)
            $table->string('ponencia', 255)->nullable(); // título de su conferencia
            $table->text('bio')->nullable();
            $table->boolean('magistral')->default(false);
            $table->boolean('visible')->default(true);
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ponentes_centrales');
    }
};
