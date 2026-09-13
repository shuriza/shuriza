<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Exceptions\OfficeConfigurationException;
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

        $waitingCounts = Ticket::query()
            ->waiting()
            ->forDate(now())
            ->whereIn('service_id', $counters->pluck('service_id'))
            ->selectRaw('service_id, count(*) as waiting_count')
            ->groupBy('service_id')
            ->pluck('waiting_count', 'service_id');

        $rows = $counters->map(function (Counter $counter) use ($waitingCounts): array {
            $waitingCount = (int) $waitingCounts->get($counter->service_id, 0);

            return [
                'counter' => $counter,
                'waitingCount' => $waitingCount,
                'estimatedWaitMinutes' => $waitingCount * (int) $counter->service->estimated_minutes,
            ];
        });

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
        $serviceDate = now();

        $waiting = Ticket::query()
            ->waiting()
            ->forDate($serviceDate)
            ->where('service_id', $counter->service_id)
            ->orderBy('number')
            ->limit(8)
            ->get();

        $waitingCount = $this->queue->waitingCount($counter->service, $serviceDate);

        // Tiket yang dilewati loket ini hari ini masih bisa dikembalikan ke
        // antrean, jadi operator perlu melihatnya.
        $skippedTickets = Ticket::query()
            ->forDate($serviceDate)
            ->where('counter_id', $counter->id)
            ->where('status', TicketStatus::Dilewati->value)
            ->orderBy('number')
            ->get();

        return view('loket.show', [
            'counter' => $counter,
            'currentTicket' => $counter->currentTicket(),
            'waitingTickets' => $waiting,
            'skippedTickets' => $skippedTickets,
            'waitingCount' => $waitingCount,
            'estimatedWaitMinutes' => $waitingCount * (int) $counter->service->estimated_minutes,
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
     * Panggil ulang tiket yang sedang dilayani.
     */
    public function recall(Counter $counter, Ticket $ticket): RedirectResponse
    {
        try {
            $ticket = $this->queue->recall($ticket, $counter);
        } catch (QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('loket.show', $counter)
            ->with('status', "Tiket {$ticket->label} dipanggil ulang.");
    }

    /**
     * Kembalikan tiket yang dilewati ke antrean menunggu.
     */
    public function restore(Counter $counter, Ticket $ticket): RedirectResponse
    {
        try {
            $ticket = $this->queue->restore($ticket, $counter);
        } catch (QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('loket.show', $counter)
            ->with('status', "Tiket {$ticket->label} dikembalikan ke antrean dan mempertahankan nomornya.");
    }

    /**
     * Ambil tiket baru untuk sebuah layanan, lalu buka pratinjau cetak.
     */
    public function issue(Service $service): RedirectResponse
    {
        try {
            $ticket = $this->queue->issue($service);
        } catch (OfficeConfigurationException|QueueConflictException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('tiket.cetak', $ticket)
            ->with('status', "Tiket {$ticket->label} berhasil diambil.");
    }
}
