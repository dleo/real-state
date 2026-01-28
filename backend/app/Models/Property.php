<?php

namespace App\Models;

use App\Enums\AssetType;
use App\Enums\PropertyCondition;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'asset_type',
        'condition',
        'features',
        'price',
        'taxes',
        'income',
        'expenditure',
        'external_id',
    ];

    protected function casts(): array
    {
        return [
            'asset_type' => AssetType::class,
            'condition' => PropertyCondition::class,
            'features' => 'array',
            'price' => 'decimal:2',
            'taxes' => 'decimal:2',
            'income' => 'decimal:2',
            'expenditure' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
