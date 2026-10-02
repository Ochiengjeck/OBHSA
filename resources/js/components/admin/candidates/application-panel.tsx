import { Link, router, useForm } from '@inertiajs/react';
import { AlertTriangle, FileText } from 'lucide-react';
import { useState } from 'react';
import { BackgroundCheckRow } from '@/components/admin/candidates/background-check-row';
import { StatusBadge } from '@/components/admin/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import { REVIEW_REASON_CODES } from '@/lib/review-reason-codes';
import type {
    Assessment,
    CandidateApplication,
    CommunicationTemplate,
    RecruiterOption,
} from '@/types';

function substitutePlaceholders(
    text: string,
    candidateName: string,
    position: string,
) {
    return text
        .replaceAll('{{candidate_name}}', candidateName)
        .replaceAll('{{position}}', position);
}

export function ApplicationPanel({
    application,
    candidateFullName,
    recruiters,
    templates,
    assessments,
}: {
    application: CandidateApplication;
    candidateFullName: string;
    recruiters: RecruiterOption[];
    templates: CommunicationTemplate[];
    assessments: Pick<Assessment, 'id' | 'name' | 'max_attempts'>[];
}) {
    const position = application.job_listing?.title ?? 'General Application';

    const statusForm = useForm({
        status: application.allowed_statuses[0]?.value ?? '',
        reason: '',
        reason_code: '',
    });

    const recruiterForm = useForm({
        assigned_recruiter_id: application.recruiter?.id ?? null,
    });

    const messageForm = useForm({
        communication_template_id: null as number | null,
        subject: '',
        body: '',
    });

    const scheduleForm = useForm({
        scheduled_at: '',
        interviewer_id: null as number | null,
        format: 'phone',
        location_or_link: '',
    });

    const backgroundCheckForm = useForm({ provider: '' });

    const assignAssessmentForm = useForm({
        assessment_id: null as number | null,
    });

    const [showMessagePanel, setShowMessagePanel] = useState(false);
    const [showSchedulePanel, setShowSchedulePanel] = useState(false);
    const [showBackgroundCheckPanel, setShowBackgroundCheckPanel] =
        useState(false);
    const [showAssignAssessmentPanel, setShowAssignAssessmentPanel] =
        useState(false);

    function submitStatus(event: React.FormEvent) {
        event.preventDefault();
        statusForm.put(admin.jobApplications.update(application.id).url, {
            preserveScroll: true,
        });
    }

    function submitRecruiter(value: string) {
        recruiterForm.setData(
            'assigned_recruiter_id',
            value === 'unassigned' ? null : Number(value),
        );
        recruiterForm.put(admin.jobApplications.recruiter(application.id).url, {
            preserveScroll: true,
        });
    }

    function applyTemplate(templateId: string) {
        const template = templates.find((t) => t.id === Number(templateId));

        if (!template) {
            return;
        }

        messageForm.setData({
            communication_template_id: template.id,
            subject: substitutePlaceholders(
                template.subject,
                candidateFullName,
                position,
            ),
            body: substitutePlaceholders(
                template.body,
                candidateFullName,
                position,
            ),
        });
    }

    function submitMessage(event: React.FormEvent) {
        event.preventDefault();
        messageForm.post(admin.jobApplications.message(application.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                messageForm.reset();
                setShowMessagePanel(false);
            },
        });
    }

    function submitSchedule(event: React.FormEvent) {
        event.preventDefault();
        scheduleForm.post(
            admin.jobApplications.interviews.store(application.id).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    scheduleForm.reset();
                    setShowSchedulePanel(false);
                },
            },
        );
    }

    function submitBackgroundCheck(event: React.FormEvent) {
        event.preventDefault();
        backgroundCheckForm.post(
            admin.jobApplications.backgroundChecks.store(application.id).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    backgroundCheckForm.reset();
                    setShowBackgroundCheckPanel(false);
                },
            },
        );
    }

    function submitAssignAssessment(event: React.FormEvent) {
        event.preventDefault();
        assignAssessmentForm.post(
            admin.jobApplications.assessmentAttempts.store(application.id).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    assignAssessmentForm.reset();
                    setShowAssignAssessmentPanel(false);
                },
            },
        );
    }

    const hasActiveBackgroundCheck = application.background_checks.some(
        (check) => check.status === 'initiated',
    );

    const blockingRequirements = application.requirements.filter(
        (requirement) =>
            requirement.is_blocking && requirement.status !== 'passed',
    );

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>{position}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Submitted{' '}
                        {new Date(application.created_at).toLocaleDateString()}
                    </p>
                </div>
                <StatusBadge status={application.status} />
            </CardHeader>
            <CardContent className="space-y-5">
                {blockingRequirements.length > 0 && (
                    <Alert variant="destructive">
                        <AlertTriangle />
                        <AlertTitle>Blocking this candidate</AlertTitle>
                        <AlertDescription>
                            {blockingRequirements
                                .map((requirement) =>
                                    requirement.requirement_type.replaceAll(
                                        '_',
                                        ' ',
                                    ),
                                )
                                .join(', ')}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-2">
                    <Label>Recruiter</Label>
                    <Select
                        value={
                            recruiterForm.data.assigned_recruiter_id
                                ? String(
                                      recruiterForm.data.assigned_recruiter_id,
                                  )
                                : 'unassigned'
                        }
                        onValueChange={submitRecruiter}
                    >
                        <SelectTrigger className="w-64">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unassigned">
                                Unassigned
                            </SelectItem>
                            {recruiters.map((recruiter) => (
                                <SelectItem
                                    key={recruiter.id}
                                    value={String(recruiter.id)}
                                >
                                    {recruiter.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {application.requirements.length > 0 && (
                    <div className="grid gap-2">
                        <Label className="text-muted-foreground">
                            Requirements
                        </Label>
                        <div className="space-y-1.5">
                            {application.requirements.map((requirement) => (
                                <div
                                    key={requirement.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="capitalize">
                                        {requirement.requirement_type.replaceAll(
                                            '_',
                                            ' ',
                                        )}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {requirement.status ===
                                            'not_started' && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="text-xs font-medium text-primary hover:underline"
                                                    onClick={() =>
                                                        router.put(
                                                            admin.applicationRequirements.update(
                                                                requirement.id,
                                                            ).url,
                                                            {
                                                                status: 'passed',
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Pass
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-xs font-medium text-destructive hover:underline"
                                                    onClick={() =>
                                                        router.put(
                                                            admin.applicationRequirements.update(
                                                                requirement.id,
                                                            ).url,
                                                            {
                                                                status: 'failed',
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Fail
                                                </button>
                                            </>
                                        )}
                                        <StatusBadge
                                            status={requirement.status}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {application.allowed_statuses.length > 0 ? (
                    <form onSubmit={submitStatus} className="space-y-3">
                        <Separator />
                        <Label>Update Status</Label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Select
                                value={statusForm.data.status}
                                onValueChange={(value) =>
                                    statusForm.setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {application.allowed_statuses.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusForm.data.reason_code || 'none'}
                                onValueChange={(value) =>
                                    statusForm.setData(
                                        'reason_code',
                                        value === 'none' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Reason code (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        No reason code
                                    </SelectItem>
                                    {REVIEW_REASON_CODES.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Textarea
                            rows={2}
                            placeholder="Reason (optional)"
                            value={statusForm.data.reason}
                            onChange={(e) =>
                                statusForm.setData('reason', e.target.value)
                            }
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={statusForm.processing}
                        >
                            {statusForm.processing
                                ? 'Saving...'
                                : 'Update Status'}
                        </Button>
                    </form>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        This application is in a terminal state — no further
                        transitions are available.
                    </p>
                )}

                {application.resume_url && (
                    <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                        <FileText className="size-4" />
                        View Resume
                    </a>
                )}

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Communication</Label>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setShowMessagePanel(!showMessagePanel)
                            }
                        >
                            {showMessagePanel ? 'Cancel' : 'Send a Message'}
                        </Button>
                    </div>

                    {showMessagePanel && (
                        <form
                            onSubmit={submitMessage}
                            className="space-y-3 rounded-lg border border-border p-3"
                        >
                            <Select onValueChange={applyTemplate}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Start from a template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem
                                            key={template.id}
                                            value={String(template.id)}
                                        >
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Subject"
                                value={messageForm.data.subject}
                                onChange={(e) =>
                                    messageForm.setData(
                                        'subject',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <Textarea
                                rows={6}
                                placeholder="Message"
                                value={messageForm.data.body}
                                onChange={(e) =>
                                    messageForm.setData('body', e.target.value)
                                }
                                required
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={messageForm.processing}
                            >
                                {messageForm.processing
                                    ? 'Sending...'
                                    : 'Send Email'}
                            </Button>
                        </form>
                    )}

                    {application.communications.length > 0 && (
                        <div className="space-y-2">
                            {application.communications.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="rounded-md border border-border p-2 text-xs"
                                >
                                    <p className="font-medium text-foreground">
                                        {entry.subject}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {new Date(
                                            entry.created_at,
                                        ).toLocaleString()}
                                        {entry.sent_by &&
                                            ` · ${entry.sent_by.name}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Interviews</Label>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setShowSchedulePanel(!showSchedulePanel)
                            }
                        >
                            {showSchedulePanel
                                ? 'Cancel'
                                : 'Schedule Interview'}
                        </Button>
                    </div>

                    {showSchedulePanel && (
                        <form
                            onSubmit={submitSchedule}
                            className="space-y-3 rounded-lg border border-border p-3"
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Input
                                    type="datetime-local"
                                    value={scheduleForm.data.scheduled_at}
                                    onChange={(e) =>
                                        scheduleForm.setData(
                                            'scheduled_at',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <Select
                                    value={
                                        scheduleForm.data.interviewer_id
                                            ? String(
                                                  scheduleForm.data
                                                      .interviewer_id,
                                              )
                                            : 'unassigned'
                                    }
                                    onValueChange={(value) =>
                                        scheduleForm.setData(
                                            'interviewer_id',
                                            value === 'unassigned'
                                                ? null
                                                : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Interviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">
                                            Unassigned
                                        </SelectItem>
                                        {recruiters.map((recruiter) => (
                                            <SelectItem
                                                key={recruiter.id}
                                                value={String(recruiter.id)}
                                            >
                                                {recruiter.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={scheduleForm.data.format}
                                    onValueChange={(value) =>
                                        scheduleForm.setData('format', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="phone">
                                            Phone
                                        </SelectItem>
                                        <SelectItem value="video">
                                            Video
                                        </SelectItem>
                                        <SelectItem value="in_person">
                                            In Person
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Location or link (optional)"
                                    value={scheduleForm.data.location_or_link}
                                    onChange={(e) =>
                                        scheduleForm.setData(
                                            'location_or_link',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={scheduleForm.processing}
                            >
                                {scheduleForm.processing
                                    ? 'Scheduling...'
                                    : 'Schedule'}
                            </Button>
                        </form>
                    )}

                    {application.interviews.length > 0 && (
                        <div className="space-y-2">
                            {application.interviews.map((interview) => (
                                <Link
                                    key={interview.id}
                                    href={admin.interviews.show(interview.id)}
                                    className="flex items-center justify-between rounded-md border border-border p-2 text-xs hover:bg-muted/50"
                                >
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {new Date(
                                                interview.scheduled_at,
                                            ).toLocaleString()}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {interview.interviewer?.name ??
                                                'Unassigned'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {interview.recommendation && (
                                            <StatusBadge
                                                status={
                                                    interview.recommendation
                                                }
                                            />
                                        )}
                                        <StatusBadge
                                            status={interview.status}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Background Check</Label>
                        {!hasActiveBackgroundCheck && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    setShowBackgroundCheckPanel(
                                        !showBackgroundCheckPanel,
                                    )
                                }
                            >
                                {showBackgroundCheckPanel
                                    ? 'Cancel'
                                    : 'Initiate Background Check'}
                            </Button>
                        )}
                    </div>

                    {showBackgroundCheckPanel && (
                        <form
                            onSubmit={submitBackgroundCheck}
                            className="space-y-3 rounded-lg border border-border p-3"
                        >
                            <Input
                                placeholder="Provider (e.g. Checkr)"
                                value={backgroundCheckForm.data.provider}
                                onChange={(e) =>
                                    backgroundCheckForm.setData(
                                        'provider',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={backgroundCheckForm.processing}
                            >
                                {backgroundCheckForm.processing
                                    ? 'Initiating...'
                                    : 'Initiate'}
                            </Button>
                        </form>
                    )}

                    {application.background_checks.length > 0 && (
                        <div className="space-y-2">
                            {application.background_checks.map((check) => (
                                <BackgroundCheckRow
                                    key={check.id}
                                    check={check}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Assessments</Label>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setShowAssignAssessmentPanel(
                                    !showAssignAssessmentPanel,
                                )
                            }
                        >
                            {showAssignAssessmentPanel
                                ? 'Cancel'
                                : 'Assign Assessment'}
                        </Button>
                    </div>

                    {showAssignAssessmentPanel && (
                        <form
                            onSubmit={submitAssignAssessment}
                            className="space-y-3 rounded-lg border border-border p-3"
                        >
                            <Select
                                value={
                                    assignAssessmentForm.data.assessment_id
                                        ? String(
                                              assignAssessmentForm.data
                                                  .assessment_id,
                                          )
                                        : undefined
                                }
                                onValueChange={(value) =>
                                    assignAssessmentForm.setData(
                                        'assessment_id',
                                        Number(value),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an assessment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assessments.map((assessment) => (
                                        <SelectItem
                                            key={assessment.id}
                                            value={String(assessment.id)}
                                        >
                                            {assessment.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    assignAssessmentForm.processing ||
                                    !assignAssessmentForm.data.assessment_id
                                }
                            >
                                {assignAssessmentForm.processing
                                    ? 'Assigning...'
                                    : 'Assign'}
                            </Button>
                        </form>
                    )}

                    {application.assessment_attempts.length > 0 && (
                        <div className="space-y-2">
                            {application.assessment_attempts.map((attempt) => (
                                <Link
                                    key={attempt.id}
                                    href={admin.assessmentAttempts.show(
                                        attempt.id,
                                    )}
                                    className="flex items-center justify-between rounded-md border border-border p-2 text-xs hover:bg-muted/50"
                                >
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {attempt.assessment.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Attempt #{attempt.attempt_number}
                                            {attempt.score !== null &&
                                                ` · ${attempt.score}%`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {attempt.score !== null && (
                                            <StatusBadge
                                                status={
                                                    attempt.passed
                                                        ? 'passed'
                                                        : 'failed'
                                                }
                                            />
                                        )}
                                        <StatusBadge status={attempt.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {application.stage_history.length > 0 && (
                    <div className="space-y-2">
                        <Separator />
                        <Label className="text-muted-foreground">History</Label>
                        {application.stage_history.map((entry) => (
                            <div key={entry.id} className="text-sm">
                                <p>
                                    <StatusBadge status={entry.to_status} />{' '}
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            entry.occurred_at,
                                        ).toLocaleString()}
                                        {entry.changed_by &&
                                            ` · ${entry.changed_by.name}`}
                                    </span>
                                </p>
                                {entry.reason && (
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {entry.reason}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
