<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->status ?? 'all';

        $messages = ContactMessage::query()
            ->when($filter !== 'all', fn ($query) => $query->where('status', $filter))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Contacts/Index', [
            'messages' => $messages,
            'filter' => $filter,
            'unreadCount' => ContactMessage::unread()->count(),
        ]);
    }

    public function markRead(ContactMessage $contactMessage)
    {
        $contactMessage->markAsRead();

        return back()->with('success', 'Pesan ditandai sudah dibaca.');
    }

    public function archive(ContactMessage $contactMessage)
    {
        $contactMessage->update(['status' => 'archived']);

        return back()->with('success', 'Pesan diarsipkan.');
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
