<?php

use App\Http\Controllers\GameDataController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ScoreController;
use Illuminate\Support\Facades\Route;

Route::post('/wishlist', [WishlistController::class, 'store']);
Route::get('/characters', [GameDataController::class, 'characters']);

Route::get('/leaderboard', [ScoreController::class, 'index']);
Route::post('/scores', [ScoreController::class, 'store']);
