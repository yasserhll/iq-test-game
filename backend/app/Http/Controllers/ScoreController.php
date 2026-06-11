<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\WishlistEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function index(): JsonResponse
    {
        $scores = Score::orderByDesc('iq')
            ->orderBy('time_seconds')
            ->take(10)
            ->get(['name', 'iq', 'time_display', 'created_at']);

        return response()->json(['data' => $scores]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'        => 'required|email|max:255',
            'iq'           => 'required|integer|min:40|max:200',
            'time_seconds' => 'required|integer|min:1',
            'time_display' => 'required|string|max:10',
        ]);

        $entry = WishlistEntry::where('email', $validated['email'])->first();

        if (! $entry) {
            return response()->json([
                'message' => 'Email not found in wishlist. Join the wishlist first to save your score.',
                'code'    => 'not_wishlisted',
            ], 422);
        }

        $existing = Score::where('email', $validated['email'])->first();

        if ($existing && $existing->iq >= $validated['iq']) {
            return response()->json([
                'message'  => 'Your previous score was higher!',
                'name'     => $existing->name,
                'iq'       => $existing->iq,
                'improved' => false,
            ]);
        }

        Score::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name'         => $entry->name,
                'iq'           => $validated['iq'],
                'time_seconds' => $validated['time_seconds'],
                'time_display' => $validated['time_display'],
            ]
        );

        $rank = Score::where('iq', '>', $validated['iq'])->count() + 1;

        return response()->json([
            'message'  => 'Score saved!',
            'name'     => $entry->name,
            'iq'       => $validated['iq'],
            'rank'     => $rank,
            'improved' => $existing !== null,
        ], 201);
    }
}
