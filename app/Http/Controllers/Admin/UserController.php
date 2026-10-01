<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List all backoffice staff accounts.
     */
    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => User::query()->with('roles:id,name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form to create a new staff account.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Store a new staff account with a generated initial password.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $password = Str::password(16);

        $user = User::query()->create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $password,
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$request->validated('role')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Staff account created.')]);
        Inertia::flash('generatedPassword', $password);

        return to_route('admin.users.edit', $user);
    }

    /**
     * Show the form to edit a staff account.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user->load('roles:id,name'),
        ]);
    }

    /**
     * Update a staff account's details and role.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->safe()->only(['name', 'email']));
        $user->syncRoles([$request->validated('role')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Staff account updated.')]);

        return to_route('admin.users.index');
    }

    /**
     * Delete a staff account.
     */
    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->is(request()->user()), 422, "You can't delete your own account.");

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Staff account deleted.')]);

        return to_route('admin.users.index');
    }
}
