<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\AssetType;
use App\Enums\PropertyCondition;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'asset_type' => ['required', new Enum(AssetType::class)],
            'condition' => ['required', new Enum(PropertyCondition::class)],
            'price' => 'required|numeric|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'taxes' => 'nullable|numeric|min:0',
            'income' => 'nullable|numeric|min:0',
            'expenditure' => 'nullable|numeric|min:0',
        ];
    }
}
