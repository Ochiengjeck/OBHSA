<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the initial OBHSA backoffice admin.
     */
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'ochiengjeck@gmail.com'],
            [
                'name' => 'OBHSA Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        $admin->syncRoles(['admin']);
    }
}
