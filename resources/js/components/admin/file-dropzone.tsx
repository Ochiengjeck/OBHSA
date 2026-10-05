import { UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * A drag-and-drop file upload field with a live preview of the pending
 * selection (falling back to the existing stored file) and a clear
 * button — replaces every bare `<input type="file">` upload field in the
 * admin with one consistent, appealing control. No new dependency: drag
 * handling is native HTML5 drag events, and the pending-preview mechanism
 * is the same `URL.createObjectURL` pattern already proven in this app's
 * icon/image upload fields.
 */
export function FileDropzone({
    value,
    existingUrl,
    onChange,
    onClear,
    accept = 'image/*',
    label,
    helperText,
    error,
    shape = 'rect',
    previewSize,
    canClearExisting = true,
}: {
    value: File | null | undefined;
    existingUrl: string | null;
    onChange: (file: File | null) => void;
    onClear: () => void;
    accept?: string;
    label?: string;
    helperText?: string;
    error?: string;
    shape?: 'rect' | 'circle';
    previewSize?: string;
    /**
     * Whether `onClear` can actually remove an already-saved file, not
     * just a not-yet-submitted pending pick. Some upload fields' backend
     * handlers only ever replace-on-new-file and have no clear-to-null
     * path yet — for those, pass false so the button only ever offers to
     * undo a pending selection, never implies it can remove a saved file
     * it can't actually remove.
     */
    canClearExisting?: boolean;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setObjectUrl(null);
            return;
        }

        const url = URL.createObjectURL(value);
        setObjectUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [value]);

    const previewUrl = objectUrl ?? existingUrl;

    function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);
        onChange(e.dataTransfer.files?.[0] ?? null);
    }

    return (
        <div className="grid gap-2">
            {label && <Label>{label}</Label>}
            <label
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    'relative flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50',
                    shape === 'circle'
                        ? 'size-24 rounded-full'
                        : cn(
                              'rounded-lg',
                              previewSize ?? 'h-32 w-full max-w-xs',
                          ),
                )}
            >
                <input
                    type="file"
                    accept={accept}
                    className="sr-only"
                    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt=""
                        className="size-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-1 p-4 text-center text-muted-foreground">
                        <UploadCloud className="size-6" />
                        <span className="text-xs">
                            Drag and drop or click to upload
                        </span>
                    </div>
                )}
            </label>
            <div className="flex items-center gap-3">
                {(value || (existingUrl && canClearExisting)) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                    >
                        Remove
                    </Button>
                )}
                {helperText && (
                    <p className="text-xs text-muted-foreground">
                        {helperText}
                    </p>
                )}
            </div>
            <InputError message={error} />
        </div>
    );
}
