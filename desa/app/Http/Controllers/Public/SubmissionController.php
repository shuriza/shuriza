<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:info_event,pengumuman,umkm,kenangan,lainnya',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
        ]);

        Submission::create([
            ...$validated,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Terima kasih! Kiriman Anda akan ditinjau oleh admin.');
    }
}
