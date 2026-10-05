import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function ConfirmDeleteDialog({
    url,
    onConfirm,
    title,
    description,
    trigger,
}: {
    /** A normal Inertia-visit delete. Ignored if `onConfirm` is given. */
    url?: string;
    /** Use instead of `url` when the delete isn't a plain Inertia visit (e.g. it returns JSON instead of redirecting). */
    onConfirm?: () => Promise<void>;
    title: string;
    description: string;
    trigger: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    async function handleDelete() {
        setProcessing(true);

        if (onConfirm) {
            try {
                await onConfirm();
            } finally {
                setProcessing(false);
                setOpen(false);
            }

            return;
        }

        if (!url) {
            setProcessing(false);

            return;
        }

        router.delete(url, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
