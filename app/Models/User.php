<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Authenticatable;

class User extends BaseModel implements JWTSubject, AuthenticatableContract
{
    use HasFactory, Notifiable, Authenticatable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'last_login'
    ];

    protected $hidden = ['password'];

    public function events()
    {
        return $this->hasMany(Event::class, 'owner_id');
    }

    // Implementação do JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
