<?php

namespace App\Http\Controllers;

use App\Models\OutboxEntry;
use App\Services\DatabaseMaintenanceService;
use App\Services\OutboxOperationsService;
use App\Services\SyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class OperationsController extends Controller
{
    public function __construct(
        private readonly DatabaseMaintenanceService $databases,
        private readonly OutboxOperationsService $outbox,
        private readonly SyncService $sync,
    ) {}

    public function index(): View
    {
        $health = $this->outbox->health();

        return view('operasional.index', [
            'health' => $health,
            'syncConfigured' => $this->sync->isConfigured(),
            'recentFailures' => OutboxEntry::pending()
                ->whereNotNull('last_error')
                ->latest('last_attempt_at')
                ->limit(5)
                ->get(['event_uuid', 'attempts', 'last_attempt_at', 'last_error']),
            'pendingCount' => $health->pendingCount,
        ]);
    }

    public function sync(): RedirectResponse
    {
        if (! $this->sync->isConfigured()) {
            return back()->with('error', 'Sinkronisasi belum dapat dijalankan: endpoint pusat belum dikonfigurasi.');
        }

        $push = $this->sync->push();
        if ($push->error !== null) {
            return back()->with('error', 'Kirim ke pusat gagal: '.$push->error);
        }

        $pull = $this->sync->pull();
        if ($pull->error !== null) {
            return back()->with('error', "{$push->sent} event terkirim, tetapi tarik dari pusat gagal: {$pull->error}");
        }

        return back()->with('status', "Sinkronisasi selesai: {$push->sent} event terkirim dan {$pull->sent} event diterapkan.");
    }

    public function backup(): RedirectResponse
    {
        try {
            $backup = $this->databases->backup();
        } catch (\Throwable $exception) {
            return back()->with('error', 'Backup gagal: '.$exception->getMessage());
        }

        return back()->with('status', "Backup konsisten dibuat: {$backup->path} ({$backup->bytes} byte).");
    }
}
