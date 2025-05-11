<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends BaseModel
{
    use HasFactory, Notifiable;

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
}
