<?php

namespace App\Exceptions;

use App\Enums\ApplicationStatus;
use RuntimeException;

class InvalidApplicationTransitionException extends RuntimeException
{
    public static function make(ApplicationStatus $from, ApplicationStatus $to): self
    {
        return new self("Cannot transition an application from [{$from->value}] to [{$to->value}].");
    }
}
