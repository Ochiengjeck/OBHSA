<?php

namespace App\Services;

use App\Concerns\StoresUploadedFiles;
use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobListing;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class JobApplicationIntakeService
{
    use StoresUploadedFiles;

    /**
     * Minimal requirement set seeded for an application taken through the
     * legacy single-page form, until the full wizard (Phase 2) replaces it.
     *
     * @var list<string>
     */
    private const array INITIAL_REQUIREMENTS = [
        'contact_verification',
        'eligibility_screen',
        'recruiter_review',
    ];

    /**
     * Submit a job application from the public single-page form: find or
     * create the candidate, create the application, store the resume, and
     * seed the initial requirement checklist.
     */
    public function submit(
        string $fullName,
        string $email,
        string $phone,
        ?string $coverNote,
        JobListing $jobListing,
        UploadedFile $resume,
        string $ipAddress,
        ?string $userAgent,
    ): Application {
        return DB::transaction(function () use ($fullName, $email, $phone, $coverNote, $jobListing, $resume, $ipAddress, $userAgent) {
            $candidate = Candidate::query()->firstOrCreate(
                ['email' => $email],
                ['full_name' => $fullName, 'phone' => $phone, 'source' => 'public_form'],
            );

            $application = Application::query()->create([
                'candidate_id' => $candidate->id,
                'job_listing_id' => $jobListing->id,
                'cover_note' => $coverNote,
                'source' => 'legacy_single_page_form',
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            $path = $this->storePublicFile($resume, 'resumes');

            $application->documents()->create([
                'candidate_id' => $candidate->id,
                'document_type' => 'resume',
                'disk' => 'public',
                'file_path' => $path,
                'original_filename' => $resume->getClientOriginalName(),
                'mime_type' => $resume->getMimeType() ?? $resume->getClientMimeType(),
                'file_size' => $resume->getSize() ?: 0,
                'uploaded_at' => now(),
            ]);

            foreach (self::INITIAL_REQUIREMENTS as $requirementType) {
                $application->requirements()->create([
                    'requirement_type' => $requirementType,
                ]);
            }

            $application->transitionTo(
                ApplicationStatus::Submitted,
                actor: null,
                reasonCode: 'legacy_intake',
            );

            return $application;
        });
    }
}
