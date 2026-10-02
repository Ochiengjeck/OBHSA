<?php

namespace Database\Seeders;

use App\Models\InterviewQuestion;
use Illuminate\Database\Seeder;

class InterviewQuestionSeeder extends Seeder
{
    /**
     * Seed starter interview questions: general plus a couple of
     * specialty-specific examples.
     */
    public function run(): void
    {
        $questions = [
            ['question' => 'Tell us about your experience as a caregiver and what drew you to this field.', 'specialty' => null, 'position' => 0],
            ['question' => 'Describe a time you handled a difficult or distressed patient. What did you do?', 'specialty' => null, 'position' => 1],
            ['question' => 'How do you prioritize tasks during a busy shift with competing demands?', 'specialty' => null, 'position' => 2],
            ['question' => 'How do you handle disagreements with a coworker or supervisor?', 'specialty' => null, 'position' => 3],
            ['question' => 'What does excellent patient care mean to you?', 'specialty' => null, 'position' => 4],
            ['question' => 'Walk us through how you would administer medication safely and document it.', 'specialty' => 'rn', 'position' => 5],
            ['question' => 'How do you support a patient with activities of daily living while preserving their dignity?', 'specialty' => 'cna', 'position' => 6],
        ];

        foreach ($questions as $question) {
            InterviewQuestion::query()->updateOrCreate(['question' => $question['question']], $question);
        }
    }
}
