import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { AssessmentAttemptDetail } from '@/types';

export default function AssessmentAttemptShow({
    attempt,
}: {
    attempt: AssessmentAttemptDetail;
}) {
    const isEntryMode = attempt.status === 'pending';
    const isReadOnly =
        attempt.status === 'completed' || attempt.status === 'cancelled';

    const [responses, setResponses] = useState(
        attempt.responses.map((response) => ({
            id: response.id,
            selected_option: response.selected_option,
            answer_text: response.answer_text,
            points_awarded: response.points_awarded,
        })),
    );
    const [processing, setProcessing] = useState(false);

    function updateResponse(
        id: number,
        patch: Partial<{
            selected_option: string | null;
            answer_text: string | null;
            points_awarded: number | null;
        }>,
    ) {
        setResponses(
            responses.map((response) =>
                response.id === id ? { ...response, ...patch } : response,
            ),
        );
    }

    function submit(status: 'completed' | 'cancelled') {
        setProcessing(true);
        router.put(
            admin.assessmentAttempts.update(attempt.id).url,
            { status, responses },
            { preserveScroll: true, onFinish: () => setProcessing(false) },
        );
    }

    return (
        <>
            <Head
                title={`${attempt.assessment.name} — ${attempt.application.candidate.full_name}`}
            />
            <div className="p-4 sm:p-6">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link
                        href={admin.candidates.show(
                            attempt.application.candidate.id,
                        )}
                    >
                        <ArrowLeft className="size-4" />
                        Back to Dossier
                    </Link>
                </Button>

                <AdminPageHeader
                    title={attempt.assessment.name}
                    description={`${attempt.application.candidate.full_name} — Attempt #${attempt.attempt_number}`}
                />

                <div className="max-w-3xl space-y-6">
                    <div className="flex items-center gap-3">
                        <StatusBadge status={attempt.status} />
                        {attempt.score !== null && (
                            <>
                                <span className="text-sm text-muted-foreground">
                                    Score: {attempt.score}%
                                </span>
                                <StatusBadge
                                    status={
                                        attempt.passed ? 'passed' : 'failed'
                                    }
                                />
                            </>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Responses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {attempt.responses.map((response, index) => {
                                const current = responses[index];

                                return (
                                    <div
                                        key={response.id}
                                        className="space-y-2"
                                    >
                                        {index > 0 && <Separator />}
                                        <p className="text-sm font-medium text-foreground">
                                            {response.question_text}{' '}
                                            <span className="text-xs text-muted-foreground">
                                                ({response.points_possible} pt
                                                {response.points_possible === 1
                                                    ? ''
                                                    : 's'}
                                                )
                                            </span>
                                        </p>

                                        {response.question_type ===
                                        'multiple_choice' ? (
                                            isEntryMode ? (
                                                <Select
                                                    value={
                                                        current.selected_option ??
                                                        undefined
                                                    }
                                                    onValueChange={(value) =>
                                                        updateResponse(
                                                            response.id,
                                                            {
                                                                selected_option:
                                                                    value,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an answer" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(
                                                            response.options ??
                                                            []
                                                        ).map((option) => (
                                                            <SelectItem
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Answered:{' '}
                                                    {response.selected_option ??
                                                        '—'}{' '}
                                                    {response.is_correct !==
                                                        null &&
                                                        (response.is_correct ? (
                                                            <span className="text-emerald-600">
                                                                (correct)
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600">
                                                                (incorrect)
                                                            </span>
                                                        ))}
                                                </p>
                                            )
                                        ) : isEntryMode ? (
                                            <Textarea
                                                rows={2}
                                                value={
                                                    current.answer_text ?? ''
                                                }
                                                onChange={(e) =>
                                                    updateResponse(
                                                        response.id,
                                                        {
                                                            answer_text:
                                                                e.target.value,
                                                        },
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Answer:{' '}
                                                {response.answer_text ?? '—'}
                                            </p>
                                        )}

                                        {response.question_type ===
                                            'short_answer' &&
                                            !isReadOnly && (
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs text-muted-foreground">
                                                        Points awarded:
                                                    </label>
                                                    <Select
                                                        value={
                                                            current.points_awarded !==
                                                            null
                                                                ? String(
                                                                      current.points_awarded,
                                                                  )
                                                                : 'none'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateResponse(
                                                                response.id,
                                                                {
                                                                    points_awarded:
                                                                        value ===
                                                                        'none'
                                                                            ? null
                                                                            : Number(
                                                                                  value,
                                                                              ),
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-28">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                Not graded
                                                            </SelectItem>
                                                            {Array.from(
                                                                {
                                                                    length:
                                                                        response.points_possible +
                                                                        1,
                                                                },
                                                                (_, n) => n,
                                                            ).map((n) => (
                                                                <SelectItem
                                                                    key={n}
                                                                    value={String(
                                                                        n,
                                                                    )}
                                                                >
                                                                    {n}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                        {response.question_type ===
                                            'short_answer' &&
                                            isReadOnly && (
                                                <p className="text-xs text-muted-foreground">
                                                    Points awarded:{' '}
                                                    {response.points_awarded ??
                                                        '—'}
                                                </p>
                                            )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {!isReadOnly && (
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                disabled={processing}
                                onClick={() => submit('completed')}
                            >
                                {processing
                                    ? 'Saving...'
                                    : isEntryMode
                                      ? 'Submit & Grade'
                                      : 'Finalize Grading'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                                onClick={() => submit('cancelled')}
                            >
                                Cancel Attempt
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AssessmentAttemptShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Assessment Attempts',
            href: admin.assessmentAttempts.index(),
        },
    ],
};
