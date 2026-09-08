<?php

namespace Tests\Feature;

use App\Models\Ticket;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Env;
use Native\Desktop\DataObjects\Printer;
use Native\Desktop\Facades\System;
use Tests\TestCase;

class TicketPrintTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_missing_configured_printer_reports_error_without_printing_elsewhere(): void
    {
        $ticket = Ticket::factory()->create();
        config(['antrian.printer' => 'Thermal Loket']);
        System::shouldReceive('printers')->once()->andReturn([
            new Printer('Office Laser', 'Office Laser', '', []),
        ]);
        System::shouldReceive('print')->never();
        $environment = Env::getRepository();
        $previous = $environment->get('NATIVEPHP_RUNNING');
        $environment->set('NATIVEPHP_RUNNING', 'true');

        try {
            $this->post(route('tiket.cetak.kirim', $ticket))
                ->assertRedirectToRoute('tiket.cetak', $ticket)
                ->assertSessionHas('error')
                ->assertSessionMissing('status');
        } finally {
            $previous === null
                ? $environment->clear('NATIVEPHP_RUNNING')
                : $environment->set('NATIVEPHP_RUNNING', $previous);
        }
    }
}
