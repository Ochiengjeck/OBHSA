<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    use StoresUploadedFiles;

    /**
     * List all testimonials.
     */
    public function index(Request $request): Response
    {
        $testimonials = Testimonial::query()
            ->when($request->string('search')->isNotEmpty(), fn ($query) => $query->where('author_name', 'like', '%'.$request->string('search').'%'))
            ->orderBy('position')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/testimonials/index', [
            'testimonials' => $testimonials,
            'filters' => ['search' => $request->string('search')->value() ?: null],
        ]);
    }

    /**
     * Show the form to create a new testimonial.
     */
    public function create(): Response
    {
        return Inertia::render('admin/testimonials/create');
    }

    /**
     * Store a new testimonial.
     */
    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        $testimonial = Testimonial::query()->create($request->safe()->except('author_photo'));

        if ($request->hasFile('author_photo')) {
            $testimonial->update(['author_photo_path' => $this->storePublicFile($request->file('author_photo'), 'testimonials')]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Testimonial created.')]);

        return to_route('admin.testimonials.index');
    }

    /**
     * Show the form to edit a testimonial.
     */
    public function edit(Testimonial $testimonial): Response
    {
        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Update a testimonial.
     */
    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->fill($request->safe()->except('author_photo'));

        if ($request->hasFile('author_photo')) {
            if ($testimonial->author_photo_path) {
                Storage::disk('public')->delete($testimonial->author_photo_path);
            }

            $testimonial->author_photo_path = $this->storePublicFile($request->file('author_photo'), 'testimonials');
        }

        $testimonial->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Testimonial updated.')]);

        return to_route('admin.testimonials.index');
    }

    /**
     * Delete a testimonial.
     */
    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        if ($testimonial->author_photo_path) {
            Storage::disk('public')->delete($testimonial->author_photo_path);
        }

        $testimonial->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Testimonial deleted.')]);

        return to_route('admin.testimonials.index');
    }
}
