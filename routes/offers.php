<?php

use App\Http\Controllers\OfferResponseController;
use Illuminate\Support\Facades\Route;

Route::prefix('offers')->name('offers.')->group(function () {
    Route::get('thank-you', [OfferResponseController::class, 'thankYou'])->name('thank-you');
    Route::get('{token}', [OfferResponseController::class, 'show'])->name('show');
    Route::post('{token}/respond', [OfferResponseController::class, 'respond'])->name('respond');
});
