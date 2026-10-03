import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storageUrl } from '@/lib/utils';

export function ImageUploadField({
    label,
    imagePath,
    pendingFile,
    error,
    onChange,
}: {
    label: string;
    imagePath: string | null;
    pendingFile: File | null | undefined;
    error?: string;
    onChange: (patch: { image: File | null; image_path?: null }) => void;
}) {
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

    const previewUrl = objectUrl ?? storageUrl(imagePath);

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt=""
                    className="h-32 w-auto max-w-xs rounded-lg border border-border object-cover"
                />
            ) : (
                <div
                    aria-hidden
                    className="h-32 w-full max-w-xs rounded-lg bg-gradient-to-br from-primary/20 to-accent/40"
                />
            )}
            <div className="flex items-center gap-3">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        onChange({ image: e.target.files?.[0] ?? null })
                    }
                    className="max-w-xs"
                />
                {(imagePath || pendingFile) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            onChange({ image: null, image_path: null })
                        }
                    >
                        Remove image
                    </Button>
                )}
            </div>
            <InputError message={error} />
        </div>
    );
}
