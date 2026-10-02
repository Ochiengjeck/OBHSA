<?php

namespace App\Support;

use App\Enums\ApplicationStatus;

class ApplicationStateMachine
{
    /**
     * Allowed next statuses for each status. Terminal statuses (active,
     * withdrawn, rejected, ineligible, expired) have no outgoing edges.
     *
     * @var array<string, list<string>>
     */
    private const array TRANSITIONS = [
        'draft' => ['started', 'submitted', 'withdrawn'],
        'started' => ['submitted', 'ineligible', 'withdrawn'],
        'submitted' => ['eligibility_review', 'ineligible', 'rejected', 'withdrawn'],
        'eligibility_review' => ['recruiter_review', 'ineligible', 'on_hold', 'withdrawn'],
        'recruiter_review' => ['screening', 'rejected', 'on_hold', 'withdrawn'],
        'screening' => ['credentialing', 'rejected', 'on_hold', 'withdrawn'],
        'credentialing' => ['interview', 'rejected', 'on_hold', 'expired', 'withdrawn'],
        'interview' => ['assessment', 'rejected', 'on_hold', 'withdrawn'],
        'assessment' => ['final_review', 'rejected', 'on_hold', 'expired', 'withdrawn'],
        'final_review' => ['approved', 'rejected', 'on_hold', 'withdrawn'],
        'approved' => ['offer_pending', 'withdrawn'],
        'offer_pending' => ['offer_accepted', 'rejected', 'expired', 'withdrawn'],
        'offer_accepted' => ['onboarding', 'withdrawn'],
        'onboarding' => ['activation_review', 'on_hold', 'withdrawn'],
        'activation_review' => ['active', 'on_hold', 'rejected', 'withdrawn'],
        'on_hold' => [
            'eligibility_review', 'recruiter_review', 'screening', 'credentialing',
            'interview', 'assessment', 'final_review', 'onboarding', 'activation_review',
            'rejected', 'expired', 'withdrawn',
        ],
    ];

    /**
     * Determine whether a transition from one status to another is allowed.
     */
    public static function canTransition(ApplicationStatus $from, ApplicationStatus $to): bool
    {
        return in_array($to->value, self::TRANSITIONS[$from->value] ?? [], true);
    }

    /**
     * Get the allowed next statuses for a given status.
     *
     * @return list<ApplicationStatus>
     */
    public static function allowedFrom(ApplicationStatus $from): array
    {
        return array_map(
            fn (string $value) => ApplicationStatus::from($value),
            self::TRANSITIONS[$from->value] ?? [],
        );
    }
}
