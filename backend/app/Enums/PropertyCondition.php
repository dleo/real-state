<?php

namespace App\Enums;

enum PropertyCondition: int
{
    case New = 1;
    case Old = 2;

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Old => 'Old',
        };
    }
}
