<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_create_an_event()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['owner_id' => $user->id]);

        $this->assertEquals($user->id, $event->owner_id);
        $this->assertInstanceOf(Event::class, $user->events()->first());
    }

    /** @test */
    public function user_can_have_many_events()
    {
        $user = User::factory()->create();
        Event::factory()->count(3)->create(['owner_id' => $user->id]);

        $this->assertCount(3, $user->events);
    }
}
