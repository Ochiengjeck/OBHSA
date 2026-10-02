<?php

namespace App\Exceptions;

use Illuminate\Support\Collection;
use RuntimeException;

class BlockingRequirementsIncompleteException extends RuntimeException
{
    /**
     * @param  Collection<int, string>  $requirementTypes
     */
    public static function make(Collection $requirementTypes): self
    {
        $list = $requirementTypes->map(fn (string $type) => str_replace('_', ' ', $type))->implode(', ');

        return new self("Cannot activate this application — the following requirements are not yet passed: {$list}.");
    }
}
