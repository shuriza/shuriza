<?php

namespace App\Services;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Models\Counter;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Models\SyncState;
use App\Models\Ticket;
use App\Models\TicketEvent;
use App\Support\DeviceIdentity;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

readonly class SyncReport
{
    public function __construct(
        public bool $configured,
        public int $sent,
        public int $failed,
        public ?string $error,
        public int $pendingAfter,
    ) {}
}

class SyncService
{
    public function __construct(
        private readonly DeviceIdentity $device,
        private readonly ConflictResolver $resolver,
        private readonly TicketEventRecorder $recorder,
    ) {}

    public function isConfigured(): bool
    {
        return filled(config('antrian.sync.endpoint'));
    }

    public function pendingCount(): int
    {
        return OutboxEntry::pending()->count();
    }

    public function push(): SyncReport
    {
        if (! $this->isConfigured()) {
            return new SyncReport(false, 0, 0, null, $this->pendingCount());
        }

        $pending = OutboxEntry::pending()
            ->orderBy('id')
            ->limit((int) config('antrian.sync.batch_size', 200))
            ->get();

        if ($pending->isEmpty()) {
            return new SyncReport(true, 0, 0, null, 0);
        }

        try {
            $response = $this->request()->post($this->eventsEndpoint(), [
                'device_id' => $this->device->id(),
                'events' => $pending->map(fn (OutboxEntry $entry): array => $entry->payload)->all(),
            ]);
            $response->throw();

            $acked = $this->parseAckedEventUuids($response->json());
            $pendingEventUuids = array_fill_keys($pending->pluck('event_uuid')->all(), true);
            $unknownAcks = array_values(array_diff($acked, array_keys($pendingEventUuids)));
            if ($unknownAcks !== []) {
                throw new \UnexpectedValueException('respons push pusat mengakui event yang tidak ada pada batch ini');
            }

            $ackedSet = array_fill_keys($acked, true);
            $now = now();

            $this->writeTransaction(function () use ($pending, $ackedSet, $now): void {
                foreach ($pending as $entry) {
                    $eventUuid = $entry->event_uuid;
                    $isAcked = isset($ackedSet[$eventUuid]);

                    $entry->forceFill([
                        'attempts' => $entry->attempts + 1,
                        'last_attempt_at' => $now,
                        'last_error' => $isAcked ? null : 'menunggu ack server',
                    ]);

                    if ($isAcked) {
                        $entry->synced_at = $now;
                    }

                    $entry->save();
                }

                SyncState::query()->updateOrCreate(
                    ['key' => 'last_push_at'],
                    ['value' => $now->toIso8601String()],
                );
            });

            return new SyncReport(true, count($acked), $pending->count() - count($acked), null, $this->pendingCount());
        } catch (\Throwable $e) {
            $error = Str::limit($e->getMessage(), 500, '');
            $now = now();

            $this->writeTransaction(function () use ($pending, $error, $now): void {
                foreach ($pending as $entry) {
                    $entry->forceFill([
                        'attempts' => $entry->attempts + 1,
                        'last_attempt_at' => $now,
                        'last_error' => $error,
                    ])->save();
                }
            });

            return new SyncReport(true, 0, $pending->count(), $error, $this->pendingCount());
        }
    }

