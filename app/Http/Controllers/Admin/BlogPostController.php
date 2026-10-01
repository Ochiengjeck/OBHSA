<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    use StoresUploadedFiles;

    /**
     * List all blog posts.
     */
    public function index(): Response
    {
        return Inertia::render('admin/blog-posts/index', [
            'posts' => BlogPost::query()->latest('published_at')->get(),
        ]);
    }

    /**
     * Show the form to create a new blog post.
     */
    public function create(): Response
    {
        return Inertia::render('admin/blog-posts/create');
    }

    /**
     * Store a new blog post.
     */
    public function store(StoreBlogPostRequest $request): RedirectResponse
    {
        $post = BlogPost::query()->create([
            ...$request->safe()->except('featured_image'),
            'author_id' => $request->user()->id,
        ]);

        if ($request->hasFile('featured_image')) {
            $post->update(['featured_image_path' => $this->storePublicFile($request->file('featured_image'), 'blog')]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post created.')]);

        return to_route('admin.blog-posts.index');
    }

    /**
     * Show the form to edit a blog post.
     */
    public function edit(BlogPost $blogPost): Response
    {
        return Inertia::render('admin/blog-posts/edit', [
            'post' => $blogPost,
        ]);
    }

    /**
     * Update a blog post.
     */
    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost): RedirectResponse
    {
        $blogPost->fill($request->safe()->except('featured_image'));

        if ($request->hasFile('featured_image')) {
            if ($blogPost->featured_image_path) {
                Storage::disk('public')->delete($blogPost->featured_image_path);
            }

            $blogPost->featured_image_path = $this->storePublicFile($request->file('featured_image'), 'blog');
        }

        $blogPost->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post updated.')]);

        return to_route('admin.blog-posts.index');
    }

    /**
     * Delete a blog post.
     */
    public function destroy(BlogPost $blogPost): RedirectResponse
    {
        if ($blogPost->featured_image_path) {
            Storage::disk('public')->delete($blogPost->featured_image_path);
        }

        $blogPost->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post deleted.')]);

        return to_route('admin.blog-posts.index');
    }
}
