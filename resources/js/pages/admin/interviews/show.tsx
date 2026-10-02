import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
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
import type { InterviewDetail, RecruiterOption } from '@/types';

const FORMATS = [
    { value: 'phone', label: 'Phone' },
    { value: 'video', label: 'Video' },
    { value: 'in_person', label: 'In Person' },
];

const STATUSES = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
];

const RECOMMENDATIONS = [
    { value: 'recommend', label: 'Recommend' },
    { value: 'maybe', label: 'Maybe' },
    { value: 'do_not_recommend', label: 'Do Not Recommend' },
];

function toDateTimeLocal(value: string) {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
}

export default function InterviewShow({
    interview,
    interviewers,
}: {
    interview: InterviewDetail;
    interviewers: RecruiterOption[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        scheduled_at: toDateTimeLocal(interview.scheduled_at),
        interviewer_id: interview.interviewer?.id ?? null,
        format: interview.format,
        location_or_link: interview.location_or_link ?? '',
        status: interview.status,
        recommendation: interview.recommendation ?? '',
        overall_notes: interview.overall_notes ?? '',
        responses: interview.responses.map((response) => ({
            id: response.id,
            score: response.score,
            notes: response.notes ?? '',
        })),
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.interviews.update(interview.id).url, {
            preserveScroll: true,
        });
    }

    function updateResponse(
        id: number,
        patch: Partial<{ score: number | null; notes: string }>,
    ) {
        setData(
            'responses',
            data.responses.map((response) =>
                response.id === id ? { ...response, ...patch } : response,
            ),
        );
    }

    return (
        <>
            <Head
                title={`Interview — ${interview.application.candidate.full_name}`}
            />
            <div className="p-4 sm:p-6">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link
                        href={admin.candidates.show(
                            interview.application.candidate.id,
                        )}
                    >
                        <ArrowLeft className="size-4" />
                        Back to Dossier
                    </Link>
                </Button>

                <AdminPageHeader
                    title={interview.application.candidate.full_name}
                    description={interview.application.candidate.email}
                />

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduling</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="scheduled_at">
                                    Date &amp; Time
                                </Label>
                                <Input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) =>
                                        setData('scheduled_at', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.scheduled_at} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Interviewer</Label>
                                <Select
                                    value={
                                        data.interviewer_id
                                            ? String(data.interviewer_id)
                                            : 'unassigned'
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'interviewer_id',
                                            value === 'unassigned'
                                                ? null
                                                : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">
                                            Unassigned
                                        </SelectItem>
                                        {interviewers.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={String(option.id)}
                                            >
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Format</Label>
                                <Select
                                    value={data.format}
                                    onValueChange={(value) =>
                                        setData('format', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FORMATS.map((option) => (
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

                            <div className="grid gap-2">
                                <Label htmlFor="location_or_link">
                                    Location / Link
                                </Label>
                                <Input
                                    id="location_or_link"
                                    value={data.location_or_link}
                                    onChange={(e) =>
                                        setData(
                                            'location_or_link',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {data.responses.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Question Scores</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {interview.responses.map((response, index) => (
                                    <div
                                        key={response.id}
                                        className="space-y-2"
                                    >
                                        {index > 0 && <Separator />}
                                        <p className="text-sm font-medium text-foreground">
                                            {response.question_text}
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                                            <Select
                                                value={
                                                    data.responses[index].score
                                                        ? String(
                                                              data.responses[
                                                                  index
                                                              ].score,
                                                          )
                                                        : 'none'
                                                }
                                                onValueChange={(value) =>
                                                    updateResponse(
                                                        response.id,
                                                        {
                                                            score:
                                                                value === 'none'
                                                                    ? null
                                                                    : Number(
                                                                          value,
                                                                      ),
                                                        },
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Score" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        No score
                                                    </SelectItem>
                                                    {[1, 2, 3, 4, 5].map(
                                                        (score) => (
                                                            <SelectItem
                                                                key={score}
                                                                value={String(
                                                                    score,
                                                                )}
                                                            >
                                                                {score} / 5
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Textarea
                                                rows={2}
                                                placeholder="Notes (optional)"
                                                value={
                                                    data.responses[index].notes
                                                }
                                                onChange={(e) =>
                                                    updateResponse(
                                                        response.id,
                                                        {
                                                            notes: e.target
                                                                .value,
                                                        },
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Outcome</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map((option) => (
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

                            <div className="grid gap-2">
                                <Label>Recommendation</Label>
                                <Select
                                    value={data.recommendation || 'none'}
                                    onValueChange={(value) =>
                                        setData(
                                            'recommendation',
                                            value === 'none' ? '' : value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Not yet set" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Not yet set
                                        </SelectItem>
                                        {RECOMMENDATIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.recommendation} />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="overall_notes">
                                    Overall Notes
                                </Label>
                                <Textarea
                                    id="overall_notes"
                                    rows={4}
                                    value={data.overall_notes}
                                    onChange={(e) =>
                                        setData('overall_notes', e.target.value)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Interview'}
                        </Button>
                        <StatusBadge status={interview.status} />
                    </div>
                </form>
            </div>
        </>
    );
}

InterviewShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Interviews', href: admin.interviews.index() },
    ],
};
