<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $onboarding_checklist_template_id
 * @property string $task_key
 * @property string $label
 * @property bool $is_blocking
 * @property int $position
 */
#[Fillable(['onboarding_checklist_template_id', 'task_key', 'label', 'is_blocking', 'position'])]
class OnboardingChecklistTemplateItem extends Model
{
    protected function casts(): array
    {
        return [
            'is_blocking' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<OnboardingChecklistTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(OnboardingChecklistTemplate::class, 'onboarding_checklist_template_id');
    }
}