    public function pull(): SyncReport
    {
        if (! $this->isConfigured()) {
            return new SyncReport(false, 0, 0, null, $this->pendingCount());
        }

        try {
            $cursor = SyncState::query()->find('last_pull_cursor')?->value;
            $response = $this->request()->get($this->eventsEndpoint(), [
                'since' => $cursor,
            ]);
            $response->throw();

            $body = $response->json();
            if (! is_array($body)) {
                throw new \UnexpectedValueException('respons sinkronisasi pusat harus berupa JSON object');
            }

            $events = $this->requireList($body['events'] ?? null, 'events');
            $cursorValue = $this->requireString($body['cursor'] ?? null, 'cursor');
            $applied = 0;

            $this->writeTransaction(function () use ($events, $cursorValue, &$applied): void {
                foreach ($events as $remoteRaw) {
                    $remote = $this->normalizeRemoteEvent($remoteRaw);
                    $eventUuid = $remote['event_uuid'];

                    if (TicketEvent::query()->where('uuid', $eventUuid)->exists()) {
                        continue;
                    }

                    $ticket = Ticket::query()->where('uuid', $remote['ticket_uuid'])->first();
                    $outcome = $this->resolver->resolve($ticket, $remote['raw']);

                    if (! $outcome->shouldApplyRemote) {
                        continue;
                    }

                    $service = Service::query()->where('code', $remote['service_code'])->first();
                    if ($service === null) {
                        throw new \UnexpectedValueException(sprintf('layanan pusat "%s" tidak ditemukan pada perangkat ini', $remote['service_code']));
                    }

                    $counterId = null;
                    if ($remote['counter_uuid'] !== null) {
                        $counterId = Counter::query()->where('uuid', $remote['counter_uuid'])->value('id');
                    }

                    $ticket ??= new Ticket;

                    // Panggilan ulang memindahkan waktu panggil ke event ini;
                    // panggilan pertama mempertahankan waktu yang sudah ada.
                    $calledAt = match (true) {
                        $remote['status'] === TicketStatus::Menunggu => null,
                        $remote['event_type'] === TicketEventType::Recalled => $remote['occurred_at'],
                        default => $ticket->called_at ?? $remote['occurred_at'],
                    };

                    $ticket->forceFill([
                        'uuid' => $remote['ticket_uuid'],
                        'service_id' => $service->id,
                        'counter_id' => $remote['status'] === TicketStatus::Menunggu ? null : $counterId,
                        'service_date' => $remote['service_date'],
                        'number' => $remote['number'],
                        'label' => $remote['label'],
                        'status' => $remote['status'],
                        'revision' => $remote['revision'],
                        'origin_device_id' => $remote['origin_device_id'],
                        'issued_at' => $ticket->issued_at ?? $remote['occurred_at'],
                        'called_at' => $calledAt,
                        'finished_at' => $remote['status']->isTerminal() ? $remote['occurred_at'] : null,
                    ]);

                    try {
                        $ticket->save();
                    } catch (UniqueConstraintViolationException $e) {
                        throw new \UnexpectedValueException(sprintf(
                            'nomor tiket %d untuk layanan %s pada %s bentrok; batch dan cursor tidak dipindahkan',
                            $remote['number'],
                            $remote['service_code'],
                            $remote['service_date'],
                        ), 0, $e);
                    }

                    $this->recorder->recordImported(
                        $ticket,
                        $remote['event_type'],
                        $remote['raw'],
                        $remote['event_uuid'],
                        $remote['occurred_at'],
                    );

                    $applied++;
                }

                SyncState::query()->updateOrCreate(
                    ['key' => 'last_pull_cursor'],
                    ['value' => $cursorValue],
                );
            });

            return new SyncReport(true, $applied, 0, null, $this->pendingCount());
        } catch (\Throwable $e) {
            return new SyncReport(true, 0, 0, Str::limit($e->getMessage(), 500, ''), $this->pendingCount());
        }
    }

    private function request()
    {
        $request = Http::timeout((int) config('antrian.sync.timeout', 5))
            ->withHeaders([
                'X-Device-Id' => $this->device->id(),
                'X-Device-Name' => $this->device->name(),
            ]);

        $token = config('antrian.sync.token');
        if (is_string($token) && $token !== '') {
            $request = $request->withToken($token);
        }

        return $request;
    }

    private function eventsEndpoint(): string
    {
        return rtrim((string) config('antrian.sync.endpoint'), '/').'/events';
    }

    /**
     * @return array<int, string>
     */
    private function parseAckedEventUuids(mixed $body): array
    {
        if (! is_array($body)) {
            throw new \UnexpectedValueException('respons push pusat harus berupa JSON object');
        }

        $acked = $body['acked'] ?? null;
        if (! is_array($acked)) {
            throw new \UnexpectedValueException('respons push pusat harus menyertakan daftar acked[] yang eksplisit');
        }

        $uuids = [];
        foreach ($acked as $eventUuid) {
            if (! is_string($eventUuid) || trim($eventUuid) === '') {
                throw new \UnexpectedValueException('daftar acked[] harus berisi uuid event yang valid');
            }

            $uuids[] = trim($eventUuid);
        }

        return array_values(array_unique($uuids));
    }

    /**
     * @return array<int, mixed>
     */
    private function requireList(mixed $value, string $field): array
    {
        if (! is_array($value)) {
            throw new \UnexpectedValueException(sprintf('field %s harus berupa array', $field));
        }

        if (! array_is_list($value)) {
            throw new \UnexpectedValueException(sprintf('field %s harus berupa daftar berurutan', $field));
        }

        return $value;
    }

    private function requireString(mixed $value, string $field): string
    {
        if (! is_string($value)) {
            throw new \UnexpectedValueException(sprintf('field %s harus berupa string', $field));
        }

        $value = trim($value);
        if ($value === '') {
            throw new \UnexpectedValueException(sprintf('field %s tidak boleh kosong', $field));
        }

        return $value;
    }

