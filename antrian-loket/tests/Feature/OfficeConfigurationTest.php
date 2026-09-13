<?php

namespace Tests\Feature;

use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class OfficeConfigurationTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_operator_can_open_the_configuration_page(): void
    {
        $this->withoutVite();
        $service = Service::factory()->code('A')->create();
        Counter::factory()->for($service)->create();

        $this->get(route('pengaturan.index'))
            ->assertOk()
            ->assertSee('Pengaturan Kantor')
            ->assertSee($service->name)
            ->assertSee('Simpan loket');
    }

    public function test_operator_can_create_and_update_service_configuration(): void
    {
        $this->from(route('pengaturan.index'))
            ->post(route('pengaturan.layanan.simpan'), [
                'code' => ' e1 ',
                'name' => ' Pelayanan Ekstra ',
                'estimated_minutes' => 12,
                'is_active' => '1',
            ])
            ->assertRedirect(route('pengaturan.index'))
            ->assertSessionHas('status', 'Layanan Pelayanan Ekstra ditambahkan.');

        $service = Service::query()->where('code', 'E1')->sole();
        $this->assertSame('Pelayanan Ekstra', $service->name);
        $this->assertSame(12, $service->estimated_minutes);
        $this->assertTrue($service->is_active);

        $this->post(route('pengaturan.layanan.perbarui', $service), [
            'code' => 'E1',
            'name' => 'Pelayanan Ekstra Baru',
            'estimated_minutes' => 15,
            'is_active' => '1',
        ])->assertSessionHas('status', 'Layanan Pelayanan Ekstra Baru diperbarui.');

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'name' => 'Pelayanan Ekstra Baru',
            'estimated_minutes' => 15,
        ]);
    }

    public function test_service_input_rejects_duplicate_or_invalid_codes(): void
    {
        Service::factory()->code('A')->create();

        $this->post(route('pengaturan.layanan.simpan'), [
            'code' => 'a',
            'name' => 'Duplikat',
            'estimated_minutes' => 5,
            'is_active' => '1',
        ])->assertSessionHasErrors('code');

        $this->post(route('pengaturan.layanan.simpan'), [
            'code' => 'A-',
            'name' => 'Kode Rusak',
            'estimated_minutes' => 5,
            'is_active' => '1',
        ])->assertSessionHasErrors('code');
    }

    public function test_service_with_open_counter_or_open_queue_cannot_be_deactivated(): void
    {
        $service = Service::factory()->code('A')->create();
        $counter = Counter::factory()->for($service)->create(['is_open' => true]);

        $this->post(route('pengaturan.layanan.perbarui', $service), $this->servicePayload($service, false))
            ->assertSessionHas('error', "Tutup semua loket layanan {$service->name} sebelum menonaktifkannya.");

        $counter->update(['is_open' => false]);
        Ticket::factory()->for($service)->create();

        $this->post(route('pengaturan.layanan.perbarui', $service), $this->servicePayload($service, false))
            ->assertSessionHas('error', "Layanan {$service->name} masih memiliki tiket menunggu atau dipanggil.");

        $this->assertTrue($service->fresh()->is_active);
    }

    public function test_service_code_is_immutable_after_ticket_issuance(): void
    {
        $service = Service::factory()->code('A')->create();
        Ticket::factory()->for($service)->create();

        $payload = $this->servicePayload($service, true);
        $payload['code'] = 'B';

        $this->post(route('pengaturan.layanan.perbarui', $service), $payload)
            ->assertSessionHas('error', 'Kode layanan A tidak dapat diubah setelah tiket pernah diterbitkan karena kode adalah identitas sinkronisasi.');

        $this->assertSame('A', $service->fresh()->code);
    }

    public function test_open_counter_requires_an_active_service(): void
    {
        $service = Service::factory()->code('A')->inactive()->create();

        $this->post(route('pengaturan.loket.simpan'), [
            'name' => 'Loket Khusus',
            'service_id' => $service->id,
            'operator_name' => 'Siti',
            'is_open' => '1',
        ])->assertSessionHas('error', "Layanan {$service->name} sedang nonaktif.");

        $this->assertDatabaseMissing('counters', ['name' => 'Loket Khusus']);
    }

    public function test_operator_can_create_and_update_a_counter(): void
    {
        $service = Service::factory()->code('A')->create();
        $otherService = Service::factory()->code('B')->create();

        $this->post(route('pengaturan.loket.simpan'), [
            'name' => ' Loket Baru ',
            'service_id' => $service->id,
            'operator_name' => ' Siti ',
            'is_open' => '1',
        ])->assertSessionHas('status', 'Loket Baru ditambahkan.');

        $counter = Counter::query()->where('name', 'Loket Baru')->sole();
        $this->assertSame('Siti', $counter->operator_name);
        $this->assertTrue($counter->is_open);

        $this->post(route('pengaturan.loket.perbarui', $counter), [
            'name' => 'Loket Arsip',
            'service_id' => $otherService->id,
            'operator_name' => '',
            'is_open' => '0',
        ])->assertSessionHas('status', 'Loket Arsip diperbarui.');

        $counter->refresh();
        $this->assertSame('Loket Arsip', $counter->name);
        $this->assertSame($otherService->id, $counter->service_id);
        $this->assertNull($counter->operator_name);
        $this->assertFalse($counter->is_open);
    }

    public function test_counter_with_called_ticket_cannot_close_or_change_service(): void
    {
        $service = Service::factory()->code('A')->create();
        $otherService = Service::factory()->code('B')->create();
        $counter = Counter::factory()->for($service)->create();
        $ticket = Ticket::factory()->for($service)->for($counter)->called()->create();
        $payload = [
            'name' => $counter->name,
            'service_id' => $service->id,
            'operator_name' => $counter->operator_name,
            'is_open' => '0',
        ];

        $this->post(route('pengaturan.loket.perbarui', $counter), $payload)
            ->assertSessionHas('error', "Loket {$counter->name} masih melayani tiket {$ticket->label}; selesaikan atau lewati tiket sebelum mengubah layanan atau menutup loket.");

        $payload['is_open'] = '1';
        $payload['service_id'] = $otherService->id;
        $this->post(route('pengaturan.loket.perbarui', $counter), $payload)
            ->assertSessionHas('error');

        $this->assertTrue($counter->fresh()->is_open);
        $this->assertSame($service->id, $counter->fresh()->service_id);
    }

    public function test_inactive_service_cannot_issue_a_ticket(): void
    {
        $service = Service::factory()->code('A')->inactive()->create();

        $this->from(route('loket.index'))
            ->post(route('tiket.ambil', $service))
            ->assertRedirect(route('loket.index'))
            ->assertSessionHas('error', "Layanan {$service->name} sedang nonaktif.");

        $this->assertDatabaseCount('tickets', 0);
    }

    /** @return array{code: string, name: string, estimated_minutes: int, is_active: string} */
    private function servicePayload(Service $service, bool $active): array
    {
        return [
            'code' => $service->code,
            'name' => $service->name,
            'estimated_minutes' => $service->estimated_minutes,
            'is_active' => $active ? '1' : '0',
        ];
    }
}
