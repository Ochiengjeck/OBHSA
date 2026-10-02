<?php

namespace App\Services\Ai\Exceptions;

use RuntimeException;

class AiProviderNotConfiguredException extends RuntimeException
{
    public static function make(string $provider): self
    {
        return new self("The \"{$provider}\" AI provider has no API key configured. Set it in the .env file to use this provider.");
    }
}
