<?php

namespace App\Services;

use App\Enums\TicketStatus;
use App\Exceptions\OfficeConfigurationException;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

class OfficeConfigurationService
{
    /**
     * @param  array{code: string, name: string, estimated_minutes: int, is_active: bool}  $attributes
     */
    public function createService(array $attributes): Service
    {
        return Service::query()->create($attributes);
    }

    /**
     * @param  array{code: string, name: string, estimated_minutes: int, is_active: bool}  $attributes
     */
    public function updateService(Service $service, array $attributes): Service
    {
        return DB::transaction(function () use ($service, $attributes): Service {
            $service = Service::query()->lockForUpdate()->findOrFail($service->getKey());

            if ($attributes['code'] !== $service->code && $service->tickets()->exists()) {
                throw OfficeConfigurationException::serviceCodeIsInUse($service->code);
            }

            if (! $attributes['is_active'] && $service->is_active) {
                $this->guardServiceDeactivation($service);
            }

            $service->fill($attributes)->save();

            return $service->refresh();
        });
    }

    /**
     * @param  array{name: string, service_id: int, operator_name: ?string, is_open: bool}  $attributes
     */
    public function createCounter(array $attributes): Counter
    {
        return DB::transaction(function () use ($attributes): Counter {
            $service = Service::query()->lockForUpdate()->findOrFail($attributes['service_id']);
            $this->guardCounterService($service, $attributes['is_open']);

            return Counter::query()->create($attributes);
        });
    }

    /**
     * @param  array{name: string, service_id: int, operator_name: ?string, is_open: bool}  $attributes
     */
    public function updateCounter(Counter $counter, array $attributes): Counter
    {
        return DB::transaction(function () use ($counter, $attributes): Counter {
            $counter = Counter::query()->lockForUpdate()->findOrFail($counter->getKey());
            $service = Service::query()->lockForUpdate()->findOrFail($attributes['service_id']);
            $activeTicket = $counter->currentTicket();

            if ($activeTicket !== null && (
                ! $attributes['is_open']
                || $attributes['service_id'] !== $counter->service_id
            )) {
                throw OfficeConfigurationException::counterHasActiveTicket($counter->name, $activeTicket->label);
            }

            $this->guardCounterService($service, $attributes['is_open']);

            $counter->fill($attributes)->save();

            return $counter->refresh();
        });
    }

    private function guardServiceDeactivation(Service $service): void
    {
        if ($service->counters()->where('is_open', true)->exists()) {
            throw OfficeConfigurationException::serviceHasOpenCounters($service->name);
        }

        if (Ticket::query()
            ->where('service_id', $service->id)
            ->whereIn('status', [TicketStatus::Menunggu->value, TicketStatus::Dipanggil->value])
            ->exists()) {
            throw OfficeConfigurationException::serviceHasOpenQueue($service->name);
        }
    }

    private function guardCounterService(Service $service, bool $isOpen): void
    {
        if ($isOpen && ! $service->is_active) {
            throw OfficeConfigurationException::inactiveService($service->name);
        }
    }
}
