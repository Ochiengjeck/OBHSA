import { useForm } from '@inertiajs/react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import assessments from '@/routes/assessments';
import type { AssessmentResponseEntry } from '@/types';

export default function AssessmentShow({
    attempt,
    token,
}: {
    attempt: {
        assessment: { name: string; description: string | null };
        responses: AssessmentResponseEntry[];
    };
    token: string;
}) {
    const { data, setData, post, processing } = useForm({
        responses: attempt.responses.map((response) => ({
            id: response.id,
            selected_option: response.selected_option,
            answer_text: response.answer_text,
        })),
    });

    function updateResponse(
        id: number,
        patch: Partial<{
            selected_option: string | null;
            answer_text: string | null;
        }>,
    ) {
        setData(
            'responses',
            data.responses.map((response) =>
                response.id === id ? { ...response, ...patch } : response,
            ),
        );
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(assessments.submit(token).url);
    }

    return (
        <>
            <PageHead title={attempt.assessment.name} />

            <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {attempt.assessment.name}
                        </CardTitle>
                        {attempt.assessment.description && (
                            <p className="text-sm text-muted-foreground">
                                {attempt.assessment.description}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {attempt.responses.map((response, index) => (
                                <div key={response.id} className="space-y-2">
                                    {index > 0 && <Separator />}
                                    <Label>
                                        {index + 1}. {response.question_text}
                                    </Label>

                                    {response.question_type ===
                                    'multiple_choice' ? (
                                        <Select
                                            value={
                                                data.responses[index]
                                                    .selected_option ??
                                                undefined
                                            }
                                            onValueChange={(value) =>
                                                updateResponse(response.id, {
                                                    selected_option: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an answer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(response.options ?? []).map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Textarea
                                            rows={3}
                                            value={
                                                data.responses[index]
                                                    .answer_text ?? ''
                                            }
                                            onChange={(e) =>
                                                updateResponse(response.id, {
                                                    answer_text: e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                </div>
                            ))}

                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Submitting...'
                                    : 'Submit Assessment'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
