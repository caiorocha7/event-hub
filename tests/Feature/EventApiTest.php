<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register_and_login_and_get_token()
    {
        $register = $this->postJson('/api/auth/register', [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
        $register->assertStatus(201);

        $login = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
        $login->assertStatus(200)->assertJsonStructure(['access_token']);
    }

    /** @test */
    public function authenticated_user_can_create_event()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/events', [
                'name' => 'Meu Evento',
                'description' => 'Descrição',
                'zipcode' => '01001000',
                'number' => '123',
                'starts_at' => now()->addDay()->format('Y-m-d H:i'),
                'ends_at' => now()->addDays(2)->format('Y-m-d H:i'),
                'max_subscription' => 10,
            ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Meu Evento']);
    }

    /** @test */
    public function user_can_list_events()
    {
        Event::factory()->count(3)->create(['is_active' => true]);
        $response = $this->getJson('/api/events');
        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function user_can_subscribe_and_unsubscribe_to_event()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $event = Event::factory()->create([
            'owner_id' => $user->id,
            'uuid_code' => (string) Str::uuid(),
            'is_active' => true,
        ]);

        // Subscribe
        $subscribe = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/events/{$event->uuid_code}/subscribe");
        $subscribe->assertStatus(200);

        // Unsubscribe
        $unsubscribe = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/events/{$event->uuid_code}/unsubscribe");
        $unsubscribe->assertStatus(200);
    }

    /** @test */
    public function user_can_see_their_events()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $event = Event::factory()->create([
            'owner_id' => $user->id,
            'uuid_code' => (string) Str::uuid(),
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/my-events');
        $response->assertStatus(200)
                 ->assertJsonFragment(['uuid_code' => $event->uuid_code]);
    }
}
