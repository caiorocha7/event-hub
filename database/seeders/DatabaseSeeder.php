<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory(10)->create()->each(function ($user) {
            Event::factory(rand(1, 3))->create(['owner_id' => $user->id])
                ->each(function ($event) {
                    // Seleciona usuários aleatórios (excluindo o owner)
                    $guests = User::where('id', '!=', $event->owner_id)
                        ->inRandomOrder()
                        ->limit(rand(1, 5))
                        ->get();

                    // Cria registros na tabela event_guests
                    $event->guests()->createMany(
                        $guests->map(fn($user) => [
                            'user_id' => $user->id
                        ])->toArray()
                    );
                });
        });
    }
}
