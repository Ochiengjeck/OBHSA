import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Permission } from '@/types';

const ACTIONS = ['view', 'create', 'update', 'delete'] as const;
type Action = (typeof ACTIONS)[number];

const ACTION_LABELS: Record<Action, string> = {
    view: 'View',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
};

const RESOURCE_GROUPS: { label: string; resources: string[] }[] = [
    {
        label: 'Content',
        resources: [
            'pages',
            'services',
            'job-listings',
            'blog-posts',
            'testimonials',
            'stats',
        ],
    },
    {
        label: 'Recruiting',
        resources: [
            'applications',
            'interviews',
            'interview-questions',
            'assessments',
            'assessment-attempts',
            'communication-templates',
        ],
    },
    {
        label: 'Workforce',
        resources: [
            'employees',
            'onboarding',
            'compliance',
            'policy-documents',
        ],
    },
    {
        label: 'Operations',
        resources: ['facilities', 'staffing-requests'],
    },
    {
        label: 'Administration',
        resources: ['users', 'roles', 'site-settings'],
    },
];

function resourceLabel(resource: string): string {
    return resource
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function PermissionMatrix({
    permissions,
    selected,
    onChange,
}: {
    permissions: Permission[];
    selected: string[];
    onChange: (names: string[]) => void;
}) {
    const byResource = new Map<string, Partial<Record<Action, string>>>();

    for (const permission of permissions) {
        const [resource, action] = permission.name.split('.');

        if (!ACTIONS.includes(action as Action)) {
            continue;
        }

        if (!byResource.has(resource)) {
            byResource.set(resource, {});
        }

        byResource.get(resource)![action as Action] = permission.name;
    }

    const knownResources = new Set(
        RESOURCE_GROUPS.flatMap((group) => group.resources),
    );
    const ungroupedResources = [...byResource.keys()].filter(
        (resource) => !knownResources.has(resource),
    );
    const groups = [
        ...RESOURCE_GROUPS,
        ...(ungroupedResources.length > 0
            ? [{ label: 'Other', resources: ungroupedResources }]
            : []),
    ];

    const selectedSet = new Set(selected);

    function toggle(name: string, checked: boolean) {
        onChange(
            checked ? [...selected, name] : selected.filter((n) => n !== name),
        );
    }

    return (
        <div className="space-y-6">
            {groups.map((group) => {
                const rows = group.resources.filter((resource) =>
                    byResource.has(resource),
                );

                if (rows.length === 0) {
                    return null;
                }

                return (
                    <div key={group.label}>
                        <h3 className="mb-2 text-sm font-semibold text-foreground">
                            {group.label}
                        </h3>
                        <div className="overflow-x-auto rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Resource</TableHead>
                                        {ACTIONS.map((action) => (
                                            <TableHead
                                                key={action}
                                                className="text-center"
                                            >
                                                {ACTION_LABELS[action]}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map((resource) => {
                                        const actions =
                                            byResource.get(resource)!;

                                        return (
                                            <TableRow key={resource}>
                                                <TableCell className="font-medium">
                                                    {resourceLabel(resource)}
                                                </TableCell>
                                                {ACTIONS.map((action) => {
                                                    const name =
                                                        actions[action];

                                                    return (
                                                        <TableCell
                                                            key={action}
                                                            className="text-center"
                                                        >
                                                            {name && (
                                                                <Checkbox
                                                                    checked={selectedSet.has(
                                                                        name,
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        toggle(
                                                                            name,
                                                                            checked ===
                                                                                true,
                                                                        )
                                                                    }
                                                                    aria-label={`${resourceLabel(resource)} — ${ACTION_LABELS[action]}`}
                                                                />
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
