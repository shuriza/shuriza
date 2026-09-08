<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;
use Native\Desktop\DataObjects\Printer;
use Native\Desktop\Facades\System;

class TicketPrintController extends Controller
{
    /**
     * Pratinjau struk tiket (tampilan 58mm) di layar.
     */
    public function show(Ticket $ticket): View
    {
        return view('tiket.print', $this->viewData($ticket));
    }

    /**
     * Render struk ke HTML lalu kirim ke printer lokal via NativePHP.
     * Di luar aplikasi desktop (browser biasa) panggilan native dilewati.
     */
    public function print(Ticket $ticket): RedirectResponse
    {
        $html = view('tiket.print', $this->viewData($ticket))->render();

        if (! $this->runningInsideNative()) {
            return redirect()
                ->route('tiket.cetak', $ticket)
                ->with('status', 'Pencetakan langsung hanya berfungsi di aplikasi desktop. Di browser, gunakan tombol "Cetak di Browser".');
        }

        try {
            System::print($html, $this->resolvePrinter());
        } catch (\Throwable $e) {
            Log::warning('Gagal mencetak tiket', ['error' => $e->getMessage()]);

            return redirect()
                ->route('tiket.cetak', $ticket)
                ->with('error', 'Gagal mencetak tiket: '.$e->getMessage());
        }

        return redirect()
            ->route('tiket.cetak', $ticket)
            ->with('status', "Tiket {$ticket->label} dikirim ke printer.");
    }

    /**
     * Data bersama untuk tampilan struk.
     *
     * @return array<string, mixed>
     */
    private function viewData(Ticket $ticket): array
    {
        $ticket->loadMissing('service');

        // Jumlah antrian yang masih menunggu tepat di depan tiket ini.
        $queueAhead = $ticket->status->isTerminal()
            ? 0
            : Ticket::query()
                ->waiting()
                ->forDate($ticket->service_date)
                ->where('service_id', $ticket->service_id)
                ->where('number', '<', $ticket->number)
                ->count();

        return [
            'ticket' => $ticket,
            'queueAhead' => $queueAhead,
            'officeName' => config('antrian.office.name'),
            'officeAddress' => config('antrian.office.address'),
        ];
    }

    /**
     * Apakah kode berjalan di dalam runtime NativePHP.
     */
    private function runningInsideNative(): bool
    {
        return filter_var(env('NATIVEPHP_RUNNING'), FILTER_VALIDATE_BOOL) === true;
    }

    /**
     * Cari printer yang dikonfigurasi berdasarkan nama; null = printer bawaan sistem.
     */
    private function resolvePrinter(): ?Printer
    {
        $configured = config('antrian.printer');

        if (! is_string($configured) || $configured === '') {
            return null;
        }

        foreach (System::printers() as $printer) {
            if ($printer->name === $configured) {
                return $printer;
            }
        }

        throw new \RuntimeException("Printer \"{$configured}\" tidak ditemukan. Periksa koneksi dan pengaturan printer.");
    }
}
