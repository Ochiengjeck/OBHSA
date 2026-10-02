<?php

namespace Database\Seeders;

use App\Models\CommunicationTemplate;
use Illuminate\Database\Seeder;

class CommunicationTemplateSeeder extends Seeder
{
    /**
     * Seed starter candidate-communication templates.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Request More Info',
                'subject' => 'A quick follow-up on your OBHSA application',
                'body' => "Hi {{candidate_name}},\n\nThanks for applying to OBHSA for the {{position}} role. We just need a bit more information to continue reviewing your application — could you reply to this email with the details we discussed?\n\nThanks,\nThe OBHSA Recruiting Team",
            ],
            [
                'name' => 'Interview Invitation',
                'subject' => "Let's schedule your OBHSA interview",
                'body' => "Hi {{candidate_name}},\n\nWe'd love to talk with you about the {{position}} role. Please reply with a few times that work for you this week and we'll get something on the calendar.\n\nLooking forward to connecting,\nThe OBHSA Recruiting Team",
            ],
            [
                'name' => 'Not Moving Forward',
                'subject' => 'Update on your OBHSA application',
                'body' => "Hi {{candidate_name}},\n\nThank you for your interest in the {{position}} role with OBHSA. After careful review, we won't be moving forward with your application at this time. We'll keep your information on file and may reach out about future opportunities.\n\nWe wish you the best,\nThe OBHSA Recruiting Team",
            ],
        ];

        foreach ($templates as $template) {
            CommunicationTemplate::query()->updateOrCreate(['name' => $template['name']], $template);
        }
    }
}
