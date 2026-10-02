<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Draft = 'draft';
    case Started = 'started';
    case Submitted = 'submitted';
    case EligibilityReview = 'eligibility_review';
    case RecruiterReview = 'recruiter_review';
    case Screening = 'screening';
    case Credentialing = 'credentialing';
    case Interview = 'interview';
    case Assessment = 'assessment';
    case FinalReview = 'final_review';
    case Approved = 'approved';
    case OfferPending = 'offer_pending';
    case OfferAccepted = 'offer_accepted';
    case Onboarding = 'onboarding';
    case ActivationReview = 'activation_review';
    case Active = 'active';

    case Withdrawn = 'withdrawn';
    case Rejected = 'rejected';
    case Ineligible = 'ineligible';
    case OnHold = 'on_hold';
    case Expired = 'expired';

    /**
     * Whether this status is a terminal exit with no further transitions.
     */
    public function isTerminal(): bool
    {
        return match ($this) {
            self::Active, self::Withdrawn, self::Rejected, self::Ineligible, self::Expired => true,
            default => false,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Started => 'Started',
            self::Submitted => 'Submitted',
            self::EligibilityReview => 'Eligibility Review',
            self::RecruiterReview => 'Recruiter Review',
            self::Screening => 'Screening',
            self::Credentialing => 'Credentialing',
            self::Interview => 'Interview',
            self::Assessment => 'Assessment',
            self::FinalReview => 'Final Review',
            self::Approved => 'Approved',
            self::OfferPending => 'Offer Pending',
            self::OfferAccepted => 'Offer Accepted',
            self::Onboarding => 'Onboarding',
            self::ActivationReview => 'Activation Review',
            self::Active => 'Active',
            self::Withdrawn => 'Withdrawn',
            self::Rejected => 'Rejected',
            self::Ineligible => 'Ineligible',
            self::OnHold => 'On Hold',
            self::Expired => 'Expired',
        };
    }
}
