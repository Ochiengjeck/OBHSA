<?php

namespace App\Console\Commands;

use App\Mail\CredentialExpiryStaffAlert;
use App\Mail\CredentialExpiryWarning;
use App\Models\Credential;
use App\Models\SiteSetting;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

#[Signature('compliance:check-credential-expirations')]
#[Description('Send staged expiry warnings for active employees\' credentials')]
class CheckCredentialExpirations extends Command
{
    /**
     * The expiry stages, ordered from most to least urgent, mapped to the
     * number of days-until-expiry at or below which they apply. Checked in
     * this order so a credential matches its most urgent applicable stage.
     *
     * @var array<string, int>
     */
    private const array STAGE_THRESHOLDS = [
        'overdue' => 0,
        '7_day' => 7,
        '30_day' => 30,
        '60_day' => 60,
    ];

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $credentials = Credential::query()
            ->whereNotNull('expiry_date')
            ->whereHas('candidate.employee', fn ($query) => $query->where('status', 'active'))
            ->with('candidate.employee')
            ->get();

        $sent = 0;

        foreach ($credentials as $credential) {
            $stage = $this->applicableStage($credential);

            if ($stage === null) {
                continue;
            }

            if ($credential->expiryNotifications()->where('stage', $stage)->exists()) {
                continue;
            }

            Mail::to($credential->candidate->email)->queue(new CredentialExpiryWarning($credential, $stage));
            Mail::to(SiteSetting::get('email', config('mail.from.address')))->queue(new CredentialExpiryStaffAlert($credential, $stage));

            $credential->expiryNotifications()->create([
                'stage' => $stage,
                'sent_at' => now(),
                'notified_employee' => true,
                'notified_staff' => true,
            ]);

            $sent++;
        }

        $this->info("Sent {$sent} credential expiry notification(s).");
    }

    /**
     * Determine the most urgent stage this credential currently qualifies
     * for, based on its days remaining until expiry. Returns null once a
     * credential is further out than the widest warning window.
     */
    private function applicableStage(Credential $credential): ?string
    {
        $daysUntilExpiry = now()->startOfDay()->diffInDays($credential->expiry_date, false);

        foreach (self::STAGE_THRESHOLDS as $stage => $threshold) {
            if ($daysUntilExpiry <= $threshold) {
                return $stage;
            }
        }

        return null;
    }
}
