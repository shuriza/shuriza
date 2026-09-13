<?php

namespace App\Http\Controllers;

use App\Enums\TicketEventType;
use App\Models\OutboxEntry;
use App\Models\Ticket;
use App\Models\TicketEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
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
            'waitMinutes' => $this->durationMinutes(
                $this->firstOccurrence($events, TicketEventType::Issued),
                $this->firstOccurrence($events, TicketEventType::Called),
            ),
            'serviceMinutes' => $this->durationMinutes(
                $this->lastServiceStart($events),
                $this->lastOccurrence($events, TicketEventType::Finished),
            ),
            'pendingCount' => OutboxEntry::pending()->count(),
        ]);
    }

    /**
     * Durasi diturunkan dari jejak audit, bukan kolom tiket.
     *
     * `restore()` menihilkan `called_at`/`finished_at` dengan sengaja, jadi
     * membaca kolom itu membuat tiket yang pernah dipanggil tampak belum
     * pernah dilayani. Event menyimpan waktu sebenarnya.
     *
     * @param  Collection<int, TicketEvent>  $events
     */
    private function firstOccurrence($events, TicketEventType $type): ?Carbon
    {
        return $events->first(fn (TicketEvent $event): bool => $event->type === $type)?->occurred_at;
    }

    /**
     * @param  Collection<int, TicketEvent>  $events
     */
    private function lastOccurrence($events, TicketEventType $type): ?Carbon
    {
        return $events->last(fn (TicketEvent $event): bool => $event->type === $type)?->occurred_at;
    }

    /**
     * Awal pelayanan adalah pengumuman terakhir sebelum tiket selesai.
     *
     * Panggilan ulang berarti warga belum sampai ke loket pada panggilan
     * sebelumnya, jadi pelayanan belum benar-benar dimulai saat itu.
     *
     * @param  Collection<int, TicketEvent>  $events
     */
    private function lastServiceStart($events): ?Carbon
    {
        return $events
            ->last(fn (TicketEvent $event): bool => in_array(
                $event->type,
                [TicketEventType::Called, TicketEventType::Recalled],
                true,
            ))?->occurred_at;
    }

    private function durationMinutes(?Carbon $from, ?Carbon $to): ?float
    {
        if ($from === null || $to === null) {
            return null;
        }

        // Panggilan ulang/pengembalian bisa membuat pasangan event tidak
        // berurutan; durasi negatif adalah data tidak bermakna, bukan nol.
        if ($to->lessThan($from)) {
            return null;
        }

        return round($from->diffInSeconds($to) / 60, 1);
    }
}
