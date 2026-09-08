<?php

namespace App\Enums;

enum TicketEventType: string
{
    case Issued = 'issued';
    case Called = 'called';
    case Finished = 'finished';
    case Skipped = 'skipped';

    public function label(): string
    {
        return match ($this) {
            self::Issued => 'Tiket diambil',
            self::Called => 'Dipanggil',
            self::Finished => 'Selesai dilayani',
            self::Skipped => 'Dilewati',
        };
    }
}
