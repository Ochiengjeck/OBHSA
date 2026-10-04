<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Roles whose name the route-level `role:admin|editor` gate depends on
     * directly — renaming or deleting either would lock people out of the
     * entire backoffice, so both are protected from both operations.
     */
    private const PROTECTED_ROLE_NAMES = ['admin', 'editor'];

    /**
     * List all roles.
     */
    public function index(): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => Role::query()
                ->withCount(['permissions', 'users'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form to create a new role.
     */
    public function create(): Response
    {
        return Inertia::render('admin/roles/create', [
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a new role.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::query()->create(['name' => $request->validated('name')]);
        $role->syncPermissions($request->validated('permissions', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role created.')]);

        return to_route('admin.roles.index');
    }

    /**
     * Show the form to edit a role.
     */
    public function edit(Role $role): Response
    {
        return Inertia::render('admin/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'is_protected' => in_array($role->name, self::PROTECTED_ROLE_NAMES, true),
                'permissions' => $role->permissions()->pluck('name'),
            ],
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update a role's name and permissions. The name of a protected role
     * (admin/editor) is silently left unchanged — the frontend disables
     * that field, so a change here would only ever come from a tampered
     * request, not a confused user who needs a validation error.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        if (! in_array($role->name, self::PROTECTED_ROLE_NAMES, true)) {
            $role->name = $request->validated('name');
            $role->save();
        }

        $role->syncPermissions($request->validated('permissions', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role updated.')]);

        return to_route('admin.roles.index');
    }

    /**
     * Delete a role, unless it's a protected system role or still has
     * users assigned.
     */
    public function destroy(Role $role): RedirectResponse
    {
        abort_if(in_array($role->name, self::PROTECTED_ROLE_NAMES, true), 422, "This role can't be deleted.");

        $userCount = $role->users()->count();
        abort_if($userCount > 0, 422, "Reassign the {$userCount} user(s) on this role first.");

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role deleted.')]);

        return to_route('admin.roles.index');
    }
}
