<?php

use App\Models\OnboardingChecklistTemplate;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('marking a new template as default unsets the previous default', function () {
    $original = OnboardingChecklistTemplate::query()->create([
        'name' => 'Original',
        'is_default' => true,
        'is_active' => true,
    ]);

    $this->actingAs($this->admin)->post(route('admin.onboarding-checklist-templates.store'), [
        'name' => 'Replacement',
        'is_default' => true,
        'is_active' => true,
    ]);

    expect($original->fresh()->is_default)->toBeFalse();
    expect(OnboardingChecklistTemplate::query()->where('name', 'Replacement')->firstOrFail()->is_default)->toBeTrue();
});

test('editing a template to be default unsets every other default', function () {
    $original = OnboardingChecklistTemplate::query()->create([
        'name' => 'Original',
        'is_default' => true,
        'is_active' => true,
    ]);
    $other = OnboardingChecklistTemplate::query()->create([
        'name' => 'Other',
        'is_default' => false,
        'is_active' => true,
    ]);

    $this->actingAs($this->admin)->put(route('admin.onboarding-checklist-templates.update', $other), [
        'name' => 'Other',
        'is_default' => true,
        'is_active' => true,
    ]);

    expect($original->fresh()->is_default)->toBeFalse();
    expect($other->fresh()->is_default)->toBeTrue();
});

test('an editor cannot manage onboarding checklist templates', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)->get(route('admin.onboarding-checklist-templates.index'))->assertForbidden();
});
