<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Every admin resource and the CRUD actions it actually has a route
     * for. Permissions are generated as "<resource>.<action>" — view
     * (index/show), create (create/store), update (edit/update), delete
     * (destroy) — only for the actions listed here, since several
     * resources don't have all four (e.g. Pages has no create/delete
     * route; Employees and Compliance are view-only).
     *
     * @var array<string, list<string>>
     */
    private const RESOURCE_ACTIONS = [
        'site-settings' => ['view', 'update'],
        'ai-settings' => ['view', 'update'],
        'assets' => ['view', 'delete'],
        'pages' => ['view', 'update'],
        'services' => ['view', 'create', 'update', 'delete'],
        'job-listings' => ['view', 'create', 'update', 'delete'],
        'applications' => ['view', 'create', 'update'],
        'interviews' => ['view', 'create', 'update'],
        'interview-questions' => ['view', 'create', 'update', 'delete'],
        'assessments' => ['view', 'create', 'update', 'delete'],
        'assessment-attempts' => ['view', 'create', 'update'],
        'communication-templates' => ['view', 'create', 'update', 'delete'],
        'onboarding' => ['view', 'create', 'update', 'delete'],
        'employees' => ['view'],
        'compliance' => ['view'],
        'facilities' => ['view', 'create', 'update', 'delete'],
        'policy-documents' => ['view', 'create', 'update', 'delete'],
        'blog-posts' => ['view', 'create', 'update', 'delete'],
        'testimonials' => ['view', 'create', 'update', 'delete'],
        'stats' => ['view', 'create', 'update', 'delete'],
        'staffing-requests' => ['view', 'update'],
        'users' => ['view', 'create', 'update', 'delete'],
        'roles' => ['view', 'create', 'update', 'delete'],
    ];

    /**
     * Resources the editor role has full access to (every action that
     * exists for that resource) — pure content management, no recruiting
     * or administration.
     *
     * @var list<string>
     */
    private const EDITOR_RESOURCES = [
        'pages',
        'services',
        'job-listings',
        'blog-posts',
        'testimonials',
        'stats',
    ];

    /**
     * Seed the application's roles and permissions.
     */
    public function run(): void
    {
        $allPermissions = $this->allPermissionNames();

        foreach ($allPermissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $admin = Role::findOrCreate('admin');
        $admin->syncPermissions($allPermissions);

        $editor = Role::findOrCreate('editor');
        $editor->syncPermissions($this->permissionNamesFor(self::EDITOR_RESOURCES));

        // Remove any permission no longer defined above (e.g. a leftover
        // "manage-x" name from before the CRUD-level split) — syncPermissions
        // already detached these from every role, so it's safe to delete
        // the now-unreferenced Permission rows themselves.
        Permission::query()->whereNotIn('name', $allPermissions)->delete();
    }

    /**
     * @return list<string>
     */
    private function allPermissionNames(): array
    {
        return $this->permissionNamesFor(array_keys(self::RESOURCE_ACTIONS));
    }

    /**
     * @param  list<string>  $resources
     * @return list<string>
     */
    private function permissionNamesFor(array $resources): array
    {
        $names = [];

        foreach ($resources as $resource) {
            foreach (self::RESOURCE_ACTIONS[$resource] as $action) {
                $names[] = "{$resource}.{$action}";
            }
        }

        return $names;
    }
}
