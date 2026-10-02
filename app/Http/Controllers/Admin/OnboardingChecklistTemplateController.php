<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOnboardingChecklistTemplateRequest;
use App\Http\Requests\Admin\UpdateOnboardingChecklistTemplateRequest;
use App\Models\OnboardingChecklistTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingChecklistTemplateController extends Controller
{
    /**
     * List all onboarding checklist templates.
     */
    public function index(): Response
    {
        return Inertia::render('admin/onboarding-checklist-templates/index', [
            'templates' => OnboardingChecklistTemplate::query()->withCount('items')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form to create a new template.
     */
    public function create(): Response
    {
        return Inertia::render('admin/onboarding-checklist-templates/create');
    }

    /**
     * Store a new template.
     */
    public function store(StoreOnboardingChecklistTemplateRequest $request): RedirectResponse
    {
        $template = OnboardingChecklistTemplate::query()->create($request->validated());

        if ($template->is_default) {
            OnboardingChecklistTemplate::query()->whereKeyNot($template->id)->update(['is_default' => false]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Template created.')]);

        return to_route('admin.onboarding-checklist-templates.items.index', $template);
    }

    /**
     * Show the form to edit a template.
     */
    public function edit(OnboardingChecklistTemplate $onboardingChecklistTemplate): Response
    {
        return Inertia::render('admin/onboarding-checklist-templates/edit', [
            'template' => $onboardingChecklistTemplate,
        ]);
    }

    /**
     * Update a template.
     */
    public function update(UpdateOnboardingChecklistTemplateRequest $request, OnboardingChecklistTemplate $onboardingChecklistTemplate): RedirectResponse
    {
        $onboardingChecklistTemplate->update($request->validated());

        if ($onboardingChecklistTemplate->is_default) {
            OnboardingChecklistTemplate::query()->whereKeyNot($onboardingChecklistTemplate->id)->update(['is_default' => false]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Template updated.')]);

        return to_route('admin.onboarding-checklist-templates.index');
    }

    /**
     * Delete a template.
     */
    public function destroy(OnboardingChecklistTemplate $onboardingChecklistTemplate): RedirectResponse
    {
        $onboardingChecklistTemplate->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Template deleted.')]);

        return to_route('admin.onboarding-checklist-templates.index');
    }
}
