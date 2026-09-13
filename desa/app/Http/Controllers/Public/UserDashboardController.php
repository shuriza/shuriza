<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Memory;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $myMemories = Memory::where('submitted_by', $user->id)
            ->latest()
            ->get();

        $myProducts = Product::where('user_id', $user->id)
            ->latest()
            ->get();

        $stats = [
            'totalMemories' => $myMemories->count(),
            'approvedMemories' => $myMemories->where('status', 'approved')->count(),
            'pendingMemories' => $myMemories->where('status', 'pending')->count(),
            'totalProducts' => $myProducts->count(),
        ];

        return Inertia::render('Public/UserDashboard', [
            'myMemories' => $myMemories,
            'myProducts' => $myProducts,
            'stats' => $stats,
        ]);
    }
}
