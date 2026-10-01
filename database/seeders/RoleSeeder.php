<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Permissions available to the editor role (content management only).
     *
     * @var list<string>
     */
    private const EDITOR_PERMISSIONS = [
        'manage-pages',
        'manage-services',
        'manage-jobs',
        'manage-blog',
        'manage-testimonials',
        'manage-stats',
    ];

    /**
     * Full permission set, granted to the admin role.
     *
     * @var list<string>
     */
    private const ALL_PERMISSIONS = [
        'manage-users',
        'manage-roles',
        'manage-site-settings',
        'manage-pages',
        'manage-services',
        'manage-jobs',
        'manage-applications',
        'manage-blog',
        'manage-testimonials',
        'manage-stats',
        'manage-leads',
    ];

    /**
     * Seed the application's roles and permissions.
     */
    public function run(): void
    {
        foreach (self::ALL_PERMISSIONS as $permission) {
            Permission::findOrCreate($permission);
        }

        $admin = Role::findOrCreate('admin');
        $admin->syncPermissions(self::ALL_PERMISSIONS);

        $editor = Role::findOrCreate('editor');
        $editor->syncPermissions(self::EDITOR_PERMISSIONS);
    }
}
