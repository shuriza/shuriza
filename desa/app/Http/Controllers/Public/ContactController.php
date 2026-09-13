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
        $address = VillageInfo::getValue('alamat', 'Desa Muneng, Kec. Purwoasri, Kab. Kediri, Jawa Timur');
        $coordinates = VillageInfo::getValue('koordinat', '-7.6298, 112.0527');

        return Inertia::render('Public/Contact', [
            'address' => $address,
            'coordinates' => $coordinates,
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
