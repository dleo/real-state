<?php

namespace App\Enums;

enum AssetType: int
{
    case Residential = 1;
    case Commercial = 2;
    case Land = 3;

    public function label(): string
    {
        return match ($this) {
            self::Residential => 'Residential',
            self::Commercial => 'Commercial',
            self::Land => 'Land',
        };
    }
}
