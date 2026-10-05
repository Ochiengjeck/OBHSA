import { Head, router, useHttp } from '@inertiajs/react';
import { HardDrive, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { formatBytes } from '@/lib/utils';
import admin from '@/routes/admin';
import type {
    AssetCounts,
    AssetDeleteResult,
    AssetFile,
    Paginated,
} from '@/types';

const STATUS_FILTERS = [
    { value: 'in_use', label: 'In Use' },
    { value: 'legacy', label: 'Legacy' },
];

export default function AssetsIndex({
    assets,
    counts,
    filters,
}: {
    assets: Paginated<AssetFile>;
    counts: AssetCounts;
    filters: { status: string | null };
}) {
    const storageUrl = useStorageUrl();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const { delete: destroyAssets, setData } = useHttp<{ paths: string[] }>({
        paths: [],
    });

    function updateFilters(status: string | null) {
        setSelected(new Set());
        router.get(admin.assets.index().url, status ? { status } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    function toggleSelect(path: string, checked: boolean) {
        setSelected((current) => {
            const next = new Set(current);
            if (checked) {
                next.add(path);
            } else {
                next.delete(path);
            }
            return next;
        });
    }

    const legacyPaths = assets.data
        .filter((asset) => asset.status === 'legacy')
        .map((asset) => asset.path);

    function toggleSelectAll(checked: boolean) {
        setSelected(checked ? new Set(legacyPaths) : new Set());
    }

    async function deletePaths(paths: string[]) {
        setData('paths', paths);
        const response = await destroyAssets(admin.assets.destroy().url);
        const results = (response as { results: AssetDeleteResult[] })?.results;

        if (!results) {
            toast.error('Something went wrong deleting those assets.');
            return;
        }

        const deleted = results.filter((r) => r.deleted);
        const refused = results.filter((r) => !r.deleted);

        if (deleted.length > 0) {
            toast.success(
                `Deleted ${deleted.length} asset${deleted.length === 1 ? '' : 's'}.`,
            );
        }

        refused.forEach((result) => {
            if (result.reason === 'in_use') {
                toast.error(
                    `Can't delete "${result.path}" — still used by ${result.used_by}.`,
                );
            } else {
                toast.error(`"${result.path}" was already gone.`);
            }
        });

        setSelected(new Set());
        router.reload({ only: ['assets', 'counts'] });
    }

    const allLegacySelected =
        legacyPaths.length > 0 && legacyPaths.every((p) => selected.has(p));

    return (
        <>
            <Head title="Asset Manager" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Asset Manager"
                    description="Every uploaded file, and whether it's still in use or safe to remove."
                    icon={HardDrive}
                    stats={[
                        { label: 'total', value: counts.total },
                        { label: 'in use', value: counts.in_use },
                        { label: 'legacy', value: counts.legacy },
                    ]}
                />

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant={filters.status ? 'outline' : 'default'}
                        onClick={() => updateFilters(null)}
                    >
                        All
                    </Button>
                    {STATUS_FILTERS.map((option) => (
                        <Button
                            key={option.value}
                            size="sm"
                            variant={
                                filters.status === option.value
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => updateFilters(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}

                    {selected.size > 0 && (
                        <ConfirmDeleteDialog
                            onConfirm={() => deletePaths(Array.from(selected))}
                            title="Delete selected assets"
                            description={`Are you sure you want to delete ${selected.size} selected asset${selected.size === 1 ? '' : 's'}? This cannot be undone.`}
                            trigger={
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="ml-auto"
                                >
                                    <Trash2 className="size-4" />
                                    Delete {selected.size} selected
                                </Button>
                            }
                        />
                    )}
                </div>

                {assets.data.length === 0 ? (
                    <EmptyState
                        icon={HardDrive}
                        title="No assets match these filters"
                        description="Uploaded files across the site will show up here."
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">
                                        <Checkbox
                                            checked={allLegacySelected}
                                            onCheckedChange={(checked) =>
                                                toggleSelectAll(
                                                    checked === true,
                                                )
                                            }
                                            disabled={legacyPaths.length === 0}
                                            aria-label="Select all legacy assets"
                                        />
                                    </TableHead>
                                    <TableHead className="w-14" />
                                    <TableHead>Path</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Last Modified</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Used By</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.data.map((asset) => (
                                    <TableRow key={asset.path}>
                                        <TableCell>
                                            {asset.status === 'legacy' && (
                                                <Checkbox
                                                    checked={selected.has(
                                                        asset.path,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        toggleSelect(
                                                            asset.path,
                                                            checked === true,
                                                        )
                                                    }
                                                    aria-label={`Select ${asset.path}`}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {asset.is_image && (
                                                <img
                                                    src={
                                                        storageUrl(
                                                            asset.path,
                                                        ) ?? undefined
                                                    }
                                                    alt=""
                                                    className="size-10 rounded-md border border-border object-cover"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate font-mono text-xs text-muted-foreground">
                                            {asset.path}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatBytes(asset.size)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                asset.last_modified_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge
                                                status={asset.status}
                                            />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {asset.used_by ?? (
                                                <span className="italic">
                                                    Not referenced
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {asset.status === 'legacy' && (
                                                <ConfirmDeleteDialog
                                                    onConfirm={() =>
                                                        deletePaths([
                                                            asset.path,
                                                        ])
                                                    }
                                                    title="Delete asset"
                                                    description={`Are you sure you want to delete "${asset.path}"? This cannot be undone.`}
                                                    trigger={
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    }
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={assets.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

AssetsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Asset Manager', href: admin.assets.index() },
    ],
};
