<?php

namespace App\Services\Copilot\Tools;

use App\Mail\CandidateMessage;
use App\Models\Application;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use Illuminate\Support\Facades\Mail;

/**
 * Write, requires confirmation — wraps
 * Admin\JobApplicationController::sendMessage().
 */
class SendCandidateMessageTool implements CopilotTool
{
    public function name(): string
    {
        return 'send_candidate_message';
    }

    public function description(): string
    {
        return 'Send an email to a candidate and log it against their application.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'application_id' => ['type' => 'integer', 'description' => 'The application\'s id.'],
                'subject' => ['type' => 'string'],
                'body' => ['type' => 'string'],
            ],
            'required' => ['application_id', 'subject', 'body'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return true;
    }

    public function authorize(User $user): bool
    {
        return $user->can('applications.update');
    }

    public function execute(User $user, array $arguments): array
    {
        $application = Application::query()->findOrFail((int) $arguments['application_id']);
        $subject = (string) $arguments['subject'];
        $body = (string) $arguments['body'];

        $application->communications()->create([
            'sent_by' => $user->id,
            'subject' => $subject,
            'body' => $body,
        ]);

        Mail::to($application->candidate->email)
            ->queue(new CandidateMessage($application, $subject, $body));

        return ['success' => true, 'message' => "Message sent to {$application->candidate->full_name}."];
    }
}
