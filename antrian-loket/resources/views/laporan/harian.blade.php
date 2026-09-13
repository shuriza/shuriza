@extends('layouts.app')

@section('title', 'Laporan Harian')

@section('content')
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Laporan Harian</h1>
            <p class="mt-2 text-slate-400">Ringkasan kinerja antrean lokal per layanan.</p>
        </div>
        <form method="GET" action="{{ route('laporan.harian') }}" class="flex items-end gap-3">
            <label class="grid gap-1 text-sm text-slate-300">
                Tanggal
                <input type="date" name="date" value="{{ $date }}" class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100">
            </label>
            <button type="submit" class="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500">Tampilkan</button>
        </form>
    </div>

    <section class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @foreach ([
            ['Terbit', $issuedCount, 'text-slate-100'],
            ['Menunggu', $waitingCount, 'text-amber-300'],
            ['Dipanggil', $calledCount, 'text-sky-300'],
            ['Selesai', $finishedCount, 'text-emerald-300'],
            ['Dilewati', $skippedCount, 'text-rose-300'],
            ['Panggil ulang', $recalledCount, 'text-sky-300'],
            ['Dikembalikan', $restoredCount, 'text-amber-300'],
        ] as [$label, $value, $color])
            <div class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                <p class="text-sm text-slate-400">{{ $label }}</p>
                <p class="mt-2 text-3xl font-bold {{ $color }}">{{ $value }}</p>
            </div>
        @endforeach
    </section>

    <p class="mt-4 text-sm text-slate-500">
        Panggil ulang dan pengembalian dihitung dari audit event, jadi satu tiket dapat menyumbang lebih dari sekali.
    </p>

    <section class="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        <div class="overflow-x-auto">
            <table class="w-full min-w-4xl text-left text-sm">
                <thead class="bg-slate-800/70 text-slate-300">
                    <tr>
                        <th class="px-5 py-4">Layanan</th>
                        <th class="px-5 py-4 text-right">Terbit</th>
                        <th class="px-5 py-4 text-right">Menunggu</th>
                        <th class="px-5 py-4 text-right">Dipanggil</th>
                        <th class="px-5 py-4 text-right">Selesai</th>
                        <th class="px-5 py-4 text-right">Dilewati</th>
                        <th class="px-5 py-4 text-right">Panggil ulang</th>
                        <th class="px-5 py-4 text-right">Dikembalikan</th>
                        <th class="px-5 py-4 text-right">Rata-rata tunggu</th>
                        <th class="px-5 py-4 text-right">Rata-rata layanan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                    @foreach ($services as $service)
                        <tr>
                            <td class="px-5 py-4"><span class="font-bold text-emerald-400">{{ $service->code }}</span> · {{ $service->name }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->issued_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->waiting_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->called_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->finished_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->skipped_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->recalled_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->restored_count }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->average_wait_minutes === null ? '—' : number_format((float) $service->average_wait_minutes, 1).' mnt' }}</td>
                            <td class="px-5 py-4 text-right">{{ $service->average_service_minutes === null ? '—' : number_format((float) $service->average_service_minutes, 1).' mnt' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </section>
@endsection
