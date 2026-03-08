<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'AnnounceKit API', 'version' => '1.0']);
});
