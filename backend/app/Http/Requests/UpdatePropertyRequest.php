<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\AssetType;
use App\Enums\PropertyCondition;
use Illuminate\Validation\Rules\Enum;

class UpdatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('property')->user_id === $this->user()->id;
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
