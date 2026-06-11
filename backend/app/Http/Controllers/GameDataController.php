<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class GameDataController extends Controller
{
    public function characters(): JsonResponse
    {
        $characters = [
            [
                'id'       => 1,
                'name'     => 'GLOOB',
                'role'     => 'The Tank',
                'tag'      => 'Blob #001',
                'color'    => '#3d9bff',
                'svgColor' => '#2ecc40',
                'svgDark'  => '#1aab2e',
                'stats'    => ['str' => 90, 'spd' => 40, 'goo' => 75],
            ],
            [
                'id'       => 2,
                'name'     => 'SPLATTY',
                'role'     => 'The Speedster',
                'tag'      => 'Blob #002',
                'color'    => '#ff5555',
                'svgColor' => '#ff2d55',
                'svgDark'  => '#b01f3b',
                'stats'    => ['str' => 50, 'spd' => 95, 'goo' => 60],
            ],
            [
                'id'       => 3,
                'name'     => 'OOZARA',
                'role'     => 'The Mage',
                'tag'      => 'Blob #003',
                'color'    => '#9b59b6',
                'svgColor' => '#8e44ad',
                'svgDark'  => '#6c3483',
                'stats'    => ['str' => 35, 'spd' => 65, 'goo' => 100],
            ],
            [
                'id'       => 4,
                'name'     => 'BLOBZILLA',
                'role'     => 'The Boss',
                'tag'      => 'Blob #???',
                'color'    => '#f39c12',
                'svgColor' => '#f1c40f',
                'svgDark'  => '#b7950b',
                'stats'    => ['str' => 100, 'spd' => 70, 'goo' => 100],
            ],
        ];

        return response()->json(['data' => $characters]);
    }
}
