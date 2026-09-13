@extends('layouts.app')

@section('title', 'Riwayat Tiket')

@section('content')
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Riwayat Tiket</h1>
            <p class="mt-2 text-slate-400">Telusuri jejak audit tiket pada database perangkat ini.</p>
        </div>
        <a href="{{ route('loket.index') }}" class="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Kembali ke daftar loket</a>
    </div>

    <form method="GET" action="{{ route('riwayat.index') }}" class="mt-8 flex flex-wrap items-end gap-3">
        <label class="grid gap-1 text-sm text-slate-300">
            Tanggal layanan
            <input type="date" name="date" value="{{ $date }}" class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100">
        </label>
        <label class="grid gap-1 text-sm text-slate-300">
            Label atau nomor
            <input type="text" name="q" value="{{ $term }}" maxlength="12" placeholder="A042 atau 42" class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100">
        </label>
        <button type="submit" class="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500">Cari</button>
    </form>

    <section class="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        @if ($tickets->isEmpty())
            <p class="px-6 py-10 text-center text-slate-400">
                Tidak ada tiket yang cocok pada tanggal {{ \Illuminate\Support\Carbon::parse($date)->format('d/m/Y') }}.
            </p>
        @else
            <div class="overflow-x-auto">
                <table class="w-full min-w-3xl text-left text-sm">
                    <thead class="bg-slate-800/70 text-slate-300">
                        <tr>
                            <th class="px-5 py-4">Tiket</th>
                            <th class="px-5 py-4">Layanan</th>
                            <th class="px-5 py-4">Status</th>
                            <th class="px-5 py-4">Loket</th>
                            <th class="px-5 py-4 text-right">Revisi</th>
                            <th class="px-5 py-4"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        @foreach ($tickets as $ticket)
                            <tr>
                                <td class="px-5 py-4">
                                    <span class="text-lg font-bold text-emerald-400">{{ $ticket->label }}</span>
                                    <span class="mt-1 block text-xs text-slate-500">{{ $ticket->issued_at?->format('H:i:s') }}</span>
                                </td>
                                <td class="px-5 py-4 text-slate-300">{{ $ticket->service->name }}</td>
                                <td class="px-5 py-4">{{ $ticket->status->label() }}</td>
                                <td class="px-5 py-4 text-slate-400">{{ $ticket->counter?->name ?? '—' }}</td>
                                <td class="px-5 py-4 text-right font-mono text-slate-400">{{ $ticket->revision }}</td>
                                <td class="px-5 py-4 text-right">
                                    <a href="{{ route('riwayat.show', $ticket) }}" class="font-semibold text-emerald-400 hover:text-emerald-300">Lihat jejak</a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            @if ($tickets->count() === $resultLimit)
                <p class="border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
                    Menampilkan {{ $resultLimit }} hasil pertama. Persempit pencarian dengan label atau nomor.
                </p>
            @endif
        @endif
    </section>
@endsection
