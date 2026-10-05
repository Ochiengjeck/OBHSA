<?php

namespace App\Services\Copilot\Tools;

use App\Mail\CandidateMessage;
use App\Models\Application;
use App\Models\CommunicationTemplate;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Tools\Concerns\AuthorizesViaPermission;
use Illuminate\Support\Facades\Mail;

/**
 * Write, requires confirmation — like SendCandidateMessageTool, but
 * renders an existing CommunicationTemplate instead of taking free-form
 * subject/body. The {{candidate_name}}/{{position}} substitution mirrors
 * resources/js/components/admin/candidates/application-panel.tsx's
 * client-side substitutePlaceholders(), server-side — there's no
 * existing server-side renderer for templates to reuse.
 */
class SendTemplatedCandidateMessageTool implements CopilotTool
{
    use AuthorizesViaPermission;

    public function name(): string
    {
        return 'send_templated_candidate_message';
    }

    public function description(): string
    {
        return 'Send a candidate an email using one of the saved communication templates (e.g. an interview '
            .'invitation), substituting {{candidate_name}} and {{position}}, and logging it against their application.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'application_id' => ['type' => 'integer', 'description' => 'The application\'s id.'],
                'communication_template_id' => ['type' => 'integer', 'description' => 'The template\'s id.'],
            ],
            'required' => ['application_id', 'communication_template_id'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return true;
    }

    protected function permission(): string
    {
        return 'applications.update';
    }

    public function execute(User $user, array $arguments): array
    {
        $application = Application::query()->with('jobListing', 'candidate')->findOrFail((int) $arguments['application_id']);
        $template = CommunicationTemplate::query()->findOrFail((int) $arguments['communication_template_id']);

        $jobListing = $application->jobListing;
        $position = $jobListing === null ? 'General Application' : $jobListing->title;
        $substitute = fn (string $text): string => str_replace(
            ['{{candidate_name}}', '{{position}}'],
            [$application->candidate->full_name, $position],
            $text,
        );

        $subject = $substitute($template->subject);
        $body = $substitute($template->body);

        $application->communications()->create([
            'communication_template_id' => $template->id,
            'sent_by' => $user->id,
            'subject' => $subject,
            'body' => $body,
        ]);

        Mail::to($application->candidate->email)
            ->queue(new CandidateMessage($application, $subject, $body));

        return [
            'success' => true,
            'message' => "Message sent to {$application->candidate->full_name} using template \"{$template->name}\".",
        ];
    }
}
