<?php

namespace App\Enums;

enum AssetStatus: string
{
    case InUse = 'in_use';
    case Legacy = 'legacy';
}
