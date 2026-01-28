<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebhookControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_webhook_creates_property_with_valid_payload(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/webhook/properties', [
            'user_id' => $user->id,
            'asset_type' => 1,
            'condition' => 1,
            'features' => ['garage', 'pool'],
            'price' => 250000.00,
            'taxes' => 5000.00,
            'income' => 12000.00,
            'expenditure' => 3000.00,
            'external_id' => 'EXT-123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'property_id',
            ]);
    }

    public function test_webhook_returns_validation_error_with_invalid_payload(): void
    {
        $response = $this->postJson('/api/webhook/properties', [
            'asset_type' => 999,
            'price' => 'not-a-number',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'success',
                'errors',
            ]);
    }
}
