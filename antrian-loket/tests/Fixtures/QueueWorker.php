<?php

use App\Models\Counter;
use App\Models\Service;
use App\Services\QueueService;
use App\Support\DeviceIdentity;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Carbon;

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

try {
    $barrierDirectory = getenv('QUEUE_BARRIER_DIR') ?: '';
    $expectedWorkers = (int) (getenv('QUEUE_BARRIER_EXPECTED') ?: 0);
    $workerIndex = getenv('QUEUE_BARRIER_INDEX');

    if ($workerIndex === false) {
        $workerIndex = '';
    }

    if ($barrierDirectory !== '' && $expectedWorkers > 0 && $workerIndex !== '') {
        $marker = $barrierDirectory.DIRECTORY_SEPARATOR.'ready-'.$workerIndex;
        file_put_contents($marker, (string) getmypid());

        $deadline = microtime(true) + 10;
        $readyWorkers = [];

        do {
            $entries = scandir($barrierDirectory) ?: [];
            $readyWorkers = array_values(array_filter(
                $entries,
                static fn (string $entry): bool => str_starts_with($entry, 'ready-'),
            ));

            if (count($readyWorkers) >= $expectedWorkers) {
                break;
            }

            usleep(20000);
        } while (microtime(true) < $deadline);

        if (count($readyWorkers) < $expectedWorkers) {
            throw new RuntimeException(sprintf(
                'Barrier timeout (%d/%d): %s',
                count($readyWorkers),
                $expectedWorkers,
                implode(',', $readyWorkers),
            ));
        }
    }

    $action = $argv[1] ?? '';

    if ($action === 'identity') {
        config(['antrian.device_id' => null]);

        echo json_encode([
            'ok' => true,
            'device_id' => $app->make(DeviceIdentity::class)->id(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return;
    }

    $queue = $app->make(QueueService::class);

    if ($action === 'issue') {
        $serviceUuid = $argv[2] ?? '';
        $date = $argv[3] ?? null;

        $service = Service::query()->where('uuid', $serviceUuid)->firstOrFail();
        $ticket = $queue->issue($service, $date !== null && $date !== '' ? Carbon::parse($date) : null);

        echo json_encode([
            'ok' => true,
            'label' => $ticket->label,
            'number' => $ticket->number,
            'service_date' => $ticket->service_date->toDateString(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return;
    }

    if ($action === 'call') {
        $counterUuid = $argv[2] ?? '';

        $counter = Counter::query()->with('service')->where('uuid', $counterUuid)->firstOrFail();
        $ticket = $queue->callNext($counter);

        echo json_encode([
            'ok' => true,
            'label' => $ticket->label,
            'ticket_uuid' => $ticket->uuid,
            'counter_uuid' => $ticket->counter?->uuid,
            'counter_name' => $ticket->counter?->name,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return;
    }

    throw new InvalidArgumentException('Unknown queue worker action: '.$action);
} catch (Throwable $exception) {
    echo json_encode([
        'ok' => false,
        'error_class' => $exception::class,
        'error' => $exception->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