    /**
     * @return array{
     *     raw: array<string, mixed>,
     *     event_uuid: string,
     *     event_type: TicketEventType,
     *     ticket_uuid: string,
     *     status: TicketStatus,
     *     revision: int,
     *     origin_device_id: string,
     *     counter_uuid: ?string,
     *     service_code: string,
     *     service_date: string,
     *     number: int,
     *     label: string,
     *     occurred_at: Carbon,
     * }
     */
    private function normalizeRemoteEvent(mixed $remote): array
    {
        if (! is_array($remote)) {
            throw new \UnexpectedValueException('setiap event pusat harus berupa object JSON');
        }

        $eventUuid = $this->requireString($remote['event_uuid'] ?? null, 'event_uuid');
        $eventType = TicketEventType::tryFrom($this->requireString($remote['event_type'] ?? null, 'event_type'));
        if ($eventType === null) {
            throw new \UnexpectedValueException('event_type pusat tidak dikenal');
        }

        $ticketUuid = $this->requireString($remote['ticket_uuid'] ?? null, 'ticket_uuid');
        $status = TicketStatus::tryFrom($this->requireString($remote['status'] ?? null, 'status'));
        if ($status === null) {
            throw new \UnexpectedValueException('status pusat tidak dikenal');
        }

        $revision = $this->requirePositiveInt($remote['revision'] ?? null, 'revision');
        $originDeviceId = $this->requireString($remote['origin_device_id'] ?? null, 'origin_device_id');
        $serviceCode = $this->requireString($remote['service_code'] ?? null, 'service_code');
        $serviceDate = Carbon::parse($this->requireString($remote['service_date'] ?? null, 'service_date'))->toDateString();
        $number = $this->requirePositiveInt($remote['number'] ?? null, 'number');
        $label = $this->requireString($remote['label'] ?? null, 'label');
        $occurredAt = Carbon::parse($this->requireString($remote['occurred_at'] ?? null, 'occurred_at'));

        if (! $eventType->matchesStatus($status)) {
            throw new \UnexpectedValueException('event_type tidak cocok dengan status pusat');
        }

        $counterUuid = null;
        if (array_key_exists('counter_uuid', $remote) && $remote['counter_uuid'] !== null) {
            $counterUuid = $this->requireString($remote['counter_uuid'], 'counter_uuid');
        }

        return [
            'raw' => $remote,
            'event_uuid' => $eventUuid,
            'event_type' => $eventType,
            'ticket_uuid' => $ticketUuid,
            'status' => $status,
            'revision' => $revision,
            'origin_device_id' => $originDeviceId,
            'counter_uuid' => $counterUuid,
            'service_code' => $serviceCode,
            'service_date' => $serviceDate,
            'number' => $number,
            'label' => $label,
            'occurred_at' => $occurredAt,
        ];
    }

    private function requirePositiveInt(mixed $value, string $field): int
    {
        if (is_int($value)) {
            if ($value >= 1) {
                return $value;
            }
        } elseif (is_string($value) && preg_match('/^\d+$/', $value) === 1) {
            $normalized = ltrim($value, '0') ?: '0';
            $maximum = (string) PHP_INT_MAX;

            if (
                $normalized !== '0'
                && (
                    strlen($normalized) < strlen($maximum)
                    || (strlen($normalized) === strlen($maximum) && strcmp($normalized, $maximum) <= 0)
                )
            ) {
                return (int) $normalized;
            }
        }

        throw new \UnexpectedValueException(sprintf('field %s harus berupa bilangan bulat positif', $field));
    }

    /**
     * @template T
     *
     * @param  callable(): T  $callback
     * @return T
     */
    private function writeTransaction(callable $callback): mixed
    {
        $connection = DB::connection();
        $driver = $connection->getDriverName();
        $pdo = $connection->getPdo();
        $hasAmbientTransaction = $connection->transactionLevel() > 0;

        if ($driver === 'sqlite' && ! $hasAmbientTransaction) {
            $pdo->exec('BEGIN IMMEDIATE');

            try {
                $result = $callback();
                $pdo->exec('COMMIT');

                return $result;
            } catch (\Throwable $e) {
                $pdo->exec('ROLLBACK');

                throw $e;
            }
        }

        $connection->beginTransaction();

        try {
            $result = $callback();
            $connection->commit();

            return $result;
        } catch (\Throwable $e) {
            $connection->rollBack();

            throw $e;
        }
    }
}
