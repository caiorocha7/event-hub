<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'owner_id' => \App\Models\User::factory(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'address' => $this->faker->streetAddress,
            'complement' => $this->faker->secondaryAddress,
            'zipcode' => $this->faker->postcode,
            'number' => $this->faker->buildingNumber,
            'city' => $this->faker->city,
            'state' => $this->faker->stateAbbr,
            'starts_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'ends_at' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
            'max_subscription' => $this->faker->numberBetween(10, 100),
            'is_active' => $this->faker->boolean(90)
        ];
    }
}
