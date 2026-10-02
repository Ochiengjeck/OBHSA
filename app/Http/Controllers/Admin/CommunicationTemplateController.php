<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCommunicationTemplateRequest;
use App\Http\Requests\Admin\UpdateCommunicationTemplateRequest;
use App\Models\CommunicationTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CommunicationTemplateController extends Controller
{
    /**
     * List all communication templates.
     */
    public function index(): Response
    {
        return Inertia::render('admin/communication-templates/index', [
            'templates' => CommunicationTemplate::query()->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form to create a new communication template.
     */
    public function create(): Response
    {
        return Inertia::render('admin/communication-templates/create');
    }

    /**
     * Store a new communication template.
     */
    public function store(StoreCommunicationTemplateRequest $request): RedirectResponse
    {
        CommunicationTemplate::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Template created.')]);

        return to_route('admin.communication-templates.index');
    }

    /**
     * Show the form to edit a communication template.
     */
    public function edit(CommunicationTemplate $communicationTemplate): Response
    {
        return Inertia::render('admin/communication-templates/edit', [
            'template' => $communicationTemplate,
        ]);
    }

    /**
     * Update a communication template.
     */
    public function update(UpdateCommunicationTemplateRequest $request, CommunicationTemplate $communicationTemplate): RedirectResponse
    {
        $communicationTemplate->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Template updated.')]);

        return to_route('admin.communication-templates.index');
    }

    /**
     * Delete a communication template.
     */
    public function destroy(CommunicationTemplate $communicationTemplate): RedirectResponse
    {
        $communicationTemplate->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Template deleted.')]);

        return to_route('admin.communication-templates.index');
    }
}
