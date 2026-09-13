<?php

namespace App\Exceptions;

use RuntimeException;

class OfficeConfigurationException extends RuntimeException
{
    public static function serviceCodeIsInUse(string $serviceCode): self
    {
        return new self("Kode layanan {$serviceCode} tidak dapat diubah setelah tiket pernah diterbitkan karena kode adalah identitas sinkronisasi.");
    }

    public static function serviceHasOpenQueue(string $serviceName): self
    {
        return new self("Layanan {$serviceName} masih memiliki tiket menunggu atau dipanggil.");
    }

    public static function serviceHasOpenCounters(string $serviceName): self
    {
        return new self("Tutup semua loket layanan {$serviceName} sebelum menonaktifkannya.");
    }

    public static function inactiveService(string $serviceName): self
    {
        return new self("Layanan {$serviceName} sedang nonaktif.");
    }

    public static function counterHasActiveTicket(string $counterName, string $ticketLabel): self
    {
        return new self("Loket {$counterName} masih melayani tiket {$ticketLabel}; selesaikan atau lewati tiket sebelum mengubah layanan atau menutup loket.");
    }
}
