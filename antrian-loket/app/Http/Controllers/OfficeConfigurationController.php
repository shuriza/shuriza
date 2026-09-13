<?php

namespace App\Http\Controllers;

use App\Exceptions\OfficeConfigurationException;
use App\Http\Requests\StoreCounterRequest;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateCounterRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Counter;
use App\Models\OutboxEntry;
use App\Models\Service;
use App\Services\OfficeConfigurationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class OfficeConfigurationController extends Controller
{
    public function __construct(
        private readonly OfficeConfigurationService $configuration,
    ) {}

    public function index(): View
    {
        return view('pengaturan.index', [
            'services' => Service::query()
                ->with(['counters' => fn ($query) => $query->orderBy('name')])
                ->orderBy('code')
                ->get(),
            'counters' => Counter::query()->with('service')->orderBy('name')->get(),
            'pendingCount' => OutboxEntry::pending()->count(),
        ]);
    }

    public function storeService(StoreServiceRequest $request): RedirectResponse
    {
        $service = $this->configuration->createService($request->validated());

        return back()->with('status', "Layanan {$service->name} ditambahkan.");
    }

    public function updateService(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        try {
            $service = $this->configuration->updateService($service, $request->validated());
        } catch (OfficeConfigurationException $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return back()->with('status', "Layanan {$service->name} diperbarui.");
    }

    public function storeCounter(StoreCounterRequest $request): RedirectResponse
    {
        try {
            $counter = $this->configuration->createCounter($request->validated());
        } catch (OfficeConfigurationException $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return back()->with('status', "{$counter->name} ditambahkan.");
    }

    public function updateCounter(UpdateCounterRequest $request, Counter $counter): RedirectResponse
    {
        try {
            $counter = $this->configuration->updateCounter($counter, $request->validated());
        } catch (OfficeConfigurationException $exception) {
            return back()->withInput()->with('error', $exception->getMessage());
        }

        return back()->with('status', "{$counter->name} diperbarui.");
    }
}
