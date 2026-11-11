<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;

// Cada persona se registra una sola vez (por DNI o pasaporte).
// También es el usuario de "Mi cuenta": entra con su DNI y la contraseña que le envía la organización.
class Participante extends Authenticatable
{
    protected $fillable = ['documento', 'nombres', 'apellidos', 'correo', 'telefono', 'institucion'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'correo_verificado_en' => 'datetime',
            'acceso_enviado_en' => 'datetime',
            'nombre_confirmado_en' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Si cambia el correo, hay que volver a confirmarlo
    protected static function booted(): void
    {
        static::saving(function (Participante $p) {
            if ($p->exists && $p->isDirty('correo')) {
                $p->correo_verificado_en = null;
            }
        });
    }

    protected function nombreCompleto(): Attribute
    {
        return Attribute::get(fn () => trim("{$this->nombres} {$this->apellidos}"));
    }

    public function tieneAcceso(): bool
    {
        return $this->password !== null;
    }

    public function correoConfirmado(): bool
    {
        return $this->correo_verificado_en !== null;
    }

    public function inscripcion(): HasOne
    {
        return $this->hasOne(Inscripcion::class);
    }

    public function ponencias(): HasMany
    {
        return $this->hasMany(Ponencia::class, 'autor_id');
    }

    public function certificados(): HasMany
    {
        return $this->hasMany(Certificado::class);
    }
}
