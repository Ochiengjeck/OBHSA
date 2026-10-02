<?php

use App\Http\Controllers\AssessmentTakingController;
use Illuminate\Support\Facades\Route;

Route::prefix('assessments')->name('assessments.')->group(function () {
    Route::get('thank-you', [AssessmentTakingController::class, 'thankYou'])->name('thank-you');
    Route::get('{token}', [AssessmentTakingController::class, 'show'])->name('show');
    Route::post('{token}/submit', [AssessmentTakingController::class, 'submit'])->name('submit');
});
