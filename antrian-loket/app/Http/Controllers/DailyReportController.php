<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class DailyReportController extends Controller
{
    public function index(Request $request): View
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);
        $date = Carbon::parse($validated['date'] ?? now())->toDateString();

        $totals = Ticket::query()
            ->forDate($date)
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $services = Service::query()
            ->leftJoin('tickets', function ($join) use ($date): void {
                $join->on('tickets.service_id', '=', 'services.id')
                    ->where('tickets.service_date', '=', $date);
            })
            ->select([
                'services.id',
                'services.code',
                'services.name',
                'services.estimated_minutes',
            ])
            ->selectRaw('COUNT(tickets.id) as issued_count')
            ->selectRaw('SUM(CASE WHEN tickets.status = ? THEN 1 ELSE 0 END) as waiting_count', [TicketStatus::Menunggu->value])
            ->selectRaw('SUM(CASE WHEN tickets.status = ? THEN 1 ELSE 0 END) as called_count', [TicketStatus::Dipanggil->value])
            ->selectRaw('SUM(CASE WHEN tickets.status = ? THEN 1 ELSE 0 END) as finished_count', [TicketStatus::Selesai->value])
            ->selectRaw('SUM(CASE WHEN tickets.status = ? THEN 1 ELSE 0 END) as skipped_count', [TicketStatus::Dilewati->value])
            ->selectRaw('AVG(CASE WHEN tickets.called_at IS NOT NULL THEN (julianday(tickets.called_at) - julianday(tickets.issued_at)) * 1440 END) as average_wait_minutes')
            ->selectRaw('AVG(CASE WHEN tickets.finished_at IS NOT NULL AND tickets.called_at IS NOT NULL THEN (julianday(tickets.finished_at) - julianday(tickets.called_at)) * 1440 END) as average_service_minutes')
            ->groupBy('services.id', 'services.code', 'services.name', 'services.estimated_minutes')
            ->orderBy('services.code')
            ->get();

        return view('laporan.harian', [
            'date' => $date,
            'services' => $services,
            'issuedCount' => $totals->sum(),
            'waitingCount' => (int) $totals->get(TicketStatus::Menunggu->value, 0),
            'calledCount' => (int) $totals->get(TicketStatus::Dipanggil->value, 0),
            'finishedCount' => (int) $totals->get(TicketStatus::Selesai->value, 0),
            'skippedCount' => (int) $totals->get(TicketStatus::Dilewati->value, 0),
            'pendingCount' => OutboxEntry::pending()->count(),
        ]);
    }
}
