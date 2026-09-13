<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Models\OutboxEntry;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

/**
 * Pembaca jejak audit tiket.
 *
 * `ticket_events` sudah ditulis pada setiap mutasi, tetapi tanpa halaman ini
 * operator tidak punya cara menjawab "tiket A042 tadi kenapa?". Halaman ini
 * hanya membaca; tidak ada mutasi antrean di sini.
 */
class TicketHistoryController extends Controller
{
    private const RESULT_LIMIT = 25;

    /**
     * Cari tiket pada satu tanggal layanan berdasarkan label atau nomor.
     */
    public function index(Request $request): View
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
            'q' => ['nullable', 'string', 'max:12'],
        ]);

        $date = Carbon::parse($validated['date'] ?? now())->toDateString();
        $term = trim($validated['q'] ?? '');

        $query = Ticket::query()
            ->with('service', 'counter')
            ->forDate($date)
            ->orderBy('number');

        if ($term !== '') {
            // Label dicocokkan sebagian supaya "42" menemukan A042; nomor
            // dicocokkan tepat hanya ketika input memang angka.
            $query->where(function ($builder) use ($term): void {
                $builder->where('label', 'like', '%'.$term.'%');

                if (ctype_digit($term)) {
                    $builder->orWhere('number', (int) $term);
                }
            });
        }

        return view('riwayat.index', [
            'date' => $date,
            'term' => $term,
            'tickets' => $query->limit(self::RESULT_LIMIT)->get(),
            'resultLimit' => self::RESULT_LIMIT,
            'pendingCount' => OutboxEntry::pending()->count(),
        ]);
    }

    /**
     * Jejak lengkap satu tiket beserta status pengiriman tiap event.
     */
    public function show(Ticket $ticket): View
    {
        $ticket->load('service', 'counter');

        $events = $ticket->events()->orderBy('occurred_at')->orderBy('id')->get();

        // Status sinkronisasi per event dibaca dari outbox. Event hasil import
        // dari pusat tidak punya baris outbox — itu memang benar, bukan hilang.
        $outbox = OutboxEntry::query()
            ->whereIn('event_uuid', $events->pluck('uuid'))
            ->get(['event_uuid', 'synced_at', 'attempts', 'last_error'])
            ->keyBy('event_uuid');

        return view('riwayat.show', [
            'ticket' => $ticket,
            'events' => $events,
            'outbox' => $outbox,
            'waitMinutes' => $this->durationMinutes($ticket->issued_at, $ticket->called_at),
            'serviceMinutes' => $ticket->status === TicketStatus::Selesai
                ? $this->durationMinutes($ticket->called_at, $ticket->finished_at)
                : null,
            'pendingCount' => OutboxEntry::pending()->count(),
        ]);
    }

    private function durationMinutes(?Carbon $from, ?Carbon $to): ?float
    {
        if ($from === null || $to === null) {
            return null;
        }

        return round($from->diffInSeconds($to) / 60, 1);
    }
}
