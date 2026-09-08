<?php

namespace App\Services;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
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

        for ($attempt = 1; $attempt <= self::CONCURRENCY_ATTEMPTS; $attempt++) {
            try {
                return DB::transaction(function () use ($service, $serviceDate): Ticket {
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
                });
            } catch (QueryException $e) {
                if (! $this->shouldRetryIssueTransaction($e) || $attempt === self::CONCURRENCY_ATTEMPTS) {
                    throw $e;
                }

                usleep(self::CONCURRENCY_BACKOFF_MICROSECONDS * $attempt);
            }
        }

        throw new \RuntimeException('Gagal menerbitkan tiket.');
    }

    public function callNext(Counter $counter): Ticket
    {
        for ($attempt = 1; $attempt <= self::CONCURRENCY_ATTEMPTS; $attempt++) {
            try {
                return DB::transaction(function () use ($counter): Ticket {
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
                });
            } catch (QueryException $e) {
                if (! $this->shouldRetryLockException($e) || $attempt === self::CONCURRENCY_ATTEMPTS) {
                    throw $e;
                }

                usleep(self::CONCURRENCY_BACKOFF_MICROSECONDS * $attempt);
            }
        }

        throw new \RuntimeException('Gagal memanggil tiket berikutnya.');
    }

    public function finish(Ticket $ticket, Counter $counter): Ticket
    {
        return $this->transition($ticket, $counter, TicketStatus::Selesai, TicketEventType::Finished);
    }

    public function skip(Ticket $ticket, Counter $counter): Ticket
    {
        return $this->transition($ticket, $counter, TicketStatus::Dilewati, TicketEventType::Skipped);
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
        for ($attempt = 1; $attempt <= self::CONCURRENCY_ATTEMPTS; $attempt++) {
            try {
                return DB::transaction(function () use ($ticket, $counter, $status, $eventType): Ticket {
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

                    $ticket->refresh();
                    $ticket->load(['service', 'counter']);

                    $this->recorder->record($ticket, $eventType, [
                        'counter_uuid' => $counter->uuid,
                        'counter_name' => $counter->name,
                    ]);

                    return $ticket;
                });
            } catch (QueryException $e) {
                if (! $this->shouldRetryLockException($e) || $attempt === self::CONCURRENCY_ATTEMPTS) {
                    throw $e;
                }

                usleep(self::CONCURRENCY_BACKOFF_MICROSECONDS * $attempt);
            }
        }

        throw new \RuntimeException('Gagal memperbarui tiket.');
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
