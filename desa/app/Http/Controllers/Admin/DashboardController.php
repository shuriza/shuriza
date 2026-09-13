<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Product;
use App\Models\Submission;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalEvents' => Event::count(),
                'publishedEvents' => Event::published()->count(),
                'totalMemories' => Memory::count(),
                'pendingMemories' => Memory::pending()->count(),
                'approvedMemories' => Memory::approved()->count(),
                'totalDestinations' => Destination::count(),
                'totalWarga' => User::where('role', 'warga')->count(),
                'totalSubmissions' => Submission::count(),
                'pendingSubmissions' => Submission::pending()->count(),
                'pendingProducts' => Product::pending()->count(),
                'unreadMessages' => ContactMessage::unread()->count(),
            ],
            'recentMemories' => Memory::pending()->with('submitter')->latest()->take(5)->get(),
            'upcomingEvents' => Event::published()->upcoming()->orderBy('event_date')->take(5)->get(),
            'recentSubmissions' => Submission::pending()->latest()->take(5)->get(),
            'recentMessages' => ContactMessage::unread()->latest()->take(5)->get(),
        ]);
    }
}
