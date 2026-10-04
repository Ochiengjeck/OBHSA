<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePolicyDocumentRequest;
use App\Http\Requests\Admin\UpdatePolicyDocumentRequest;
use App\Models\PolicyDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PolicyDocumentController extends Controller
{
    /**
     * List all policy documents.
     */
    public function index(Request $request): Response
    {
        $documents = PolicyDocument::query()
            ->when($request->string('search')->isNotEmpty(), fn ($query) => $query->where('title', 'like', '%'.$request->string('search').'%'))
            ->orderBy('title')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/policy-documents/index', [
            'documents' => $documents,
            'filters' => ['search' => $request->string('search')->value() ?: null],
        ]);
    }

    /**
     * Show the form to create a new policy document.
     */
    public function create(): Response
    {
        return Inertia::render('admin/policy-documents/create');
    }

    /**
     * Store a new policy document.
     */
    public function store(StorePolicyDocumentRequest $request): RedirectResponse
    {
        PolicyDocument::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Policy document created.')]);

        return to_route('admin.policy-documents.index');
    }

    /**
     * Show the form to edit a policy document.
     */
    public function edit(PolicyDocument $policyDocument): Response
    {
        return Inertia::render('admin/policy-documents/edit', [
            'document' => $policyDocument,
        ]);
    }

    /**
     * Update a policy document.
     */
    public function update(UpdatePolicyDocumentRequest $request, PolicyDocument $policyDocument): RedirectResponse
    {
        $policyDocument->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Policy document updated.')]);

        return to_route('admin.policy-documents.index');
    }

    /**
     * Delete a policy document.
     */
    public function destroy(PolicyDocument $policyDocument): RedirectResponse
    {
        $policyDocument->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Policy document deleted.')]);

        return to_route('admin.policy-documents.index');
    }
}
