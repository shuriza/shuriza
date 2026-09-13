<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Memory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Memory::with('submitter', 'approver');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $memories = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/Memories/Index', [
            'memories' => $memories,
            'filter' => $request->status ?? 'all',
        ]);
    }

    public function approve(Memory $memory, Request $request)
    {
        $memory->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        // Generate embed code if not already set
        if (!$memory->embed_code) {
            $memory->embed_code = $memory->generateEmbedCode();
            $memory->save();
        }

        return back()->with('success', 'Kenangan berhasil disetujui.');
    }

    public function reject(Memory $memory)
    {
        $memory->update([
            'status' => 'rejected',
        ]);

        return back()->with('success', 'Kenangan ditolak.');
    }

    public function destroy(Memory $memory)
    {
        $memory->delete();

        return back()->with('success', 'Kenangan berhasil dihapus.');
    }
}
