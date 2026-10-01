<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * List published blog posts.
     */
    public function index(): Response
    {
        return Inertia::render('public/blog/index', [
            'posts' => BlogPost::query()->published()->latest('published_at')->paginate(9),
        ]);
    }

    /**
     * Show a single published blog post.
     */
    public function show(BlogPost $blogPost): Response
    {
        abort_unless($blogPost->is_published, 404);

        return Inertia::render('public/blog/show', [
            'post' => $blogPost,
        ]);
    }
}
