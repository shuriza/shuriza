<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Dilempar saat sebuah aksi loket tidak sah pada state tiket saat ini,
 * misalnya menyelesaikan tiket yang sudah selesai, atau memanggil antrian
 * pada layanan yang sudah kosong.
 */
class QueueConflictException extends RuntimeException
{
    public static function emptyQueue(string $serviceName): self
    {
        return new self("Tidak ada antrian menunggu untuk layanan {$serviceName}.");
    }

    public static function alreadyHandled(string $label): self
    {
        return new self("Tiket {$label} sudah ditangani loket lain.");
    }

    public static function notCalled(string $label): self
    {
        return new self("Tiket {$label} belum dipanggil, jadi tidak bisa diubah.");
    }

    public static function notSkipped(string $label): self
    {
        return new self("Tiket {$label} tidak berstatus dilewati, jadi tidak bisa dikembalikan ke antrean.");
    }

    public static function notFromToday(string $label, string $serviceDate): self
    {
        return new self("Tiket {$label} berasal dari layanan tanggal {$serviceDate}, jadi tidak bisa dikembalikan ke antrean hari ini.");
    }

    public static function counterClosed(string $counterName): self
    {
        return new self("Loket {$counterName} sedang tutup.");
    }

    public static function counterBusy(string $counterName, string $label): self
    {
        return new self("Loket {$counterName} masih memegang tiket {$label}, jadi belum bisa memanggil tiket baru.");
    }

    public static function notOwnedByCounter(string $label, string $counterName): self
    {
        return new self("Tiket {$label} bukan milik loket {$counterName}.");
    }
}
