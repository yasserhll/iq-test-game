<?php

use App\Http\Controllers\GameDataController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::post('/wishlist', [WishlistController::class, 'store']);
Route::get('/characters', [GameDataController::class, 'characters']);
