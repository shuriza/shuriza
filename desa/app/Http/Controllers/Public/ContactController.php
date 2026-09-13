<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\VillageInfo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Contact', [
            // The page looks values up by key via `villageInfo.find(...)`, so hand it the
            // contact rows rather than pre-picked scalars.
            'villageInfo' => VillageInfo::query()
                ->whereIn('key', ['alamat', 'telepon', 'email', 'jam_kerja', 'koordinat'])
                ->get(['key', 'value', 'label']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            // Honeypot: real users never see this field, bots fill it.
            'website' => 'prohibited',
        ]);

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Pesan Anda berhasil dikirim. Terima kasih telah menghubungi kami.');
    }
}
