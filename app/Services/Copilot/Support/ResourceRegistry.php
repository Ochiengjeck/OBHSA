<?php

namespace App\Services\Copilot\Support;

use App\Http\Requests\Admin\UpdateAssessmentRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Http\Requests\Admin\UpdateCommunicationTemplateRequest;
use App\Http\Requests\Admin\UpdateFacilityRequest;
use App\Http\Requests\Admin\UpdateInterviewQuestionRequest;
use App\Http\Requests\Admin\UpdateJobListingRequest;
use App\Http\Requests\Admin\UpdateOnboardingChecklistTemplateRequest;
use App\Http\Requests\Admin\UpdatePolicyDocumentRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Requests\Admin\UpdateStatRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\BlogPost;
use App\Models\CommunicationTemplate;
use App\Models\Credential;
use App\Models\Employee;
use App\Models\Facility;
use App\Models\Interview;
use App\Models\InterviewQuestion;
use App\Models\JobListing;
use App\Models\OnboardingChecklistTemplate;
use App\Models\Page;
use App\Models\PolicyDocument;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\StaffingRequest;
use App\Models\Stat;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

/**
 * Every admin resource the copilot's generic read/update tools can touch,
 * beyond the ones already covered by a dedicated tool (applications,
 * candidates — see ListApplicationsTool/SearchCandidatesTool/
 * GetCandidateDossierTool). One small registry instead of a class per
 * resource.
 */
final class ResourceRegistry
{
    /**
     * Every resource exposed to list_records/get_record. Each entry:
     * model class, the permission prefix ("<prefix>.view"/".update"),
     * the columns safe to return (never a password/token/secret column),
     * and relations to eager-load for a readable result.
     *
     * @return array<string, array{model: class-string<Model>, permission_prefix: string, columns: list<string>, with: list<string>}>
     */
    public static function readable(): array
    {
        return [
            'pages' => [
                'model' => Page::class,
                'permission_prefix' => 'pages',
                'columns' => ['id', 'slug', 'title', 'meta_description', 'is_published'],
                'with' => [],
            ],
            'services' => [
                'model' => Service::class,
                'permission_prefix' => 'services',
                'columns' => ['id', 'slug', 'title', 'summary', 'description', 'icon', 'position', 'is_active'],
                'with' => [],
            ],
            'job-listings' => [
                'model' => JobListing::class,
                'permission_prefix' => 'job-listings',
                'columns' => [
                    'id', 'title', 'slug', 'specialty', 'employment_type', 'location_city', 'location_state',
                    'shift', 'pay_range_min', 'pay_range_max', 'is_active', 'posted_at', 'closes_at',
                ],
                'with' => [],
            ],
            'interviews' => [
                'model' => Interview::class,
                'permission_prefix' => 'interviews',
                'columns' => ['id', 'application_id', 'interviewer_id', 'scheduled_at', 'format', 'location_or_link', 'status', 'recommendation', 'completed_at'],
                'with' => ['application.candidate:id,full_name', 'interviewer:id,name'],
            ],
            'interview-questions' => [
                'model' => InterviewQuestion::class,
                'permission_prefix' => 'interview-questions',
                'columns' => ['id', 'question', 'specialty', 'is_active', 'position'],
                'with' => [],
            ],
            'assessments' => [
                'model' => Assessment::class,
                'permission_prefix' => 'assessments',
                'columns' => ['id', 'name', 'description', 'delivery_mode', 'passing_score', 'max_attempts', 'is_active'],
                'with' => [],
            ],
            'assessment-attempts' => [
                'model' => AssessmentAttempt::class,
                'permission_prefix' => 'assessment-attempts',
                // access_token / access_token_expires_at excluded — secrets.
                'columns' => ['id', 'assessment_id', 'application_id', 'attempt_number', 'status', 'score', 'passed', 'started_at', 'submitted_at'],
                'with' => ['assessment:id,name'],
            ],
            'communication-templates' => [
                'model' => CommunicationTemplate::class,
                'permission_prefix' => 'communication-templates',
                'columns' => ['id', 'name', 'subject', 'body'],
                'with' => [],
            ],
            'onboarding' => [
                'model' => OnboardingChecklistTemplate::class,
                'permission_prefix' => 'onboarding',
                'columns' => ['id', 'name', 'description', 'is_default', 'is_active'],
                'with' => [],
            ],
            'employees' => [
                'model' => Employee::class,
                'permission_prefix' => 'employees',
                'columns' => ['id', 'candidate_id', 'application_id', 'employee_number', 'hire_date', 'status', 'specialty', 'pay_rate', 'terminated_at'],
                'with' => ['candidate:id,full_name'],
            ],
            'compliance' => [
                'model' => Credential::class,
                'permission_prefix' => 'compliance',
                // credential_number excluded — sensitive identifier.
                'columns' => ['id', 'candidate_id', 'credential_type', 'credential_name', 'issuing_authority', 'jurisdiction', 'issue_date', 'expiry_date', 'verification_status'],
                'with' => ['candidate:id,full_name'],
            ],
            'facilities' => [
                'model' => Facility::class,
                'permission_prefix' => 'facilities',
                'columns' => ['id', 'name', 'address_line1', 'city', 'state', 'postal_code', 'facility_type', 'is_active'],
                'with' => [],
            ],
            'policy-documents' => [
                'model' => PolicyDocument::class,
                'permission_prefix' => 'policy-documents',
                'columns' => ['id', 'title', 'body', 'is_active'],
                'with' => [],
            ],
            'blog-posts' => [
                'model' => BlogPost::class,
                'permission_prefix' => 'blog-posts',
                'columns' => ['id', 'title', 'slug', 'excerpt', 'is_published', 'published_at'],
                'with' => [],
            ],
            'testimonials' => [
                'model' => Testimonial::class,
                'permission_prefix' => 'testimonials',
                'columns' => ['id', 'author_name', 'author_role', 'quote', 'rating', 'is_featured', 'position'],
                'with' => [],
            ],
            'stats' => [
                'model' => Stat::class,
                'permission_prefix' => 'stats',
                'columns' => ['id', 'label', 'value', 'icon', 'position', 'is_active'],
                'with' => [],
            ],
            'staffing-requests' => [
                'model' => StaffingRequest::class,
                'permission_prefix' => 'staffing-requests',
                'columns' => ['id', 'facility_name', 'contact_name', 'email', 'phone', 'facility_type', 'staffing_needs', 'status', 'handled_by', 'notes'],
                'with' => ['handler:id,name'],
            ],
            'site-settings' => [
                'model' => SiteSetting::class,
                'permission_prefix' => 'site-settings',
                'columns' => ['id', 'key', 'value', 'type', 'group'],
                'with' => [],
            ],
            'users' => [
                'model' => User::class,
                'permission_prefix' => 'users',
                // Never password / two_factor_secret / two_factor_recovery_codes / remember_token.
                'columns' => ['id', 'name', 'email', 'created_at'],
                'with' => [],
            ],
            'roles' => [
                'model' => Role::class,
                'permission_prefix' => 'roles',
                'columns' => ['id', 'name'],
                'with' => ['permissions:id,name'],
            ],
        ];
    }

