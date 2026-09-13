@extends('layouts.app')

@section('title', 'Jejak Tiket '.$ticket->label)

@section('content')
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">{{ $ticket->service->name }}</p>
            <h1 class="text-3xl font-bold tracking-tight">Jejak Tiket {{ $ticket->label }}</h1>
            <p class="mt-2 text-slate-400">
                {{ $ticket->service_date?->format('d/m/Y') }} · status {{ $ticket->status->label() }}
                @if ($ticket->counter)
                    · {{ $ticket->counter->name }}
                @endif
            </p>
        </div>
        <a href="{{ route('riwayat.index', ['date' => $ticket->service_date?->format('Y-m-d')]) }}" class="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Kembali ke pencarian</a>
    </div>

    <section class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Revisi</p>
            <p class="mt-2 text-3xl font-bold">{{ $ticket->revision }}</p>
        </div>
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Menunggu</p>
            <p class="mt-2 text-3xl font-bold">{{ $waitMinutes === null ? '—' : $waitMinutes.' mnt' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Dilayani</p>
            <p class="mt-2 text-3xl font-bold">{{ $serviceMinutes === null ? '—' : $serviceMinutes.' mnt' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Jumlah event</p>
            <p class="mt-2 text-3xl font-bold">{{ $events->count() }}</p>
        </div>
    </section>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 class="text-xl font-bold">Urutan peristiwa</h2>
        <p class="mt-2 text-sm text-slate-400">
            Diurutkan menurut waktu kejadian. Event tanpa baris outbox berasal dari pusat, jadi tidak dikirim ulang dari perangkat ini.
        </p>

        <ol class="mt-6 space-y-4">
            @foreach ($events as $event)
                @php($entry = $outbox->get($event->uuid))
                <li class="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                    <div class="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                            <span class="text-base font-bold text-slate-100">{{ $event->type->label() }}</span>
                            <span class="ml-2 font-mono text-xs text-slate-500">revisi {{ $event->revision }}</span>
                        </div>
                        <span class="text-sm text-slate-400">{{ $event->occurred_at?->format('d/m/Y H:i:s') }}</span>
                    </div>

                    <dl class="mt-3 grid gap-x-6 gap-y-1 text-xs text-slate-400 sm:grid-cols-2">
                        <div class="flex gap-2">
                            <dt class="text-slate-500">Perangkat asal</dt>
                            <dd class="font-mono text-slate-300">{{ $event->origin_device_id }}</dd>
                        </div>
                        <div class="flex gap-2">
                            <dt class="text-slate-500">Loket</dt>
                            <dd>{{ $event->payload['counter_name'] ?? '—' }}</dd>
                        </div>
                    </dl>

                    <div class="mt-3 text-xs">
                        @if ($entry === null)
                            <span class="rounded-full border border-slate-600 px-3 py-1 text-slate-400">Diterima dari pusat</span>
                        @elseif ($entry->synced_at !== null)
                            <span class="rounded-full border border-emerald-700 bg-emerald-950/50 px-3 py-1 text-emerald-300">
                                Terkirim {{ $entry->synced_at->format('d/m/Y H:i') }}
                            </span>
                        @elseif ($entry->last_error !== null)
                            <span class="rounded-full border border-rose-700 bg-rose-950/50 px-3 py-1 text-rose-300">
                                Gagal kirim ({{ $entry->attempts }}x): {{ $entry->last_error }}
                            </span>
                        @else
                            <span class="rounded-full border border-amber-700 bg-amber-950/40 px-3 py-1 text-amber-200">Menunggu dikirim</span>
                        @endif
                    </div>
                </li>
            @endforeach
        </ol>
    </section>
@endsection
