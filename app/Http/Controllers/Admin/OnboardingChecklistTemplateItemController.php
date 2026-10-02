<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOnboardingChecklistTemplateItemRequest;
use App\Http\Requests\Admin\UpdateOnboardingChecklistTemplateItemRequest;
use App\Models\OnboardingChecklistTemplate;
use App\Models\OnboardingChecklistTemplateItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingChecklistTemplateItemController extends Controller
{
    /**
     * List a template's checklist items.
     */
    public function index(OnboardingChecklistTemplate $onboardingChecklistTemplate): Response
    {
        return Inertia::render('admin/onboarding-checklist-templates/items/index', [
            'template' => $onboardingChecklistTemplate,
            'items' => $onboardingChecklistTemplate->items,
        ]);
    }

    /**
     * Show the form to add an item to a template.
     */
    public function create(OnboardingChecklistTemplate $onboardingChecklistTemplate): Response
    {
        return Inertia::render('admin/onboarding-checklist-templates/items/create', [
            'template' => $onboardingChecklistTemplate,
        ]);
    }

    /**
     * Store a new checklist item.
     */
    public function store(StoreOnboardingChecklistTemplateItemRequest $request, OnboardingChecklistTemplate $onboardingChecklistTemplate): RedirectResponse
    {
        $onboardingChecklistTemplate->items()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Checklist item added.')]);

        return to_route('admin.onboarding-checklist-templates.items.index', $onboardingChecklistTemplate);
    }

    /**
     * Show the form to edit a checklist item.
     */
    public function edit(OnboardingChecklistTemplateItem $item): Response
    {
        return Inertia::render('admin/onboarding-checklist-templates/items/edit', [
            'template' => $item->template,
            'item' => $item,
        ]);
    }

    /**
     * Update a checklist item.
     */
    public function update(UpdateOnboardingChecklistTemplateItemRequest $request, OnboardingChecklistTemplateItem $item): RedirectResponse
    {
        $item->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Checklist item updated.')]);

        return to_route('admin.onboarding-checklist-templates.items.index', $item->onboarding_checklist_template_id);
    }

    /**
     * Delete a checklist item.
     */
    public function destroy(OnboardingChecklistTemplateItem $item): RedirectResponse
    {
        $templateId = $item->onboarding_checklist_template_id;

        $item->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Checklist item deleted.')]);

        return to_route('admin.onboarding-checklist-templates.items.index', $templateId);
    }
}
