<?php

namespace App\Enums;

enum TicketStatus: string
{
    case Menunggu = 'menunggu';
    case Dipanggil = 'dipanggil';
    case Selesai = 'selesai';
    case Dilewati = 'dilewati';

    public function label(): string
    {
        return match ($this) {
            self::Menunggu => 'Menunggu',
            self::Dipanggil => 'Dipanggil',
            self::Selesai => 'Selesai',
            self::Dilewati => 'Dilewati',
        };
    }

    public function isTerminal(): bool
    {
        return $this === self::Selesai || $this === self::Dilewati;
    }

    public function isOpen(): bool
    {
        return ! $this->isTerminal();
    }
}
