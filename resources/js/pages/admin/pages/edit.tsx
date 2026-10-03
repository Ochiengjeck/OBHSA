import { Head, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ImageUploadField } from '@/components/admin/pages/image-upload-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import type { Page, PageSection } from '@/types';

type SectionContentValue =
    | string
    | null
    | File
    | Record<string, string | File | null>[];

type EditableSection = Omit<PageSection, 'content'> & {
    content: Record<string, SectionContentValue>;
};

type PageEditFormData = {
    title: string;
    meta_description: string;
    is_published: boolean;
    sections: EditableSection[];
};

const SECTION_LABELS: Record<string, string> = {
    hero: 'Hero',
    intro: 'Intro',
    services_list: 'Services List',
    how_it_works: 'How It Works',
    faq: 'FAQ',
    cta: 'Call to Action',
    testimonials: 'Testimonials',
    stats: 'Stats',
    contact_info: 'Contact Info',
    feature_showcase: 'Feature Showcase',
    gallery: 'Photo Gallery',
};

export default function PagesEdit({
    page,
    sections,
}: {
    page: Page;
    sections: PageSection[];
}) {
    const { data, setData, put, processing } = useForm<PageEditFormData>({
        title: page.title,
        meta_description: page.meta_description ?? '',
        is_published: page.is_published,
        sections: sections as EditableSection[],
    });

    function updateSection(id: number, patch: Partial<EditableSection>) {
        setData(
            'sections',
            data.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        );
    }

    function updateContent(
        id: number,
        patch: Record<string, SectionContentValue>,
    ) {
        const section = data.sections.find((s) => s.id === id);
        if (!section) return;
        updateSection(id, { content: { ...section.content, ...patch } });
    }

    function move(id: number, direction: -1 | 1) {
        const sorted = [...data.sections].sort(
            (a, b) => a.position - b.position,
        );
        const index = sorted.findIndex((s) => s.id === id);
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= sorted.length) return;

        const a = sorted[index];
        const b = sorted[swapIndex];
        setData(
            'sections',
            data.sections.map((s) => {
                if (s.id === a.id) return { ...s, position: b.position };
                if (s.id === b.id) return { ...s, position: a.position };
                return s;
            }),
        );
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.pages.update(page.id).url, { forceFormData: true });
    }

    const sortedSections = [...data.sections].sort(
        (a, b) => a.position - b.position,
    );

    return (
        <>
            <Head title={`Edit ${page.title}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title={`Edit: ${page.title}`}
                    description="Update this page's copy, images, and section visibility."
                />

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="meta_description">
                                    Meta Description
                                </Label>
                                <Textarea
                                    id="meta_description"
                                    rows={2}
                                    value={data.meta_description}
                                    onChange={(e) =>
                                        setData(
                                            'meta_description',
                                            e.target.value,
                                        )
                                    }
                                />
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
                        </CardContent>
                    </Card>

                    {sortedSections.map((section, index) => (
                        <Card key={section.id}>
                            <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                                <CardTitle>
                                    {SECTION_LABELS[section.type] ??
                                        section.type}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={index === 0}
                                        onClick={() => move(section.id, -1)}
                                    >
                                        <ArrowUp className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={
                                            index === sortedSections.length - 1
                                        }
                                        onClick={() => move(section.id, 1)}
                                    >
                                        <ArrowDown className="size-4" />
                                    </Button>
                                    <div className="flex items-center gap-2 border-l border-border pl-3">
                                        <Switch
                                            id={`visible-${section.id}`}
                                            checked={section.is_visible}
                                            onCheckedChange={(checked) =>
                                                updateSection(section.id, {
                                                    is_visible: checked,
                                                })
                                            }
                                        />
                                        <Label
                                            htmlFor={`visible-${section.id}`}
                                            className="text-xs text-muted-foreground"
                                        >
                                            Visible
                                        </Label>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <SectionFields
                                    section={section}
                                    onChange={(patch) =>
                                        updateContent(section.id, patch)
                                    }
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Saving...' : 'Save Page'}
                    </Button>
                </form>
            </div>
        </>
    );
}

function SectionFields({
    section,
    onChange,
}: {
    section: EditableSection;
    onChange: (patch: Record<string, SectionContentValue>) => void;
}) {
    const content = section.content;

    switch (section.type) {
        case 'hero':
            return (
                <div className="space-y-4">
                    <TextField
                        label="Heading"
                        value={content.heading as string}
                        onChange={(v) => onChange({ heading: v })}
                    />
                    <TextAreaField
                        label="Subheading"
                        value={content.subheading as string}
                        onChange={(v) => onChange({ subheading: v })}
                    />
                    <ImageUploadField
                        label="Background Photo"
                        imagePath={(content.image_path as string) ?? null}
                        pendingFile={content.image as File | null | undefined}
                        onChange={onChange}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            label="Primary Button Label"
                            value={(content.primary_cta_label as string) ?? ''}
                            onChange={(v) => onChange({ primary_cta_label: v })}
                        />
                        <TextField
                            label="Primary Button URL"
                            value={(content.primary_cta_url as string) ?? ''}
                            onChange={(v) => onChange({ primary_cta_url: v })}
                        />
                        <TextField
                            label="Secondary Button Label"
                            value={
                                (content.secondary_cta_label as string) ?? ''
                            }
                            onChange={(v) =>
                                onChange({ secondary_cta_label: v })
                            }
                        />
                        <TextField
                            label="Secondary Button URL"
                            value={(content.secondary_cta_url as string) ?? ''}
                            onChange={(v) => onChange({ secondary_cta_url: v })}
                        />
                    </div>
                </div>
            );

        case 'intro':
        case 'contact_info':
            return (
                <div className="space-y-4">
                    <TextField
                        label="Heading"
                        value={content.heading as string}
                        onChange={(v) => onChange({ heading: v })}
                    />
                    <TextAreaField
                        label="Body"
                        value={content.body as string}
                        onChange={(v) => onChange({ body: v })}
                    />
                </div>
            );

        case 'services_list':
            return (
                <div className="space-y-4">
                    <TextField
                        label="Heading"
                        value={content.heading as string}
                        onChange={(v) => onChange({ heading: v })}
                    />
                    <TextAreaField
                        label="Subheading"
                        value={content.subheading as string}
                        onChange={(v) => onChange({ subheading: v })}
                    />
                    <p className="text-xs text-muted-foreground">
                        The services shown here are managed under Services.
                    </p>
                </div>
            );

        case 'testimonials':
        case 'stats':
            return (
                <div className="space-y-4">
                    <TextField
                        label="Heading"
                        value={content.heading as string}
                        onChange={(v) => onChange({ heading: v })}
                    />
                    <p className="text-xs text-muted-foreground">
                        {section.type === 'testimonials'
                            ? 'Testimonials shown here are managed under Testimonials.'
                            : 'Stats shown here are managed under Stats.'}
                    </p>
                </div>
            );

        case 'cta':
            return (
                <div className="space-y-4">
                    <TextField
                        label="Heading"
                        value={content.heading as string}
                        onChange={(v) => onChange({ heading: v })}
                    />
                    <TextAreaField
                        label="Body"
                        value={content.body as string}
                        onChange={(v) => onChange({ body: v })}
                    />
                    <ImageUploadField
                        label="Background Photo (optional)"
                        imagePath={(content.image_path as string) ?? null}
                        pendingFile={content.image as File | null | undefined}
                        onChange={onChange}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            label="Button Label"
                            value={content.button_label as string}
                            onChange={(v) => onChange({ button_label: v })}
                        />
                        <TextField
                            label="Button URL"
                            value={content.button_url as string}
                            onChange={(v) => onChange({ button_url: v })}
                        />
                    </div>
                </div>
            );

        case 'how_it_works':
            return (
                <RepeatableFields
                    heading={content.heading as string}
                    onHeadingChange={(v) => onChange({ heading: v })}
                    items={(content.steps as Record<string, string>[]) ?? []}
                    itemLabel="Step"
                    fields={[
                        { key: 'title', label: 'Title' },
                        {
                            key: 'description',
                            label: 'Description',
                            multiline: true,
                        },
                    ]}
                    onItemsChange={(items) => onChange({ steps: items })}
                    emptyItem={{ title: '', description: '' }}
                />
            );

        case 'faq':
            return (
                <RepeatableFields
                    heading={content.heading as string}
                    onHeadingChange={(v) => onChange({ heading: v })}
                    items={(content.items as Record<string, string>[]) ?? []}
                    itemLabel="Question"
                    fields={[
                        { key: 'question', label: 'Question' },
                        { key: 'answer', label: 'Answer', multiline: true },
                    ]}
                    onItemsChange={(items) => onChange({ items })}
                    emptyItem={{ question: '', answer: '' }}
                />
            );

        case 'feature_showcase':
            return (
                <div className="space-y-4">
                    <TextAreaField
                        label="Subheading"
                        value={(content.subheading as string) ?? ''}
                        onChange={(v) => onChange({ subheading: v })}
                    />
                    <RepeatableFields
                        heading={content.heading as string}
                        onHeadingChange={(v) => onChange({ heading: v })}
                        items={
                            (content.items as Record<
                                string,
                                string | File | null
                            >[]) ?? []
                        }
                        itemLabel="Feature"
                        fields={[
                            { key: 'image', label: 'Photo', type: 'image' },
                            { key: 'title', label: 'Title' },
                            {
                                key: 'body',
                                label: 'Body',
                                multiline: true,
                            },
                        ]}
                        onItemsChange={(items) => onChange({ items })}
                        emptyItem={{
                            title: '',
                            body: '',
                            image_path: null,
                            image: null,
                        }}
                    />
                </div>
            );

        case 'gallery':
            return (
                <RepeatableFields
                    heading={(content.heading as string) ?? ''}
                    onHeadingChange={(v) => onChange({ heading: v })}
                    items={
                        (content.images as Record<
                            string,
                            string | File | null
                        >[]) ?? []
                    }
                    itemLabel="Image"
                    fields={[
                        { key: 'image', label: 'Photo', type: 'image' },
                        { key: 'caption', label: 'Caption (optional)' },
                    ]}
                    onItemsChange={(items) => onChange({ images: items })}
                    emptyItem={{ image_path: null, image: null, caption: '' }}
                />
            );

        default:
            return null;
    }
}

function TextField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Input
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function TextAreaField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Textarea
                rows={3}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function RepeatableFields<T extends Record<string, string | File | null>>({
    heading,
    onHeadingChange,
    items,
    itemLabel,
    fields,
    onItemsChange,
    emptyItem,
}: {
    heading: string;
    onHeadingChange: (value: string) => void;
    items: T[];
    itemLabel: string;
    fields: {
        key: keyof T & string;
        label: string;
        multiline?: boolean;
        type?: 'image';
    }[];
    onItemsChange: (items: T[]) => void;
    emptyItem: T;
}) {
    return (
        <div className="space-y-4">
            <TextField
                label="Heading"
                value={heading}
                onChange={onHeadingChange}
            />

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-border p-4"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                {itemLabel} {index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onItemsChange(
                                        items.filter((_, i) => i !== index),
                                    )
                                }
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {fields.map((field) =>
                                field.type === 'image' ? (
                                    <ImageUploadField
                                        key={field.key}
                                        label={field.label}
                                        imagePath={
                                            (item.image_path as
                                                | string
                                                | null) ?? null
                                        }
                                        pendingFile={
                                            item.image as
                                                | File
                                                | null
                                                | undefined
                                        }
                                        onChange={(patch) =>
                                            onItemsChange(
                                                items.map((it, i) =>
                                                    i === index
                                                        ? { ...it, ...patch }
                                                        : it,
                                                ),
                                            )
                                        }
                                    />
                                ) : field.multiline ? (
                                    <TextAreaField
                                        key={field.key}
                                        label={field.label}
                                        value={item[field.key] as string}
                                        onChange={(v) =>
                                            onItemsChange(
                                                items.map((it, i) =>
                                                    i === index
                                                        ? {
                                                              ...it,
                                                              [field.key]: v,
                                                          }
                                                        : it,
                                                ),
                                            )
                                        }
                                    />
                                ) : (
                                    <TextField
                                        key={field.key}
                                        label={field.label}
                                        value={item[field.key] as string}
                                        onChange={(v) =>
                                            onItemsChange(
                                                items.map((it, i) =>
                                                    i === index
                                                        ? {
                                                              ...it,
                                                              [field.key]: v,
                                                          }
                                                        : it,
                                                ),
                                            )
                                        }
                                    />
                                ),
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onItemsChange([...items, emptyItem])}
            >
                <Plus className="size-4" />
                Add {itemLabel}
            </Button>
        </div>
    );
}

PagesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Pages', href: admin.pages.index() },
    ],
};
