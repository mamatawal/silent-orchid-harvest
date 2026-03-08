<?php

use App\Http\Controllers\AnnouncementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    Route::get('/customers', [AnnouncementController::class, 'customers']);
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/announcements/unread', [AnnouncementController::class, 'unread']);
    Route::post('/announcements/mark-read', [AnnouncementController::class, 'markAsRead']);
});
