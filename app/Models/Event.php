<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'address',
        'complement',
        'zipcode',
        'number',
        'city',
        'state',
        'starts_at',
        'ends_at',
        'max_subscription',
        'is_active'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function guests()
    {
        return $this->hasMany(EventGuest::class);
    }
}
