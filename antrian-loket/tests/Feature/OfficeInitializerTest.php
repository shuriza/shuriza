<?php

namespace Tests\Feature;

use App\Models\Counter;
use App\Models\Service;
use App\Services\OfficeInitializer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OfficeInitializerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_initializes_an_empty_office_with_stable_identifiers(): void
    {
        $result = app(OfficeInitializer::class)->initialize();

        $this->assertCount(4, $result['services']);
        $this->assertCount(4, $result['counters']);
        $this->assertDatabaseHas('services', [
            'uuid' => '00000000-0000-4000-8000-000000000001',
            'code' => 'A',
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('counters', [
            'uuid' => '00000000-0000-4000-8001-000000000001',
            'name' => 'Loket 1',
            'service_id' => $result['services']['A']->id,
            'is_open' => true,
        ]);
    }

    public function test_it_preserves_an_existing_office(): void
    {
        $service = Service::factory()->code('Z')->create([
            'name' => 'Layanan Khusus',
        ]);
        $counter = Counter::factory()->for($service)->create([
            'name' => 'Loket Khusus',
            'operator_name' => 'Petugas Lokal',
            'is_open' => false,
        ]);

        $result = app(OfficeInitializer::class)->initialize();

        $this->assertSame(['services' => [], 'counters' => []], $result);
        $this->assertDatabaseCount('services', 1);
        $this->assertDatabaseCount('counters', 1);
        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'name' => 'Layanan Khusus',
        ]);
        $this->assertDatabaseHas('counters', [
            'id' => $counter->id,
            'operator_name' => 'Petugas Lokal',
            'is_open' => false,
        ]);
    }
}
