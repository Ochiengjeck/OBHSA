<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApplicationStatus;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\BlogPost;
use App\Models\Credential;
use App\Models\Interview;
use App\Models\JobListing;
use App\Models\Offer;
use App\Models\Shift;
use App\Models\StaffingRequest;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the backoffice dashboard overview.
     */
    public function index(): Response
    {
        $credentialsExpiringSoon = $this->credentialsExpiringSoon();

        return Inertia::render('admin/dashboard', [
            'counts' => [
                'newApplications' => Application::query()->where('status', ApplicationStatus::Submitted->value)->count(),
                'newLeads' => StaffingRequest::query()->where('status', 'new')->count(),
                'activeJobListings' => JobListing::query()->where('is_active', true)->count(),
                'publishedPosts' => BlogPost::query()->where('is_published', true)->count(),
                'interviewsThisWeek' => Interview::query()->where('status', 'scheduled')->whereBetween('scheduled_at', [now(), now()->addDays(7)])->count(),
                'offersExpiringSoon' => Offer::query()->whereNull('responded_at')->where('expires_at', '<', now()->addDays(3))->count(),
                'credentialsExpiringSoon' => $credentialsExpiringSoon->count(),
                'openShifts' => Shift::query()->where('status', 'open')->where('shift_date', '>=', today())->count(),
            ],
            'pipeline' => $this->pipelineOverview(),
            'needsAttention' => $this->needsAttention($credentialsExpiringSoon),
            'upcomingInterviews' => Interview::query()
                ->where('status', 'scheduled')
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at')
                ->limit(5)
                ->with(['application.candidate:id,full_name', 'application.jobListing:id,title'])
                ->get()
                ->map(fn (Interview $interview) => [
                    'id' => $interview->id,
                    'candidateName' => $interview->application->candidate->full_name,
                    'jobTitle' => $interview->application->jobListing?->title,
                    'scheduledAt' => $interview->scheduled_at,
                ]),
        ]);
    }

    /**
     * Count of applications per pipeline stage, labeled, in enum order.
     *
     * @return array<int, array{status: string, label: string, count: int}>
     */
    private function pipelineOverview(): array
    {
        $counts = Application::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return collect(ApplicationStatus::cases())
            ->reject(fn (ApplicationStatus $status) => $status->isTerminal())
            ->map(fn (ApplicationStatus $status) => [
                'status' => $status->value,
                'label' => $status->label(),
                'count' => (int) $counts->get($status->value, 0),
            ])
            ->values()
            ->all();
    }

    /**
     * Active employees' credentials expiring within 30 days, most urgent
     * first — same window/shape as ComplianceController's own query, kept
     * here so the dashboard count and list match it exactly.
     *
     * @return Collection<int, Credential>
     */
    private function credentialsExpiringSoon(): Collection
    {
        return Credential::query()
            ->whereNotNull('expiry_date')
            ->whereHas('candidate.employee', fn ($query) => $query->where('status', 'active'))
            ->where('expiry_date', '<=', now()->addDays(30))
            ->with('candidate:id,full_name')
            ->orderBy('expiry_date')
            ->get();
    }

    /**
     * A single, urgency-sorted "needs attention" queue merged from four
     * already-queryable signals: applications stalled in their current
     * stage, credentials expiring soon, offers expiring soon, and
     * unfulfilled staffing requests.
     *
     * @param  Collection<int, Credential>  $credentialsExpiringSoon
     * @return array<int, array{type: string, title: string, subtitle: string, href: string, urgency: int}>
     */
    private function needsAttention(Collection $credentialsExpiringSoon): array
    {
        $stalledApplications = Application::query()
            ->where('current_stage_entered_at', '<', now()->subDays(7))
            ->whereNotIn('status', collect(ApplicationStatus::cases())->filter->isTerminal()->map->value)
            ->with('candidate:id,full_name')
            ->orderBy('current_stage_entered_at')
            ->limit(5)
            ->get()
            ->map(fn (Application $application) => [
                'type' => 'stalled_application',
                'title' => $application->candidate->full_name,
                'subtitle' => sprintf(
                    '%s for %d days',
                    ApplicationStatus::from($application->status)->label(),
                    $application->current_stage_entered_at->diffInDays(now()),
                ),
                'href' => route('admin.candidates.show', $application->candidate_id),
                'urgency' => (int) $application->current_stage_entered_at->diffInDays(now()),
            ]);

        $credentials = $credentialsExpiringSoon->take(5)->map(fn (Credential $credential) => [
            'type' => 'expiring_credential',
            'title' => $credential->candidate->full_name,
            'subtitle' => sprintf(
                '%s expires %s',
                $credential->credential_name,
                $credential->expiry_date->isPast() ? 'already' : $credential->expiry_date->diffForHumans(),
            ),
            'href' => route('admin.candidates.show', $credential->candidate_id),
            // Days remaining until expiry, inverted so sooner (or already
            // past) expiry sorts as more urgent alongside the other signals.
            'urgency' => (int) (30 - now()->diffInDays($credential->expiry_date, absolute: false)),
        ]);

        $offers = Offer::query()
            ->whereNull('responded_at')
            ->where('expires_at', '<', now()->addDays(3))
            ->with('application.candidate:id,full_name')
            ->orderBy('expires_at')
            ->limit(5)
            ->get()
            ->map(fn (Offer $offer) => [
                'type' => 'expiring_offer',
                'title' => $offer->application->candidate->full_name,
                'subtitle' => sprintf('Offer for %s expires %s', $offer->position, $offer->expires_at->diffForHumans()),
                'href' => route('admin.candidates.show', $offer->application->candidate_id),
                'urgency' => 100,
            ]);

        $staffingRequests = StaffingRequest::query()
            ->where('status', 'new')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (StaffingRequest $request) => [
                'type' => 'new_staffing_request',
                'title' => $request->facility_name,
                'subtitle' => sprintf('New lead from %s', $request->contact_name),
                'href' => route('admin.staffing-requests.show', $request->id),
                'urgency' => (int) $request->created_at->diffInDays(now()),
            ]);

        return $stalledApplications
            ->concat($credentials)
            ->concat($offers)
            ->concat($staffingRequests)
            ->sortByDesc('urgency')
            ->take(8)
            ->values()
            ->all();
    }
}
