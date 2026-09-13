<?php

namespace App\Enums;

enum TicketEventType: string
{
    case Issued = 'issued';
    case Called = 'called';
    case Recalled = 'recalled';
    case Restored = 'restored';
    case Finished = 'finished';
    case Skipped = 'skipped';

    public function label(): string
    {
        return match ($this) {
            self::Issued => 'Tiket diambil',
            self::Called => 'Dipanggil',
            self::Recalled => 'Dipanggil ulang',
            self::Restored => 'Dikembalikan ke antrean',
            self::Finished => 'Selesai dilayani',
            self::Skipped => 'Dilewati',
        };
    }

    /**
     * Status tiket yang sah setelah event jenis ini terjadi.
     *
     * Satu-satunya sumber kebenaran untuk pasangan event/status: dipakai
     * ConflictResolver dan SyncService supaya keduanya tidak bisa berbeda
     * pendapat, dan supaya case enum baru wajib menetapkan statusnya.
     */
    public function resultingStatus(): TicketStatus
    {
        return match ($this) {
            self::Issued, self::Restored => TicketStatus::Menunggu,
            self::Called, self::Recalled => TicketStatus::Dipanggil,
            self::Finished => TicketStatus::Selesai,
            self::Skipped => TicketStatus::Dilewati,
        };
    }

    public function matchesStatus(TicketStatus $status): bool
    {
        return $this->resultingStatus() === $status;
    }
}
