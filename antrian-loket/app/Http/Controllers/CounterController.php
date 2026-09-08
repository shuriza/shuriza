<?php

namespace App\Http\Controllers;

use App\Exceptions\QueueConflictException;
use App\Models\Counter;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Models\Ticket;
use App\Services\QueueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class CounterController extends Controller
{
    public function __construct(
        private readonly QueueService $queue,
    ) {}

    /**
     * Beranda untuk memilih loket yang sedang buka.
     */
    public function index(): View
    {
        $counters = Counter::query()
            ->with('service')
            ->where('is_open', true)
            ->orderBy('name')
            ->get();

        $rows = $counters->map(fn (Counter $counter): array => [
            'counter' => $counter,
            'waitingCount' => $this->queue->waitingCount($counter->service),
            'estimatedWaitMinutes' => $this->queue->estimatedWaitMinutes($counter->service),
        ]);

        return view('loket.index', [
            'rows' => $rows,
            'pendingCount' => OutboxEntry::pending()->count(),
            'syncConfigured' => filled(config('antrian.sync.endpoint')),
        ]);
    }

    /**
     * Konsol operator untuk satu loket.
     */
    public function show(Counter $counter): View
    {
        $counter->load('service');

        $waiting = Ticket::query()
            ->waiting()
            ->forDate(now())
            ->where('service_id', $counter->service_id)
            ->orderBy('number')
            ->limit(8)
            ->get();

        return view('loket.show', [
            'counter' => $counter,
            'currentTicket' => $counter->currentTicket(),
            'waitingTickets' => $waiting,
            'waitingCount' => $this->queue->waitingCount($counter->service),
            'estimatedWaitMinutes' => $this->queue->estimatedWaitMinutes($counter->service),
            'pendingCount' => OutboxEntry::pending()->count(),
            'syncConfigured' => filled(config('antrian.sync.endpoint')),
        ]);
    }

    /**
     * Panggil tiket berikutnya untuk layanan loket ini.
     */
    public function callNext(Counter $counter): RedirectResponse
    {
        try {
            $ticket = $this->queue->callNext($counter);
        } catch (QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('loket.show', $counter)
            ->with('status', "Tiket {$ticket->label} dipanggil ke {$counter->name}.");
    }

    /**
     * Tandai tiket selesai dilayani.
     */
    public function finish(Counter $counter, Ticket $ticket): RedirectResponse
    {
        try {
            $ticket = $this->queue->finish($ticket, $counter);
        } catch (QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('loket.show', $counter)
            ->with('status', "Tiket {$ticket->label} selesai dilayani.");
    }

    /**
     * Lewati tiket yang dipanggil.
     */
    public function skip(Counter $counter, Ticket $ticket): RedirectResponse
    {
        try {
            $ticket = $this->queue->skip($ticket, $counter);
        } catch (QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('loket.show', $counter)
            ->with('status', "Tiket {$ticket->label} dilewati.");
    }

    /**
     * Ambil tiket baru untuk sebuah layanan, lalu buka pratinjau cetak.
     */
    public function issue(Service $service): RedirectResponse
    {
        try {
            $ticket = $this->queue->issue($service);
        } catch (QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('tiket.cetak', $ticket)
            ->with('status', "Tiket {$ticket->label} berhasil diambil.");
    }
}
