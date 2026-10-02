<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApplicationStatus;
use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\CommunicationTemplate;
use App\Models\User;
use App\Support\ApplicationStateMachine;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CandidateController extends Controller
{
    /**
     * Show a candidate's full dossier: every application they've made,
     * plus their credentials, documents, employment history, and education.
     */
    public function show(Candidate $candidate): Response
    {
        $candidate->load([
            'applications' => fn ($query) => $query->latest(),
            'applications.jobListing:id,title',
            'applications.requirements',
            'applications.stageHistory.changedBy:id,name',
            'applications.recruiter:id,name',
            'applications.communications.sentBy:id,name',
            'applications.documents',
            'credentials.verifier:id,name',
            'documents',
            'employmentHistory',
            'education',
        ]);

        $applications = $candidate->applications->map(function ($application) {
            $resume = $application->documents->firstWhere('document_type', 'resume');

            return [
                ...$application->toArray(),
                'resume_url' => $resume ? Storage::disk($resume->disk)->url($resume->file_path) : null,
                'allowed_statuses' => array_map(
                    fn (ApplicationStatus $status) => ['value' => $status->value, 'label' => $status->label()],
                    ApplicationStateMachine::allowedFrom(ApplicationStatus::from($application->status)),
                ),
            ];
        });

        $documents = $candidate->documents->map(fn ($document) => [
            ...$document->toArray(),
            'url' => Storage::disk($document->disk)->url($document->file_path),
        ]);

        return Inertia::render('admin/candidates/show', [
            'candidate' => [
                ...$candidate->toArray(),
                'documents' => $documents,
            ],
            'applications' => $applications,
            'recruiters' => User::query()->orderBy('name')->get(['id', 'name']),
            'communicationTemplates' => CommunicationTemplate::query()->orderBy('name')->get(),
        ]);
    }
}
