import { Head, router, useHttp } from '@inertiajs/react';
import { File, FileText, HardDrive, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { cn, formatBytes } from '@/lib/utils';
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

type Filters = {
    status: string | null;
    type: string | null;
    search: string | null;
};

export default function AssetsIndex({
    assets,
    counts,
    filters,
}: {
    assets: Paginated<AssetFile>;
    counts: AssetCounts;
    filters: Filters;
}) {
    const storageUrl = useStorageUrl();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const { delete: destroyAssets, setData } = useHttp<{ paths: string[] }>({
        paths: [],
    });
    const { search, setSearch } = useDebouncedSearch(
        admin.assets.index().url,
        filters,
    );

    function updateFilters(next: Partial<Filters>) {
        setSelected(new Set());
        router.get(
            admin.assets.index().url,
            { ...filters, ...next },
            { preserveState: true, replace: true },
        );
    }

    const hasActiveFilters = Boolean(
        filters.status || filters.type || filters.search,
    );

    function clearFilters() {
        setSearch('');
        updateFilters({ status: null, type: null, search: null });
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

                <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            size="sm"
                            variant={filters.status ? 'outline' : 'default'}
                            onClick={() => updateFilters({ status: null })}
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
                                onClick={() =>
                                    updateFilters({ status: option.value })
                                }
                            >
                                {option.label}
                            </Button>
                        ))}

                        <Select
                            value={filters.type ?? 'all'}
                            onValueChange={(value) =>
                                updateFilters({
                                    type: value === 'all' ? null : value,
                                })
                            }
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="image">
                                    Images ({counts.by_type.image})
                                </SelectItem>
                                <SelectItem value="document">
                                    Documents ({counts.by_type.document})
                                </SelectItem>
                                <SelectItem value="other">
                                    Other ({counts.by_type.other})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search path or used by..."
                            className="pl-8"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground"
                        >
                            <X className="size-4" />
                            Clear filters
                        </Button>
                    )}

                    {selected.size > 0 && (
                        <ConfirmDeleteDialog
                            onConfirm={() => deletePaths(Array.from(selected))}
                            title="Delete selected assets"
                            description={`Are you sure you want to delete ${selected.size} selected asset${selected.size === 1 ? '' : 's'}? This cannot be undone.`}
                            trigger={
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="sm:ml-auto"
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
                        action={
                            hasActiveFilters ? (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Button>
                            ) : undefined
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-border">
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
                                                disabled={
                                                    legacyPaths.length === 0
                                                }
                                                aria-label="Select all legacy assets"
                                            />
                                        </TableHead>
                                        <TableHead className="w-14" />
                                        <TableHead>File</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Last Modified</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Used By</TableHead>
                                        <TableHead className="w-0" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assets.data.map((asset) => {
                                        const segments = asset.path.split('/');
                                        const filename = segments.pop();
                                        const directory = segments.join('/');
                                        const isLegacy =
                                            asset.status === 'legacy';

                                        return (
                                            <TableRow
                                                key={asset.path}
                                                className={cn(
                                                    isLegacy &&
                                                        'border-l-2 border-l-amber-400 bg-amber-50/40 dark:bg-amber-500/5',
                                                )}
                                            >
                                                <TableCell>
                                                    {isLegacy && (
                                                        <Checkbox
                                                            checked={selected.has(
                                                                asset.path,
                                                            )}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                toggleSelect(
                                                                    asset.path,
                                                                    checked ===
                                                                        true,
                                                                )
                                                            }
                                                            aria-label={`Select ${asset.path}`}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {asset.type === 'image' ? (
                                                        <img
                                                            src={
                                                                storageUrl(
                                                                    asset.path,
                                                                ) ?? undefined
                                                            }
                                                            alt=""
                                                            className="size-10 rounded-md border border-border object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                                            {asset.type ===
                                                            'document' ? (
                                                                <FileText className="size-5" />
                                                            ) : (
                                                                <File className="size-5" />
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <p className="truncate font-medium text-foreground">
                                                        {filename}
                                                    </p>
                                                    {directory && (
                                                        <p className="truncate font-mono text-xs text-muted-foreground">
                                                            {directory}/
                                                        </p>
                                                    )}
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
                                                <TableCell className="max-w-48 truncate text-muted-foreground">
                                                    {asset.used_by ?? (
                                                        <span className="italic">
                                                            Not referenced
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isLegacy && (
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
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

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
