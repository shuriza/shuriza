<?php

namespace Tests\Feature;

use App\Enums\TicketStatus;
use App\Exceptions\QueueConflictException;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use App\Services\QueueService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;
use Tests\TestCase;

class QueueInvariantsTest extends TestCase
{
    private string $databasePath;

    /**
     * @var array<int, string>
     */
    private array $barrierDirectories = [];

    protected function setUp(): void
    {
        parent::setUp();

        $databasePath = tempnam(sys_get_temp_dir(), 'queue-invariants-');

        if ($databasePath === false) {
            $this->fail('Unable to create isolated SQLite database.');
        }

        $this->databasePath = $databasePath;

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => $this->databasePath,
            'antrian.device_id' => 'queue-invariants-parent',
            'antrian.device_name' => 'Queue Invariants Parent',
        ]);

        DB::purge('sqlite');
        Artisan::call('migrate:fresh', [
            '--force' => true,
        ]);
    }

    protected function tearDown(): void
    {
        DB::disconnect('sqlite');
        DB::purge('sqlite');

        foreach ($this->barrierDirectories as $directory) {
            foreach (glob($directory.DIRECTORY_SEPARATOR.'*') ?: [] as $file) {
                @unlink($file);
            }

            @rmdir($directory);
        }

        if (is_file($this->databasePath)) {
            @unlink($this->databasePath);
        }

        parent::tearDown();
    }

    public function test_issue_numbers_are_based_on_the_calendar_day_only(): void
    {
        $service = Service::factory()->code('A')->create();

        $this->createWaitingTicket($service, 1, '2026-09-08');

        $ticket = $this->queue()->issue(
            $service,
            CarbonImmutable::parse('2026-09-08 23:59:59'),
        );

        $this->assertSame(2, $ticket->number);
        $this->assertSame('2026-09-08', $ticket->service_date->toDateString());
        $this->assertSame('A002', $ticket->label);
    }

    public function test_call_next_reloads_counter_state_before_issuing(): void
    {
        $queue = $this->queue();
        $service = Service::factory()->code('B')->create();
        $counter = Counter::factory()->for($service)->create([
            'is_open' => true,
        ]);

        $this->createWaitingTicket($service, 1);
        Counter::query()->whereKey($counter->id)->update([
            'is_open' => false,
        ]);

        $this->assertTrue($counter->is_open);

        $this->assertQueueConflict(
            fn (): Ticket => $queue->callNext($counter),
            'sedang tutup',
        );

        $this->assertSame(
            0,
            Ticket::query()
                ->where('counter_id', $counter->id)
                ->where('status', TicketStatus::Dipanggil->value)
                ->count(),
        );
    }

    public function test_concurrent_issue_requests_preserve_unique_daily_numbering(): void
    {
        $service = Service::factory()->code('C')->create();
        $barrierDirectory = $this->createBarrierDirectory();

        $results = $this->runConcurrentWorkers(
            action: 'issue',
            arguments: [$service->uuid, '2026-09-08'],
            barrierDirectory: $barrierDirectory,
        );

        $this->assertCount(2, $results);
        $this->assertTrue($results[0]['ok'], json_encode($results[0], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        $this->assertTrue($results[1]['ok'], json_encode($results[1], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        $numbers = array_map(static fn (array $result): int => $result['number'], $results);
        sort($numbers);

        $this->assertSame([1, 2], $numbers);
        $this->assertSame(
            [1, 2],
            Ticket::query()
                ->where('service_id', $service->id)
                ->where('service_date', '2026-09-08')
                ->orderBy('number')
                ->pluck('number')
                ->all(),
        );
    }

    public function test_concurrent_call_requests_never_leave_two_open_tickets_on_one_counter(): void
    {
        $service = Service::factory()->code('D')->create();
        $counter = Counter::factory()->for($service)->create([
            'is_open' => true,
        ]);
        $barrierDirectory = $this->createBarrierDirectory();

        $this->createWaitingTicket($service, 1);
        $this->createWaitingTicket($service, 2);
        $this->createWaitingTicket($service, 3);

        $results = $this->runConcurrentWorkers(
            action: 'call',
            arguments: [$counter->uuid],
            barrierDirectory: $barrierDirectory,
        );

        $this->assertCount(2, $results);
        $this->assertNotSame($results[0]['ok'], $results[1]['ok'], json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        $success = $results[0]['ok'] ? $results[0] : $results[1];
        $failure = $results[0]['ok'] ? $results[1] : $results[0];

        $this->assertSame('D001', $success['label']);
        $this->assertFalse($failure['ok']);
        $this->assertStringContainsString('masih memegang tiket', $failure['error']);
        $this->assertSame(
            1,
            Ticket::query()
                ->where('counter_id', $counter->id)
                ->where('status', TicketStatus::Dipanggil->value)
                ->count(),
        );
    }

    public function test_finish_and_skip_require_matching_counter_and_service(): void
    {
        $queue = $this->queue();

        $service = Service::factory()->code('A')->create();
        $otherCounter = Counter::factory()->for($service)->create([
            'is_open' => true,
        ]);
        $counter = Counter::factory()->for($service)->create([
            'is_open' => true,
        ]);

        $this->createWaitingTicket($service, 1);
        $calledTicket = $queue->callNext($counter);

        $this->assertQueueConflict(
            fn () => $queue->finish($calledTicket, $otherCounter),
            'bukan milik loket',
        );

        $otherService = Service::factory()->code('B')->create();
        $reassignedCounter = Counter::factory()->for($service)->create([
            'is_open' => true,
        ]);

        $this->createWaitingTicket($service, 2);
        $skippedTicket = $queue->callNext($reassignedCounter);

        Counter::query()->whereKey($reassignedCounter->id)->update([
            'service_id' => $otherService->id,
        ]);

        $reassignedCounter->refresh()->load('service');

        $this->assertQueueConflict(
            fn () => $queue->skip($skippedTicket, $reassignedCounter),
            'bukan milik loket',
        );
    }

    /**
     * @return array<int, array{ok: bool, label?: string, number?: int, error?: string, error_class?: string}>
     */
    private function runConcurrentWorkers(string $action, array $arguments, string $barrierDirectory): array
    {
        $processes = [];

        for ($index = 0; $index < 2; $index++) {
            $process = new Process(
                [PHP_BINARY, base_path('tests/Fixtures/QueueWorker.php'), $action, ...$arguments],
                base_path(),
                [
                    'APP_ENV' => 'testing',
                    'DB_CONNECTION' => 'sqlite',
                    'DB_DATABASE' => $this->databasePath,
                    'ANTRIAN_DEVICE_ID' => 'queue-invariants-worker-'.$action.'-'.$index,
                    'ANTRIAN_DEVICE_NAME' => 'Queue Invariants Worker '.$index,
                    'QUEUE_BARRIER_DIR' => $barrierDirectory,
                    'QUEUE_BARRIER_EXPECTED' => '2',
                    'QUEUE_BARRIER_INDEX' => (string) $index,
                ],
            );
            $process->setTimeout(30);
            $process->start();
            $processes[] = $process;
        }

        foreach ($processes as $process) {
            $process->wait();
        }

        return array_map(
            fn (Process $process): array => $this->decodeWorkerResult($process),
            $processes,
        );
    }

    /**
     * @return array{ok: bool, label?: string, number?: int, error?: string, error_class?: string}
     */
    private function decodeWorkerResult(Process $process): array
    {
        if (! $process->isSuccessful()) {
            $this->fail($process->getErrorOutput()."\n".$process->getOutput());
        }

        $output = trim($process->getOutput());
        $this->assertNotSame('', $output, 'Queue worker produced no JSON output.');

        /** @var array{ok: bool, label?: string, number?: int, error?: string, error_class?: string} $decoded */
        $decoded = json_decode($output, true, 512, JSON_THROW_ON_ERROR);

        return $decoded;
    }

    private function createBarrierDirectory(): string
    {
        $directory = sys_get_temp_dir().DIRECTORY_SEPARATOR.'queue-invariants-'.bin2hex(random_bytes(8));
        $created = mkdir($directory, 0777, true);

        if (! $created) {
            $this->fail('Unable to create a barrier directory for concurrent queue workers.');
        }

        $this->barrierDirectories[] = $directory;

        return $directory;
    }

    private function queue(): QueueService
    {
        return $this->app->make(QueueService::class);
    }

    private function createWaitingTicket(Service $service, int $number, ?string $serviceDate = null): Ticket
    {
        $serviceDate ??= now()->toDateString();

        return Ticket::query()->create([
            'service_id' => $service->id,
            'counter_id' => null,
            'service_date' => $serviceDate,
            'number' => $number,
            'label' => $service->code.str_pad((string) $number, 3, '0', STR_PAD_LEFT),
            'status' => TicketStatus::Menunggu,
            'issued_at' => now(),
            'called_at' => null,
            'finished_at' => null,
            'revision' => 1,
            'origin_device_id' => 'queue-invariants-seed',
        ]);
    }

    /**
     * @param  callable(): mixed  $callback
     */
    private function assertQueueConflict(callable $callback, string $messageFragment): void
    {
        try {
            $callback();
            $this->fail('Expected QueueConflictException was not thrown.');
        } catch (QueueConflictException $exception) {
            $this->assertStringContainsString($messageFragment, $exception->getMessage());
        }
    }
}
