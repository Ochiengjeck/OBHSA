import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Testimonial } from '@/types';

export default function TestimonialsIndex({
    testimonials,
}: {
    testimonials: Testimonial[];
}) {
    return (
        <>
            <Head title="Testimonials" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Testimonials"
                    description="Manage the quotes shown on the public site."
                    action={
                        <Button asChild>
                            <Link href={admin.testimonials.create()}>
                                <Plus className="size-4" />
                                New Testimonial
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Quote</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testimonials.map((testimonial) => (
                            <TableRow key={testimonial.id}>
                                <TableCell className="font-medium">
                                    {testimonial.author_name}
                                    {testimonial.author_role && (
                                        <p className="text-xs font-normal text-muted-foreground">
                                            {testimonial.author_role}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="max-w-sm truncate text-muted-foreground">
                                    {testimonial.quote}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            testimonial.is_featured
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {testimonial.is_featured
                                            ? 'Featured'
                                            : 'Hidden'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.testimonials.edit(
                                                testimonial.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.testimonials.destroy(
                                                    testimonial.id,
                                                ),
                                            )}
                                            title="Delete testimonial"
                                            description={`Are you sure you want to delete this testimonial from "${testimonial.author_name}"? This cannot be undone.`}
                                            trigger={
                                                <button className="text-sm font-medium text-destructive hover:underline">
                                                    Delete
                                                </button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

TestimonialsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Testimonials', href: admin.testimonials.index() },
    ],
};
