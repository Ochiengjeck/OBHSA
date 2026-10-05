import { FileDropzone } from '@/components/admin/file-dropzone';
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

    return (
        <FileDropzone
            label="Custom Icon (optional — overrides the preset icon above)"
            value={pendingFile}
            existingUrl={storageUrl(iconPath)}
            onChange={onUpload}
            onClear={onRemove}
            previewSize="size-20"
            error={error}
        />
    );
}
