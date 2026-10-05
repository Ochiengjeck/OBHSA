import { File, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * An image thumbnail, or a muted icon tile fallback for non-image files —
 * the tile treatment introduced on the Asset Manager page, extracted so
 * other pages (and the file dropzone) can render the same preview shape.
 */
export function FileThumbnail({
    src,
    isImage,
    kind = 'other',
    size = 'size-10',
}: {
    src: string | null;
    isImage: boolean;
    kind?: 'image' | 'document' | 'other';
    size?: string;
}) {
    if (isImage && src) {
        return (
            <img
                src={src}
                alt=""
                className={cn(
                    size,
                    'rounded-md border border-border object-cover',
                )}
            />
        );
    }

    const Icon = kind === 'document' ? FileText : isImage ? ImageIcon : File;

    return (
        <div
            className={cn(
                size,
                'flex items-center justify-center rounded-md border border-border bg-muted text-muted-foreground',
            )}
        >
            <Icon className="size-5" />
        </div>
    );
}
