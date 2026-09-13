@extends('layouts.app')

@section('title', 'Operasional')

@section('content')
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Operasional</h1>
            <p class="mt-2 text-slate-400">Pantau antrean sinkronisasi dan lindungi database lokal.</p>
        </div>
        <a href="{{ route('loket.index') }}" class="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Kembali ke daftar loket</a>
    </div>

    <section class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border {{ $health->healthy ? 'border-emerald-800' : 'border-amber-700' }} bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Event menunggu</p>
            <p class="mt-2 text-3xl font-bold">{{ $health->pendingCount }}</p>
        </div>
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Umur tertua</p>
            <p class="mt-2 text-3xl font-bold">{{ $health->oldestHours }} <span class="text-base font-medium text-slate-400">jam</span></p>
        </div>
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p class="text-sm text-slate-400">Percobaan maksimum</p>
            <p class="mt-2 text-3xl font-bold">{{ $health->maxAttempts }}</p>
        </div>
    </section>

    <div class="mt-6 rounded-xl border px-5 py-4 {{ $health->healthy ? 'border-emerald-800 bg-emerald-950/40 text-emerald-200' : 'border-amber-700 bg-amber-950/40 text-amber-100' }}">
        {{ $health->healthy ? 'Outbox sehat.' : 'Outbox memerlukan perhatian. Jalankan sinkronisasi dan periksa kegagalan terbaru.' }}
    </div>

    <section class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 class="text-xl font-bold">Sinkronisasi</h2>
            <p class="mt-2 text-sm text-slate-400">
                {{ $syncConfigured ? 'Kirim outbox, lalu tarik perubahan dari pusat.' : 'Endpoint pusat belum dikonfigurasi; operasi loket tetap berjalan lokal.' }}
            </p>
            <form method="POST" action="{{ route('operasional.sinkronkan') }}" class="mt-5">
                @csrf
                <button type="submit" @disabled(! $syncConfigured) class="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
                    Sinkronkan Sekarang
                </button>
            </form>
        </div>

        <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 class="text-xl font-bold">Backup SQLite</h2>
            <p class="mt-2 text-sm text-slate-400">Buat snapshot konsisten ke direktori backup perangkat. Restore tetap dilakukan offline melalui terminal.</p>
            <form method="POST" action="{{ route('operasional.backup') }}" class="mt-5">
                @csrf
                <button type="submit" class="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-500">
                    Buat Backup
                </button>
            </form>
        </div>
    </section>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 class="text-xl font-bold">Kegagalan terbaru</h2>
        @if ($recentFailures->isEmpty())
            <p class="mt-4 text-sm text-slate-400">Tidak ada kegagalan pending yang tercatat.</p>
        @else
            <div class="mt-4 overflow-x-auto">
                <table class="w-full min-w-2xl text-left text-sm">
                    <thead class="text-slate-400">
                        <tr>
                            <th class="pb-3 pr-4">Event</th>
                            <th class="pb-3 pr-4">Percobaan</th>
                            <th class="pb-3 pr-4">Terakhir</th>
                            <th class="pb-3">Pesan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        @foreach ($recentFailures as $failure)
                            <tr>
                                <td class="py-3 pr-4 font-mono text-xs text-slate-300">{{ $failure->event_uuid }}</td>
                                <td class="py-3 pr-4">{{ $failure->attempts }}</td>
                                <td class="py-3 pr-4 text-slate-400">{{ $failure->last_attempt_at?->format('d M Y H:i') ?? '—' }}</td>
                                <td class="py-3 text-rose-300">{{ $failure->last_error }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>
@endsection
