<?php

namespace App\Http\Controllers;

use App\Enums\AssetType;
use App\Enums\PropertyCondition;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;

class WebhookController extends Controller
{
    public function ingest(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'asset_type' => ['required', new Enum(AssetType::class)],
            'condition' => ['required', new Enum(PropertyCondition::class)],
            'features' => 'nullable|array',
            'features.*' => 'string',
            'price' => 'required|numeric|min:0',
            'taxes' => 'nullable|numeric|min:0',
            'income' => 'nullable|numeric|min:0',
            'expenditure' => 'nullable|numeric|min:0',
            'external_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // TODO: Add deduplication logic here
        // First case, external_id is present and unique 
        $property = null; 

        if ($validated['external_id']) {
            $property = Property::updateOrCreate(
                ['external_id' => $validated['external_id']],
                $validated
            );
        }

        if (!$property) {
            // We should look as fallback by address and user_id
            $property = Property::updateOrCreate(
                ['address' => $validated['address'], 'user_id' => $validated['user_id']],
                array_filter($validated, fn($value) => $value !== null)
            );
        }

        return response()->json([
            'success' => true,
            'property_id' => $property->id,
        ], 200);
    }
}
