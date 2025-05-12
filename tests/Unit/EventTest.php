<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Event;
use App\Models\EventGuest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function event_belongs_to_an_owner()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['owner_id' => $user->id]);

        $this->assertInstanceOf(User::class, $event->owner);
        $this->assertEquals($user->id, $event->owner->id);
    }

    /** @test */
    public function event_can_have_guests()
    {
        $event = Event::factory()->create();
        $user = User::factory()->create();

        $guest = EventGuest::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        $this->assertTrue($event->guests->contains($guest));
    }
}
