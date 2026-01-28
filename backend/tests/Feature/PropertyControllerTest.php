<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Enums\AssetType;
use App\Enums\PropertyCondition;

class PropertyControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_user_properties(): void
    {
        $user = User::factory()->create();
        Property::factory()->count(3)->create(['user_id' => $user->id]);
        Property::factory()->count(2)->create(); // Other user's properties

        $response = $this->actingAs($user)->getJson('/api/properties');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_store_creates_property(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/properties', [
            'asset_type' => AssetType::Residential,
            'condition' => PropertyCondition::New,
            'price' => 250000,
            'features' => ['garage', 'pool'],
            'taxes' => 5000,
            'income' => 1000,
            'expenditure' => 500,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'price' => '250000.00',
            ]);

        $this->assertDatabaseHas('properties', [
            'user_id' => $user->id,
            'price' => 250000,
        ]);
    }

    public function test_store_validates_required_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/properties', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['asset_type', 'condition', 'price']);
    }

    public function test_show_returns_property(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $property->id]);
    }

    public function test_show_returns_403_for_other_users_property(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->getJson("/api/properties/{$property->id}");

        $response->assertStatus(403);
    }

    public function test_update_modifies_property(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/properties/{$property->id}", [
            'asset_type' => AssetType::Commercial,
            'condition' => PropertyCondition::Old,
            'price' => 500000,  
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['price' => '500000.00']);

        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'price' => 500000,
        ]);
    }

    public function test_update_returns_403_for_other_users_property(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->putJson("/api/properties/{$property->id}", [
            'asset_type' => AssetType::Commercial,
            'condition' => PropertyCondition::Old,
            'price' => 500000,
        ]);

        $response->assertStatus(403);
    }

    public function test_destroy_deletes_property(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('properties', ['id' => $property->id]);
    }

    public function test_destroy_returns_403_for_other_users_property(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('properties', ['id' => $property->id]);
    }

    public function test_unauthenticated_requests_return_401(): void
    {
        $response = $this->getJson('/api/properties');

        $response->assertStatus(401);
    }
}
