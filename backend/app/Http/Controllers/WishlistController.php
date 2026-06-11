<?php

namespace App\Http\Controllers;

use App\Http\Requests\WishlistRequest;
use App\Models\WishlistEntry;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    public function store(WishlistRequest $request): JsonResponse
    {
        WishlistEntry::create($request->validated());

        return response()->json([
            'data'    => null,
            'message' => 'You\'re on the list! See you at launch.',
        ], 201);
    }
}
