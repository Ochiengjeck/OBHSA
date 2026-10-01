import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

export type BlogPostFormData = {
    title: string;
    excerpt: string;
    body: string;
    featured_image: File | null;
    is_published: boolean;
    published_at: string;
};

export function BlogPostForm({
    data,
    setData,
    errors,
    processing,
    imagePreview,
    submitLabel,
}: {
    data: BlogPostFormData;
    setData: <K extends keyof BlogPostFormData>(
        key: K,
        value: BlogPostFormData[K],
    ) => void;
    errors: Partial<Record<keyof BlogPostFormData, string>>;
    processing: boolean;
    imagePreview?: string | null;
    submitLabel: string;
}) {
    return (
        <div className="max-w-2xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                    id="excerpt"
                    rows={2}
                    value={data.excerpt}
                    onChange={(e) => setData('excerpt', e.target.value)}
                />
                <InputError message={errors.excerpt} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                    id="body"
                    rows={10}
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    required
                />
                <InputError message={errors.body} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="featured_image">Featured Image</Label>
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt=""
                        className="h-24 w-auto rounded-md border border-border object-cover"
                    />
                )}
                <Input
                    id="featured_image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setData('featured_image', e.target.files?.[0] ?? null)
                    }
                />
                <InputError message={errors.featured_image} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="published_at">Published Date</Label>
                <Input
                    id="published_at"
                    type="date"
                    value={data.published_at}
                    onChange={(e) => setData('published_at', e.target.value)}
                />
                <InputError message={errors.published_at} />
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_published"
                    checked={data.is_published}
                    onCheckedChange={(checked) =>
                        setData('is_published', checked)
                    }
                />
                <Label htmlFor="is_published">Published</Label>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
