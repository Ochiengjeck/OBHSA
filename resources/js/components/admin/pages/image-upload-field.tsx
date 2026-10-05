import { FileDropzone } from '@/components/admin/file-dropzone';
import { useStorageUrl } from '@/hooks/use-storage-url';

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
    const storageUrl = useStorageUrl();

    return (
        <FileDropzone
            label={label}
            value={pendingFile}
            existingUrl={storageUrl(imagePath)}
            onChange={(file) => onChange({ image: file })}
            onClear={() => onChange({ image: null, image_path: null })}
            previewSize="h-32 w-full max-w-xs"
            error={error}
        />
    );
}
