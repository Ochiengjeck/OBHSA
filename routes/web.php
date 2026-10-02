<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StaffingRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicPageController::class, 'home'])->name('home');
Route::get('about', [PublicPageController::class, 'show'])->name('pages.about')->defaults('slug', 'about');
Route::get('for-facilities', [PublicPageController::class, 'show'])->name('pages.for-facilities')->defaults('slug', 'for-facilities');
Route::get('for-caregivers', [PublicPageController::class, 'show'])->name('pages.for-caregivers')->defaults('slug', 'for-caregivers');

Route::get('services', [ServiceController::class, 'index'])->name('services.index');
Route::get('services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('contact/staffing-request', [StaffingRequestController::class, 'store'])->name('staffing-requests.store');

Route::get('jobs', [JobListingController::class, 'index'])->name('jobs.index');
Route::get('jobs/{jobListing:slug}', [JobListingController::class, 'show'])->name('jobs.show');
Route::post('jobs/{jobListing:slug}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');

require __DIR__.'/apply.php';
require __DIR__.'/assessments.php';
require __DIR__.'/offers.php';

Route::get('blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('blog/{blogPost:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::inertia('privacy-policy', 'public/legal-privacy')->name('legal.privacy');
Route::inertia('terms-of-service', 'public/legal-terms')->name('legal.terms');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
