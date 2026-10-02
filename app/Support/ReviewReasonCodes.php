<?php

namespace App\Support;

class ReviewReasonCodes
{
    /**
     * Structured reason codes recruiters can attach to a status change,
     * keyed by stored value. Optional — free-text reason stays available
     * alongside it.
     *
     * @var array<string, string>
     */
    public const array OPTIONS = [
        'missing_credentials' => 'Missing Credentials',
        'failed_background_check' => 'Failed Background Check',
        'not_a_fit' => 'Not a Fit',
        'duplicate_application' => 'Duplicate Application',
        'candidate_withdrew' => 'Candidate Withdrew',
        'other' => 'Other',
    ];
}
