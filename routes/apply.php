<?php

use App\Http\Controllers\ApplyController;
use Illuminate\Support\Facades\Route;

Route::prefix('apply')->name('apply.')->group(function () {
    Route::get('/', [ApplyController::class, 'create'])->name('create');
    Route::post('/', [ApplyController::class, 'store'])->name('store');

    Route::get('location', [ApplyController::class, 'editLocation'])->name('location.edit');
    Route::put('location', [ApplyController::class, 'updateLocation'])->name('location.update');

    Route::get('preferences', [ApplyController::class, 'editPreferences'])->name('preferences.edit');
    Route::put('preferences', [ApplyController::class, 'updatePreferences'])->name('preferences.update');

    Route::get('employment-history', [ApplyController::class, 'editEmploymentHistory'])->name('employment-history.edit');
    Route::put('employment-history', [ApplyController::class, 'updateEmploymentHistory'])->name('employment-history.update');

    Route::get('education', [ApplyController::class, 'editEducation'])->name('education.edit');
    Route::put('education', [ApplyController::class, 'updateEducation'])->name('education.update');

    Route::get('documents', [ApplyController::class, 'editDocuments'])->name('documents.edit');
    Route::put('documents', [ApplyController::class, 'updateDocuments'])->name('documents.update');

    Route::get('consent', [ApplyController::class, 'editConsent'])->name('consent.edit');
    Route::put('consent', [ApplyController::class, 'updateConsent'])->name('consent.update');

    Route::get('review', [ApplyController::class, 'review'])->name('review');
    Route::post('submit', [ApplyController::class, 'submit'])->name('submit');

    Route::get('thank-you', [ApplyController::class, 'thankYou'])->name('thank-you');
    Route::get('not-available', [ApplyController::class, 'notAvailable'])->name('not-available');

    Route::get('resume/{token}', [ApplyController::class, 'resume'])->name('resume');
    Route::post('resend', [ApplyController::class, 'resend'])->name('resend')->middleware('throttle:3,1');
});
