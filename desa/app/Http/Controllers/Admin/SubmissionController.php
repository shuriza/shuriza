<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Submission::query()->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $submissions = $query->paginate(15);

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $submissions,
            'filter' => $request->status ?? 'all',
        ]);
    }

    public function approve(Submission $submission, Request $request)
    {
        $submission->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Kiriman berhasil disetujui.');
    }

    public function reject(Submission $submission)
    {
        $submission->update(['status' => 'rejected']);
        return back()->with('success', 'Kiriman ditolak.');
    }

    public function destroy(Submission $submission)
    {
        $submission->delete();
        return back()->with('success', 'Kiriman berhasil dihapus.');
    }
}
