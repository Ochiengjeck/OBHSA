import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStorageUrl } from '@/hooks/use-storage-url';

export function IconUploadField({
    iconPath,
    pendingFile,
    error,
    onUpload,
    onRemove,
}: {
    iconPath: string | null;
    pendingFile: File | null;
    error?: string;
    onUpload: (file: File | null) => void;
    onRemove: () => void;
}) {
    const storageUrl = useStorageUrl();
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!pendingFile) {
            setObjectUrl(null);
            return;
        }

        const url = URL.createObjectURL(pendingFile);
        setObjectUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [pendingFile]);

    const previewUrl = objectUrl ?? storageUrl(iconPath);

    return (
        <div className="grid gap-2">
            <Label>
                Custom Icon (optional — overrides the preset icon above)
            </Label>
            <div className="flex items-center gap-3">
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt=""
                        className="size-10 rounded-md border border-border object-contain p-1.5"
                    />
                )}
                <Input
                    type="file"
                    accept="image/*"
                    className="max-w-xs"
                    onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                />
                {(iconPath || pendingFile) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                    >
                        Remove
                    </Button>
                )}
            </div>
            <InputError message={error} />
        </div>
    );
}
