<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventGuest extends BaseModel
{
    use HasFactory;

    protected $fillable = ['event_id', 'user_id'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
