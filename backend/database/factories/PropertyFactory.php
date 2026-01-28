<?php

namespace Database\Factories;

use App\Enums\AssetType;
use App\Enums\PropertyCondition;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'asset_type' => fake()->randomElement(AssetType::cases()),
            'condition' => fake()->randomElement(PropertyCondition::cases()),
            'features' => fake()->randomElements(['garage', 'pool', 'garden', 'basement'], 2),
            'price' => fake()->randomFloat(2, 50000, 1000000),
            'taxes' => fake()->randomFloat(2, 1000, 10000),
            'income' => fake()->randomFloat(2, 0, 5000),
            'expenditure' => fake()->randomFloat(2, 0, 3000),
        ];
    }
}
