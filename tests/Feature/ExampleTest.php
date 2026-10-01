<?php

use App\Models\Page;

test('returns a successful response', function () {
    $page = Page::factory()->create(['slug' => 'home']);
    $page->sections()->create([
        'type' => 'hero',
        'position' => 0,
        'is_visible' => true,
        'content' => [
            'heading' => 'Welcome',
            'subheading' => 'Subheading',
            'image_path' => null,
            'primary_cta_label' => null,
            'primary_cta_url' => null,
            'secondary_cta_label' => null,
            'secondary_cta_url' => null,
        ],
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
});
