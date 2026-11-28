<?php

namespace Database\Factories;

use App\Models\WebsiteContent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WebsiteContent>
 */
class WebsiteContentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => 'test.'.fake()->unique()->slug(),
            'label' => fake()->sentence(3),
            'group' => 'Website content',
            'content' => ['value' => ['heading' => fake()->sentence(), 'text' => fake()->paragraph()]],
        ];
    }
}
