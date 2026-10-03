<?php

namespace App\Http\Controllers;

use App\Concerns\StoresUploadedFiles;
use App\Enums\ApplicationStatus;
use App\Http\Requests\ResendApplicationLinkRequest;
use App\Http\Requests\StartApplicationRequest;
use App\Http\Requests\UpdateApplicationConsentRequest;
use App\Http\Requests\UpdateApplicationDocumentsRequest;
use App\Http\Requests\UpdateApplicationLocationRequest;
use App\Http\Requests\UpdateApplicationPreferencesRequest;
use App\Http\Requests\UpdateEducationRequest;
use App\Http\Requests\UpdateEmploymentHistoryRequest;
use App\Mail\ApplicationResumeLink;
use App\Mail\JobApplicationReceived;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobListing;
use App\Models\SiteSetting;
use App\Services\EligibilityService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ApplyController extends Controller
{
    use StoresUploadedFiles;

    private const SESSION_KEY = 'wizard.application_id';

    /**
     * Step 1 — contact info form.
     */
    public function create(Request $request): Response
    {
        $jobListing = $request->filled('job_listing')
            ? JobListing::query()->where('slug', $request->string('job_listing'))->active()->first()
            : null;

        $application = $this->currentApplication();

        return Inertia::render('public/apply/contact', [
            'jobListing' => $jobListing ? ['title' => $jobListing->title, 'slug' => $jobListing->slug] : null,
            'candidate' => $application?->candidate->only(['first_name', 'last_name', 'preferred_name', 'email', 'phone']),
        ]);
    }

    /**
     * Step 1 — create or resume the candidate's draft application.
     */
    public function store(StartApplicationRequest $request): RedirectResponse
    {
        $jobListing = $request->filled('job_listing')
            ? JobListing::query()->where('slug', $request->string('job_listing'))->active()->first()
            : null;

        $fullName = trim($request->validated('first_name').' '.$request->validated('last_name'));

        $candidate = Candidate::query()->firstOrCreate(
            ['email' => $request->validated('email')],
            [
                'full_name' => $fullName,
                'first_name' => $request->validated('first_name'),
                'last_name' => $request->validated('last_name'),
                'preferred_name' => $request->validated('preferred_name'),
                'phone' => $request->validated('phone'),
                'source' => 'wizard',
            ],
        );

        $candidate->fill([
            'full_name' => $fullName,
            'first_name' => $request->validated('first_name'),
            'last_name' => $request->validated('last_name'),
            'preferred_name' => $request->validated('preferred_name'),
            'phone' => $request->validated('phone'),
        ])->save();

        $application = Application::query()
            ->where('candidate_id', $candidate->id)
            ->where('source', 'wizard')
            ->whereIn('status', ['draft', 'started'])
            ->latest('id')
            ->first();

        if (! $application) {
            $application = Application::query()->create([
                'candidate_id' => $candidate->id,
                'job_listing_id' => $jobListing?->id,
                'source' => 'wizard',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        if (ApplicationStatus::from($application->status) === ApplicationStatus::Draft) {
            $application->transitionTo(ApplicationStatus::Started, reasonCode: 'wizard_started');
        }

        foreach (['contact_verification', 'eligibility_screen'] as $requirementType) {
            $application->requirements()->firstOrCreate(['requirement_type' => $requirementType]);
        }

        if ($application->resume_token === null) {
            $plaintext = $application->issueResumeToken();

            Mail::to($candidate->email)->queue(new ApplicationResumeLink($application, $plaintext));
        }

        session([self::SESSION_KEY => $application->id]);

        return to_route('apply.location.edit');
    }

    /**
     * Step 2 — location & eligibility form.
     */
    public function editLocation(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        return Inertia::render('public/apply/location', [
            'candidate' => $application->candidate->only(['address_line1', 'city', 'state', 'postal_code']),
        ]);
    }

    /**
     * Step 2 — run the eligibility check and either continue or hard-stop.
     */
    public function updateLocation(UpdateApplicationLocationRequest $request): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $application->candidate->fill($request->validated())->save();

        $requirement = $application->requirements()->where('requirement_type', 'eligibility_screen')->first();

        if (! app(EligibilityService::class)->isServiced($request->validated('state'))) {
            $requirement?->markFailed();
            $application->transitionTo(ApplicationStatus::Ineligible, reasonCode: 'service_area');
            session()->forget(self::SESSION_KEY);

            return to_route('apply.not-available');
        }

        $requirement?->markComplete();

        return to_route('apply.preferences.edit');
    }

    /**
     * Step 3 — work preferences form.
     */
    public function editPreferences(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        return Inertia::render('public/apply/preferences', [
            'application' => $application->only([
                'primary_specialty', 'secondary_specialty', 'desired_employment_type',
                'desired_start_timeframe', 'work_settings',
            ]),
        ]);
    }

    public function updatePreferences(UpdateApplicationPreferencesRequest $request): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $application->fill($request->validated())->save();

        return to_route('apply.employment-history.edit');
    }

    /**
     * Step 4 — employment history editor.
     */
    public function editEmploymentHistory(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        return Inertia::render('public/apply/employment-history', [
            'rows' => $application->candidate->employmentHistory()->orderBy('start_date', 'desc')->get(),
        ]);
    }

    public function updateEmploymentHistory(UpdateEmploymentHistoryRequest $request): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $candidate = $application->candidate;

        DB::transaction(function () use ($candidate, $request) {
            $candidate->employmentHistory()->delete();

            foreach ($request->validated('rows') as $row) {
                $candidate->employmentHistory()->create($row);
            }
        });

        return to_route('apply.education.edit');
    }

    /**
     * Step 5 — education editor.
     */
    public function editEducation(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        return Inertia::render('public/apply/education', [
            'rows' => $application->candidate->education()->orderBy('start_date', 'desc')->get(),
        ]);
    }

    public function updateEducation(UpdateEducationRequest $request): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $candidate = $application->candidate;

        DB::transaction(function () use ($candidate, $request) {
            $candidate->education()->delete();

            foreach ($request->validated('rows') as $row) {
                $candidate->education()->create($row);
            }
        });

        return to_route('apply.documents.edit');
    }

    /**
     * Step 6 — resume & optional credential upload.
     */
    public function editDocuments(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $resume = $application->documents()->where('document_type', 'resume')->first();

        return Inertia::render('public/apply/documents', [
            'resumeUrl' => $resume ? Storage::disk($resume->disk)->url($resume->file_path) : null,
            'resumeFilename' => $resume?->original_filename,
        ]);
    }

    public function updateDocuments(UpdateApplicationDocumentsRequest $request): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $hasExistingResume = $application->documents()->where('document_type', 'resume')->exists();

        if (! $request->hasFile('resume') && ! $hasExistingResume) {
            return back()->withErrors(['resume' => __('A resume is required.')]);
        }

        if ($request->hasFile('resume')) {
            $resume = $request->file('resume');
            $path = $this->storePublicFile($resume, 'resumes');

            $application->documents()->where('document_type', 'resume')->delete();

            $application->documents()->create([
                'candidate_id' => $application->candidate_id,
                'document_type' => 'resume',
                'disk' => 'public',
                'file_path' => $path,
                'original_filename' => $resume->getClientOriginalName(),
                'mime_type' => $resume->getMimeType() ?? $resume->getClientMimeType(),
                'file_size' => $resume->getSize() ?: 0,
                'uploaded_at' => now(),
            ]);
        }

        if ($request->boolean('add_credential')) {
            $scanDocumentId = null;

            if ($request->hasFile('credential_scan')) {
                $scan = $request->file('credential_scan');
                $path = $this->storePublicFile($scan, 'credentials');

                $scanDocument = $application->documents()->create([
                    'candidate_id' => $application->candidate_id,
                    'document_type' => 'credential_scan',
                    'disk' => 'public',
                    'file_path' => $path,
                    'original_filename' => $scan->getClientOriginalName(),
                    'mime_type' => $scan->getMimeType() ?? $scan->getClientMimeType(),
                    'file_size' => $scan->getSize() ?: 0,
                    'uploaded_at' => now(),
                ]);

                $scanDocumentId = $scanDocument->id;
            }

            $application->candidate->credentials()->create([
                'credential_type' => $request->validated('credential_type'),
                'credential_name' => $request->validated('credential_name'),
                'credential_number' => $request->validated('credential_number'),
                'issuing_authority' => $request->validated('issuing_authority'),
                'jurisdiction' => $request->validated('jurisdiction'),
                'issue_date' => $request->validated('issue_date'),
                'expiry_date' => $request->validated('expiry_date'),
                'document_id' => $scanDocumentId,
            ]);
        }

        return to_route('apply.consent.edit');
    }

    /**
     * Step 7 — consent & e-signature.
     */
    public function editConsent(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        return Inertia::render('public/apply/consent', [
            'signatureDefault' => $application->candidate->full_name,
        ]);
    }

    public function updateConsent(UpdateApplicationConsentRequest $request): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $application->fill([
            'consent_accepted_at' => now(),
            'consent_signature_name' => $request->validated('signature_name'),
        ])->save();

        return to_route('apply.review');
    }

    /**
     * Step 8 — read-only review before submission.
     */
    public function review(): Response|RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $application->load(['candidate.employmentHistory', 'candidate.education', 'candidate.credentials', 'documents']);

        return Inertia::render('public/apply/review', [
            'application' => $application,
        ]);
    }

    /**
     * Step 8 — final submission: seed the remaining requirements and
     * transition the application into recruiter-visible review.
     */
    public function submit(): RedirectResponse
    {
        $application = $this->currentApplication();

        if (! $application) {
            return to_route('apply.create');
        }

        $candidate = $application->candidate;

        $requirements = ['recruiter_review', 'background_check'];

        if ($candidate->employmentHistory()->exists()) {
            $requirements[] = 'employment_history_verification';
        }

        if ($candidate->education()->exists()) {
            $requirements[] = 'education_verification';
        }

        if ($candidate->credentials()->where('credential_type', 'license')->exists()) {
            $requirements[] = 'license_verification';
        }

        if ($candidate->credentials()->where('credential_type', 'certification')->exists()) {
            $requirements[] = 'certification_verification';
        }

        foreach ($requirements as $requirementType) {
            $application->requirements()->firstOrCreate(['requirement_type' => $requirementType]);
        }

        $application->transitionTo(ApplicationStatus::Submitted, reasonCode: 'wizard_submission');

        Mail::to(SiteSetting::get('email', config('mail.from.address')))
            ->queue(new JobApplicationReceived($application));

        session()->forget(self::SESSION_KEY);

        return to_route('apply.thank-you');
    }

    public function thankYou(): Response
    {
        return Inertia::render('public/apply/thank-you');
    }

    public function notAvailable(): Response
    {
        return Inertia::render('public/apply/not-available', [
            'servicedStates' => SiteSetting::get('service_area_states', 'NH'),
        ]);
    }

    /**
     * Redeem a resume-link token: verify contact info, restore the wizard
     * session, and continue the candidate at their first incomplete step.
     */
    public function resume(string $token): Response|RedirectResponse
    {
        $application = Application::query()->where('resume_token', hash('sha256', $token))->first();

        if (! $application) {
            return Inertia::render('public/apply/link-issue', ['reason' => 'invalid']);
        }

        if ($application->resumeTokenHasExpired()) {
            return Inertia::render('public/apply/link-issue', ['reason' => 'expired']);
        }

        $status = ApplicationStatus::from($application->status);

        if ($status === ApplicationStatus::Ineligible) {
            return to_route('apply.not-available');
        }

        if ($status === ApplicationStatus::Withdrawn) {
            return Inertia::render('public/apply/status', [
                'statusLabel' => $status->label(),
                'message' => __('This application was withdrawn.'),
            ]);
        }

        if ($status !== ApplicationStatus::Draft && $status !== ApplicationStatus::Started) {
            return Inertia::render('public/apply/status', [
                'statusLabel' => $status->label(),
                'message' => __('This application has already been submitted and is under review.'),
            ]);
        }

        $application->candidate->markContactVerified();
        $application->requirements()->where('requirement_type', 'contact_verification')->first()?->markComplete();

        session([self::SESSION_KEY => $application->id]);

        return $this->nextIncompleteStep($application);
    }

    /**
     * Request a fresh resume link for an expired or lost one.
     */
    public function resend(ResendApplicationLinkRequest $request): RedirectResponse
    {
        $candidate = Candidate::query()->where('email', $request->validated('email'))->first();

        $application = $candidate
            ? Application::query()
                ->where('candidate_id', $candidate->id)
                ->where('source', 'wizard')
                ->whereIn('status', ['draft', 'started'])
                ->latest('id')
                ->first()
            : null;

        if ($application) {
            $plaintext = $application->issueResumeToken();

            Mail::to($candidate->email)->queue(new ApplicationResumeLink($application, $plaintext));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('If we found an application for that email, a new link is on its way.')]);

        return back();
    }

    private function currentApplication(): ?Application
    {
        $id = session(self::SESSION_KEY);

        if (! $id) {
            return null;
        }

        return Application::query()->with('candidate')->where('id', $id)->first();
    }

    private function nextIncompleteStep(Application $application): RedirectResponse
    {
        $candidate = $application->candidate;

        if (! $candidate->city) {
            return to_route('apply.location.edit');
        }

        if (! $application->primary_specialty) {
            return to_route('apply.preferences.edit');
        }

        if (! $candidate->employmentHistory()->exists() && ! $candidate->education()->exists()) {
            return to_route('apply.employment-history.edit');
        }

        if (! $application->documents()->where('document_type', 'resume')->exists()) {
            return to_route('apply.documents.edit');
        }

        if (! $application->consent_accepted_at) {
            return to_route('apply.consent.edit');
        }

        return to_route('apply.review');
    }
}
