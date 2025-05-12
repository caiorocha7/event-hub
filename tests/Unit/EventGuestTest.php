<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Event;
use App\Models\EventGuest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventGuestTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function event_guest_belongs_to_event_and_user()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create();

        $guest = EventGuest::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        $this->assertInstanceOf(Event::class, $guest->event);
        $this->assertInstanceOf(User::class, $guest->user);
    }
}
