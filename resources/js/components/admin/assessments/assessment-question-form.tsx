import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type AssessmentQuestionFormData = {
    question: string;
    question_type: string;
    options: string[];
    correct_option: string;
    points: number;
    position: number;
};

export function AssessmentQuestionForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: AssessmentQuestionFormData;
    setData: <K extends keyof AssessmentQuestionFormData>(
        key: K,
        value: AssessmentQuestionFormData[K],
    ) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    const isMultipleChoice = data.question_type === 'multiple_choice';

    function updateOption(index: number, value: string) {
        const next = [...data.options];
        next[index] = value;
        setData('options', next);
    }

    function addOption() {
        setData('options', [...data.options, '']);
    }

    function removeOption(index: number) {
        const removed = data.options[index];
        setData(
            'options',
            data.options.filter((_, i) => i !== index),
        );

        if (data.correct_option === removed) {
            setData('correct_option', '');
        }
    }

    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                    id="question"
                    rows={3}
                    value={data.question}
                    onChange={(e) => setData('question', e.target.value)}
                    required
                />
                <InputError message={errors.question} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="question_type">Type</Label>
                <Select
                    value={data.question_type}
                    onValueChange={(value) => setData('question_type', value)}
                >
                    <SelectTrigger id="question_type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="multiple_choice">
                            Multiple Choice (auto-graded)
                        </SelectItem>
                        <SelectItem value="short_answer">
                            Short Answer (staff-graded)
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.question_type} />
            </div>

            {isMultipleChoice && (
                <div className="grid gap-2">
                    <Label>Options</Label>
                    {data.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={option}
                                onChange={(e) =>
                                    updateOption(index, e.target.value)
                                }
                                placeholder={`Option ${index + 1}`}
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeOption(index)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                    >
                        <Plus className="size-4" />
                        Add Option
                    </Button>
                    <InputError message={errors.options} />

                    <Label htmlFor="correct_option" className="mt-3">
                        Correct Option
                    </Label>
                    <Select
                        value={data.correct_option || 'none'}
                        onValueChange={(value) =>
                            setData(
                                'correct_option',
                                value === 'none' ? '' : value,
                            )
                        }
                    >
                        <SelectTrigger id="correct_option">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Select one</SelectItem>
                            {data.options
                                .filter((option) => option.trim() !== '')
                                .map((option, index) => (
                                    <SelectItem key={index} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.correct_option} />
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                        id="points"
                        type="number"
                        min={1}
                        value={data.points}
                        onChange={(e) =>
                            setData('points', Number(e.target.value))
                        }
                    />
                    <InputError message={errors.points} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                        id="position"
                        type="number"
                        min={0}
                        value={data.position}
                        onChange={(e) =>
                            setData('position', Number(e.target.value))
                        }
                    />
                    <InputError message={errors.position} />
                </div>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