    /**
     * The subset of readable() resources the copilot may also update, via
     * a single generic validated-update tool. Deliberately excludes:
     * interviews/assessment-attempts (state machines, not plain field
     * sets), roles/users (protected-name, password, self-delete guards),
     * employees/compliance (no "update" permission exists for either),
     * site-settings (a key/value table, not a single-row-by-id resource),
     * pages (its update validates a nested `sections` array tied to
     * PageSection rows, not a flat field set), and staffing-requests
     * (its own admin controller mass-assigns `status`/`handled_by`, which
     * aren't on StaffingRequest's #[Fillable] list — confirmed empirically
     * that update() silently drops them — so exposing it here would
     * silently no-op too; pre-existing bug, out of scope to fix here).
     *
     * `update_request` supplies the validation rules (reused exactly as
     * the human-facing controller enforces them); `updatable_fields` is
     * the explicit whitelist of real column names allowed through to
     * $record->update() — never an upload-only rule key like "image" that
     * has no matching column.
     *
     * @return array<string, array{update_request: class-string, updatable_fields: list<string>}>
     */
    public static function writable(): array
    {
        return [
            'services' => [
                'update_request' => UpdateServiceRequest::class,
                'updatable_fields' => ['title', 'summary', 'description', 'icon', 'position', 'is_active'],
            ],
            'job-listings' => [
                'update_request' => UpdateJobListingRequest::class,
                'updatable_fields' => [
                    'title', 'specialty', 'employment_type', 'location_city', 'location_state',
                    'shift', 'pay_range_min', 'pay_range_max', 'description', 'requirements', 'is_active', 'closes_at',
                ],
            ],
            'interview-questions' => [
                'update_request' => UpdateInterviewQuestionRequest::class,
                'updatable_fields' => ['question', 'specialty', 'is_active', 'position'],
            ],
            'assessments' => [
                'update_request' => UpdateAssessmentRequest::class,
                'updatable_fields' => ['name', 'description', 'delivery_mode', 'passing_score', 'max_attempts', 'is_active'],
            ],
            'communication-templates' => [
                'update_request' => UpdateCommunicationTemplateRequest::class,
                'updatable_fields' => ['name', 'subject', 'body'],
            ],
            'onboarding' => [
                'update_request' => UpdateOnboardingChecklistTemplateRequest::class,
                'updatable_fields' => ['name', 'description', 'is_default', 'is_active'],
            ],
            'facilities' => [
                'update_request' => UpdateFacilityRequest::class,
                'updatable_fields' => [
                    'name', 'address_line1', 'city', 'state', 'postal_code',
                    'contact_name', 'contact_phone', 'contact_email', 'facility_type', 'is_active',
                ],
            ],
            'policy-documents' => [
                'update_request' => UpdatePolicyDocumentRequest::class,
                'updatable_fields' => ['title', 'body', 'is_active'],
            ],
            'blog-posts' => [
                'update_request' => UpdateBlogPostRequest::class,
                'updatable_fields' => ['title', 'excerpt', 'body', 'is_published', 'published_at'],
            ],
            'testimonials' => [
                'update_request' => UpdateTestimonialRequest::class,
                'updatable_fields' => ['author_name', 'author_role', 'quote', 'rating', 'position', 'is_featured'],
            ],
            'stats' => [
                'update_request' => UpdateStatRequest::class,
                'updatable_fields' => ['label', 'value', 'icon', 'position', 'is_active'],
            ],
        ];
    }
}
