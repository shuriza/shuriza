<?php

namespace Tests\Unit;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\ConflictResolver;
use Illuminate\Support\Str;
use Tests\TestCase;

class ConflictResolverTest extends TestCase
{
    public function test_invalid_remote_payload_is_rejected_before_local_null_shortcut(): void
    {
        $resolver = new ConflictResolver;

        $outcome = $resolver->resolve(null, $this->remotePayload([
            'status' => 'rusak',
        ]));

        $this->assertFalse($outcome->shouldApplyRemote);
        $this->assertSame('local', $outcome->winner);
    }

    public function test_remote_payload_rejects_positive_integer_strings_beyond_php_int_max(): void
    {
        $resolver = new ConflictResolver;

        $invalidRevision = $resolver->resolve(null, $this->remotePayload([
            'revision' => PHP_INT_MAX.'0',
        ]));
        $invalidNumber = $resolver->resolve(null, $this->remotePayload([
            'number' => PHP_INT_MAX.'0',
        ]));

        $this->assertFalse($invalidRevision->shouldApplyRemote);
        $this->assertSame('local', $invalidRevision->winner);
        $this->assertFalse($invalidNumber->shouldApplyRemote);
        $this->assertSame('local', $invalidNumber->winner);
    }

    public function test_remote_payload_accepts_php_int_max_integer_strings_for_revision_and_number(): void
    {
        $resolver = new ConflictResolver;

        $outcome = $resolver->resolve(null, $this->remotePayload([
            'number' => (string) PHP_INT_MAX,
            'revision' => (string) PHP_INT_MAX,
        ]));

        $this->assertTrue($outcome->shouldApplyRemote);
        $this->assertSame('remote', $outcome->winner);
    }

    public function test_numeric_device_ids_are_compared_as_numbers(): void
    {
        $resolver = new ConflictResolver;
        $local = $this->ticket([
            'status' => TicketStatus::Menunggu,
            'revision' => 5,
            'origin_device_id' => '10',
        ]);

        $outcome = $resolver->resolve($local, $this->remotePayload([
            'status' => TicketStatus::Menunggu->value,
            'revision' => 5,
            'origin_device_id' => '2',
        ]));

        $this->assertTrue($outcome->shouldApplyRemote);
        $this->assertSame('remote', $outcome->winner);
    }

    public function test_numeric_device_ids_larger_than_php_int_still_converge(): void
    {
        $resolver = new ConflictResolver;
        $smallerDeviceId = '9223372036854775808';
        $largerDeviceId = '9223372036854775809';

        $forward = $resolver->resolve(
            $this->ticket([
                'status' => TicketStatus::Menunggu,
                'revision' => 5,
                'origin_device_id' => $largerDeviceId,
            ]),
            $this->remotePayload([
                'status' => TicketStatus::Menunggu->value,
                'revision' => 5,
                'origin_device_id' => $smallerDeviceId,
            ]),
        );
        $reverse = $resolver->resolve(
            $this->ticket([
                'status' => TicketStatus::Menunggu,
                'revision' => 5,
                'origin_device_id' => $smallerDeviceId,
            ]),
            $this->remotePayload([
                'status' => TicketStatus::Menunggu->value,
                'revision' => 5,
                'origin_device_id' => $largerDeviceId,
            ]),
        );

        $this->assertTrue($forward->shouldApplyRemote);
        $this->assertSame('remote', $forward->winner);
        $this->assertFalse($reverse->shouldApplyRemote);
        $this->assertSame('local', $reverse->winner);
    }

    public function test_same_origin_terminal_tie_converges_on_the_same_state(): void
    {
        $resolver = new ConflictResolver;
        $local = $this->ticket([
            'status' => TicketStatus::Selesai,
            'revision' => 7,
            'origin_device_id' => '7',
        ]);
        $remote = $this->remotePayload([
            'status' => TicketStatus::Dilewati->value,
            'event_type' => TicketEventType::Skipped->value,
            'revision' => 7,
            'origin_device_id' => '7',
        ]);

        $forward = $resolver->resolve($local, $remote);
        $reverse = $resolver->resolve(
            $this->ticket([
                'status' => TicketStatus::Dilewati,
                'revision' => 7,
                'origin_device_id' => '7',
            ]),
            $this->remotePayload([
                'status' => TicketStatus::Selesai->value,
                'event_type' => TicketEventType::Finished->value,
                'revision' => 7,
                'origin_device_id' => '7',
            ]),
        );

        $this->assertSame(TicketStatus::Selesai->value, $forward->shouldApplyRemote ? $remote['status'] : $local->status->value);
        $this->assertSame(TicketStatus::Selesai->value, $reverse->shouldApplyRemote ? TicketStatus::Selesai->value : TicketStatus::Dilewati->value);
    }

    public function test_stale_remote_revision_loses_even_when_remote_is_terminal(): void
    {
        $resolver = new ConflictResolver;
        $local = $this->ticket([
            'status' => TicketStatus::Dipanggil,
            'revision' => 9,
            'origin_device_id' => '11',
        ]);

        $outcome = $resolver->resolve($local, $this->remotePayload([
            'status' => TicketStatus::Selesai->value,
            'event_type' => TicketEventType::Finished->value,
            'revision' => 8,
            'origin_device_id' => '2',
        ]));

        $this->assertFalse($outcome->shouldApplyRemote);
        $this->assertSame('local', $outcome->winner);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function remotePayload(array $overrides = []): array
    {
        return array_merge([
            'event_uuid' => (string) Str::uuid(),
            'event_type' => TicketEventType::Issued->value,
            'ticket_uuid' => (string) Str::uuid(),
            'service_code' => 'A',
            'service_date' => now()->toDateString(),
            'number' => 1,
            'label' => 'A001',
            'status' => TicketStatus::Menunggu->value,
            'revision' => 1,
            'origin_device_id' => '1',
            'occurred_at' => now()->toIso8601String(),
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function ticket(array $attributes): Ticket
    {
        $ticket = new Ticket;
        $ticket->forceFill(array_merge([
            'uuid' => (string) Str::uuid(),
            'service_id' => 1,
            'counter_id' => null,
            'service_date' => now()->toDateString(),
            'number' => 1,
            'label' => 'A001',
            'status' => TicketStatus::Menunggu,
            'issued_at' => now(),
            'called_at' => null,
            'finished_at' => null,
            'revision' => 1,
            'origin_device_id' => '1',
        ], $attributes));

        return $ticket;
    }
}
