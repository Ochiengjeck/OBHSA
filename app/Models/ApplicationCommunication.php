<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Immutable log of candidate-facing emails sent from the admin dossier.
 *
 * @property int $id
 * @property int $application_id
 * @property int|null $communication_template_id
 * @property int|null $sent_by
 * @property string $subject
 * @property string $body
 */
#[Fillable(['application_id', 'communication_template_id', 'sent_by', 'subject', 'body'])]
class ApplicationCommunication extends Model
{
    protected $table = 'application_communications';

    public const UPDATED_AT = null;

    /**
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * @return BelongsTo<CommunicationTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(CommunicationTemplate::class, 'communication_template_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function sentBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }
}
