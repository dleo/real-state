<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $properties = $request->user()->properties;

        return response()->json(['data' => $properties]);
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $property = Property::create([
            'external_id' => $validated['external_id'] ?? null,
            'user_id' => $request->user()->id,
            'asset_type' => $validated['asset_type'],
            'condition' => $validated['condition'],
            'price' => $validated['price'],
            'features' => $validated['features'] ?? [],
            'taxes' => $validated['taxes'] ?? 0,
            'income' => $validated['income'] ?? 0,
            'expenditure' => $validated['expenditure'] ?? 0,
        ]);

        return response()->json(['data' => $property], 201);
    }

    public function show(Request $request, Property $property): JsonResponse
    {
        if ($property->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json(['data' => $property]);
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        $validated = $request->validated();

        $property->update([
            'asset_type' => $validated['asset_type'],
            'condition' => $validated['condition'],
            'price' => $validated['price'],
            'features' => $validated['features'] ?? [],
            'taxes' => $validated['taxes'] ?? 0,
            'income' => $validated['income'] ?? 0,
            'expenditure' => $validated['expenditure'] ?? 0,
        ]);

        return response()->json(['data' => $property]);
    }

    public function destroy(Request $request, Property $property): JsonResponse
    {
        if ($property->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $property->delete();

        return response()->json(['data' => null], 204);
    }
}
