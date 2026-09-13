<?php

namespace App\Services;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Exceptions\OfficeConfigurationException;
use App\Exceptions\QueueConflictException;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use App\Support\DeviceIdentity;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class QueueService
{
    private const CONCURRENCY_ATTEMPTS = 10;

    private const CONCURRENCY_BACKOFF_MICROSECONDS = 50000;

    public function __construct(
        private readonly TicketEventRecorder $recorder,
        private readonly DeviceIdentity $device,
    ) {}

    public function issue(Service $service, ?\DateTimeInterface $date = null): Ticket
    {
        $serviceDate = ($date !== null ? Carbon::parse($date) : now())->toDateString();

        return $this->withRetry(
            fn (QueryException $e): bool => $this->shouldRetryIssueTransaction($e),
            'Gagal menerbitkan tiket.',
            fn (): Ticket => DB::transaction(function () use ($service, $serviceDate): Ticket {
                $service = Service::query()->findOrFail($service->getKey());

                if (! $service->is_active) {
                    throw OfficeConfigurationException::inactiveService($service->name);
                }

                // SQLite mengabaikan lockForUpdate(), jadi UNIQUE index adalah
                // arbiter nyata ketika dua loket menghitung nomor yang sama.
                $nextNumber = (int) Ticket::query()
                    ->where('service_id', $service->id)
                    ->where('service_date', $serviceDate)
                    ->max('number') + 1;

                $ticket = Ticket::query()->create([
                    'service_id' => $service->id,
                    'counter_id' => null,
                    'service_date' => $serviceDate,
                    'number' => $nextNumber,
                    'label' => $service->code.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT),
                    'status' => TicketStatus::Menunggu,
                    'issued_at' => now(),
                    'revision' => 1,
                    'origin_device_id' => $this->device->id(),
                ]);

                $this->recorder->record($ticket, TicketEventType::Issued);

                return $ticket->load('service');
            }),
        );
    }

    public function callNext(Counter $counter): Ticket
    {
        return $this->withRetry(
            fn (QueryException $e): bool => $this->shouldRetryLockException($e),
            'Gagal memanggil tiket berikutnya.',
            fn (): Ticket => DB::transaction(function () use ($counter): Ticket {
                $counter = Counter::query()
                    ->with('service')
                    ->findOrFail($counter->getKey());

                if (! $counter->is_open) {
                    throw QueueConflictException::counterClosed($counter->name);
                }

                $today = Carbon::today()->toDateString();
                $attempts = 0;

                while ($attempts < 25) {
                    $attempts++;

                    $activeTicket = Ticket::query()
                        ->where('counter_id', $counter->id)
                        ->where('status', TicketStatus::Dipanggil->value)
                        ->orderByDesc('called_at')
                        ->first();

                    if ($activeTicket !== null) {
                        throw QueueConflictException::counterBusy($counter->name, $activeTicket->label);
                    }

                    $ticket = Ticket::query()
                        ->where('service_id', $counter->service_id)
                        ->where('service_date', $today)
                        ->where('status', TicketStatus::Menunggu->value)
                        ->orderBy('number')
                        ->first();

                    if ($ticket === null) {
                        throw QueueConflictException::emptyQueue($counter->service->name);
                    }

                    $updated = Ticket::query()
                        ->whereKey($ticket->id)
                        ->where('status', TicketStatus::Menunggu->value)
                        ->update([
                            'status' => TicketStatus::Dipanggil->value,
                            'counter_id' => $counter->id,
                            'called_at' => now(),
                            'revision' => DB::raw('revision + 1'),
                            'origin_device_id' => $this->device->id(),
                            'updated_at' => now(),
                        ]);

                    if ($updated === 0) {
                        continue;
                    }

                    $ticket->refresh();
                    $ticket->load(['service', 'counter']);

                    $this->recorder->record($ticket, TicketEventType::Called, [
                        'counter_uuid' => $counter->uuid,
                        'counter_name' => $counter->name,
                    ]);

                    return $ticket;
                }

                throw QueueConflictException::emptyQueue($counter->service->name);
            }),
        );
    }

    public function finish(Ticket $ticket, Counter $counter): Ticket
    {
        return $this->transition($ticket, $counter, TicketStatus::Selesai, TicketEventType::Finished);
    }

    public function skip(Ticket $ticket, Counter $counter): Ticket
    {
        return $this->transition($ticket, $counter, TicketStatus::Dilewati, TicketEventType::Skipped);
    }

    /**
     * Panggil ulang tiket yang sedang dilayani loket ini.
     *
     * Status tetap `dipanggil`; yang berubah adalah `called_at`, `revision`,
     * dan perangkat asal. Revision tetap naik supaya pengumuman terakhir
     * memenangkan resolusi konflik terhadap salinan lama di perangkat lain.
     */
    public function recall(Ticket $ticket, Counter $counter): Ticket
    {
        return $this->withRetry(
            fn (QueryException $e): bool => $this->shouldRetryLockException($e),
            'Gagal memanggil ulang tiket.',
            fn (): Ticket => DB::transaction(function () use ($ticket, $counter): Ticket {
                $counter = Counter::query()
                    ->with('service')
                    ->findOrFail($counter->getKey());

                $updated = Ticket::query()
                    ->whereKey($ticket->id)
                    ->where('status', TicketStatus::Dipanggil->value)
                    ->where('counter_id', $counter->id)
                    ->where('service_id', $counter->service_id)
                    ->update([
                        'called_at' => now(),
                        'revision' => DB::raw('revision + 1'),
                        'origin_device_id' => $this->device->id(),
                        'updated_at' => now(),
                    ]);

                if ($updated === 0) {
                    $this->failCalledTicketWrite($ticket, $counter);
                }

                $ticket->refresh();
                $ticket->load(['service', 'counter']);

                $this->recorder->record($ticket, TicketEventType::Recalled, [
                    'counter_uuid' => $counter->uuid,
                    'counter_name' => $counter->name,
                ]);

                return $ticket;
            }),
        );
    }

    /**
     * Kembalikan tiket yang dilewati ke antrean menunggu.
     *
     * Nomor tiket dipertahankan, jadi warga yang datang terlambat tidak
     * kehilangan urutannya. Hanya loket yang melewati tiket boleh
     * mengembalikannya, dan hanya untuk tanggal layanan hari ini: antrean
     * `callNext` memfilter tanggal, sehingga tiket hari lain akan menunggu
     * selamanya tanpa pernah dipanggil.
     */
    public function restore(Ticket $ticket, Counter $counter): Ticket
    {
        return $this->withRetry(
            fn (QueryException $e): bool => $this->shouldRetryLockException($e),
            'Gagal mengembalikan tiket ke antrean.',
            fn (): Ticket => DB::transaction(function () use ($ticket, $counter): Ticket {
                $counter = Counter::query()
                    ->with('service')
                    ->findOrFail($counter->getKey());

                $today = Carbon::today()->toDateString();

                $updated = Ticket::query()
                    ->whereKey($ticket->id)
                    ->where('status', TicketStatus::Dilewati->value)
                    ->where('counter_id', $counter->id)
                    ->where('service_id', $counter->service_id)
                    ->where('service_date', $today)
                    ->update([
                        'status' => TicketStatus::Menunggu->value,
                        'counter_id' => null,
                        'called_at' => null,
                        'finished_at' => null,
                        'revision' => DB::raw('revision + 1'),
                        'origin_device_id' => $this->device->id(),
                        'updated_at' => now(),
                    ]);

                if ($updated === 0) {
                    $ticket->refresh();

                    if ($ticket->service_date->format('Y-m-d') !== $today) {
                        throw QueueConflictException::notFromToday(
                            $ticket->label,
                            $ticket->service_date->format('d/m/Y'),
                        );
                    }

                    if (
                        (int) $ticket->counter_id !== $counter->id
                        || (int) $ticket->service_id !== $counter->service_id
                    ) {
                        throw QueueConflictException::notOwnedByCounter($ticket->label, $counter->name);
                    }

                    throw QueueConflictException::notSkipped($ticket->label);
                }

                $ticket->refresh();
                $ticket->load('service');

                $this->recorder->record($ticket, TicketEventType::Restored, [
                    'counter_uuid' => null,
                    'counter_name' => $counter->name,
                ]);

                return $ticket;
            }),
        );
    }

    public function waitingCount(Service $service, ?\DateTimeInterface $date = null): int
    {
        $serviceDate = ($date !== null ? Carbon::parse($date) : now())->toDateString();

        return Ticket::query()
            ->where('service_id', $service->id)
            ->where('service_date', $serviceDate)
            ->where('status', TicketStatus::Menunggu->value)
            ->count();
    }

    public function estimatedWaitMinutes(Service $service, ?\DateTimeInterface $date = null): int
    {
        return $this->waitingCount($service, $date) * (int) $service->estimated_minutes;
    }

    private function transition(Ticket $ticket, Counter $counter, TicketStatus $status, TicketEventType $eventType): Ticket
    {
        return $this->withRetry(
            fn (QueryException $e): bool => $this->shouldRetryLockException($e),
            'Gagal memperbarui tiket.',
            fn (): Ticket => DB::transaction(function () use ($ticket, $counter, $status, $eventType): Ticket {
                $counter = Counter::query()
                    ->with('service')
                    ->findOrFail($counter->getKey());

                $updated = Ticket::query()
                    ->whereKey($ticket->id)
                    ->where('status', TicketStatus::Dipanggil->value)
                    ->where('counter_id', $counter->id)
                    ->where('service_id', $counter->service_id)
                    ->update([
                        'status' => $status->value,
                        'finished_at' => now(),
                        'revision' => DB::raw('revision + 1'),
                        'origin_device_id' => $this->device->id(),
                        'updated_at' => now(),
                    ]);

                if ($updated === 0) {
                    $this->failCalledTicketWrite($ticket, $counter);
                }

                $ticket->refresh();
                $ticket->load(['service', 'counter']);

                $this->recorder->record($ticket, $eventType, [
                    'counter_uuid' => $counter->uuid,
                    'counter_name' => $counter->name,
                ]);

                return $ticket;
            }),
        );
    }

    /**
     * Jelaskan kenapa sebuah write bersyarat pada tiket `dipanggil` gagal.
     *
     * Dipanggil hanya setelah `update()` mengembalikan 0 baris: state dibaca
     * ulang untuk memilih pesan yang benar bagi operator.
     *
     * @throws QueueConflictException selalu
     */
    private function failCalledTicketWrite(Ticket $ticket, Counter $counter): never
    {
        $ticket->refresh();

        if ($ticket->status->isTerminal()) {
            throw QueueConflictException::alreadyHandled($ticket->label);
        }

        if (
            (int) $ticket->counter_id !== $counter->id
            || (int) $ticket->service_id !== $counter->service_id
        ) {
            throw QueueConflictException::notOwnedByCounter($ticket->label, $counter->name);
        }

        throw QueueConflictException::notCalled($ticket->label);
    }

    /**
     * Jalankan satu mutasi antrean dengan retry khusus kontensi SQLite.
     *
     * @param  callable(QueryException): bool  $shouldRetry
     * @param  callable(): Ticket  $callback
     */
    private function withRetry(callable $shouldRetry, string $failureMessage, callable $callback): Ticket
    {
        for ($attempt = 1; $attempt <= self::CONCURRENCY_ATTEMPTS; $attempt++) {
            try {
                return $callback();
            } catch (QueryException $e) {
                if (! $shouldRetry($e) || $attempt === self::CONCURRENCY_ATTEMPTS) {
                    throw $e;
                }

                usleep(self::CONCURRENCY_BACKOFF_MICROSECONDS * $attempt);
            }
        }

        throw new \RuntimeException($failureMessage);
    }

    private function shouldRetryIssueTransaction(QueryException $exception): bool
    {
        if ($exception instanceof UniqueConstraintViolationException) {
            return true;
        }

        return $this->shouldRetryLockException($exception);
    }

    private function shouldRetryLockException(QueryException $exception): bool
    {
        $message = strtolower($exception->getMessage());

        return str_contains($message, 'database is locked')
            || str_contains($message, 'database table is locked')
            || str_contains($message, 'database schema is locked')
            || str_contains($message, 'database is busy');
    }
}
