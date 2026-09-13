@extends('layouts.app')

@section('title', $counter->name)

@section('content')
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
            <p class="text-sm font-medium uppercase tracking-wide text-emerald-400">{{ $counter->name }}</p>
            <h1 class="text-3xl font-bold tracking-tight">{{ $counter->service->name }}</h1>
            @if ($counter->operator_name)
                <p class="mt-1 text-sm text-slate-400">Petugas: {{ $counter->operator_name }}</p>
            @endif
        </div>

        <dl class="flex items-center gap-8 text-right">
            <div>
                <dt class="text-xs uppercase tracking-wide text-slate-500">Menunggu</dt>
                <dd class="text-2xl font-bold text-slate-100">{{ $waitingCount }}</dd>
            </div>
            <div>
                <dt class="text-xs uppercase tracking-wide text-slate-500">Perkiraan Tunggu</dt>
                <dd class="text-2xl font-bold text-slate-100">{{ $estimatedWaitMinutes }} mnt</dd>
            </div>
            <div>
                <dt class="text-xs uppercase tracking-wide text-slate-500">Belum Tersinkron</dt>
                <dd class="text-2xl font-bold text-slate-100">{{ $pendingCount }}</dd>
            </div>
        </dl>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {{-- Tiket yang sedang dilayani. --}}
        <section class="lg:col-span-2 rounded-2xl border border-slate-700 bg-slate-900 p-8">
            <h2 class="text-sm font-medium uppercase tracking-wide text-slate-400">Sedang Dilayani</h2>

            <p class="my-6 text-center text-8xl font-black tracking-tight text-emerald-400">
                {{ $currentTicket?->label ?? '—' }}
            </p>

            @if ($currentTicket)
                <p class="mb-6 text-center text-sm text-slate-400">
                    Dipanggil {{ $currentTicket->called_at?->format('H:i:s') }}
                </p>
            @else
                <p class="mb-6 text-center text-sm text-slate-500">
                    Belum ada tiket yang dipanggil di loket ini.
                </p>
            @endif

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <form method="POST" action="{{ route('loket.panggil', $counter) }}">
                    @csrf
                    <button
                        type="submit"
                        @disabled($currentTicket !== null)
                        class="w-full rounded-xl bg-emerald-600 px-6 py-5 text-lg font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Panggil Berikutnya
                    </button>
                </form>

                {{-- Tanpa tiket aktif, tidak ada target aksi: tombol dinonaktifkan. --}}
                @if ($currentTicket)
                    <form method="POST" action="{{ route('loket.selesai', [$counter, $currentTicket]) }}">
                        @csrf
                        <button
                            type="submit"
                            class="w-full rounded-xl bg-slate-700 px-6 py-5 text-lg font-bold text-white transition hover:bg-slate-600"
                        >
                            Selesai
                        </button>
                    </form>

                    <form method="POST" action="{{ route('loket.lewati', [$counter, $currentTicket]) }}">
                        @csrf
                        <button
                            type="submit"
                            class="w-full rounded-xl bg-amber-700 px-6 py-5 text-lg font-bold text-white transition hover:bg-amber-600"
                        >
                            Lewati
                        </button>
                    </form>
                @else
                    <button type="button" disabled class="w-full cursor-not-allowed rounded-xl bg-slate-800 px-6 py-5 text-lg font-bold text-slate-500">
                        Selesai
                    </button>
                    <button type="button" disabled class="w-full cursor-not-allowed rounded-xl bg-slate-800 px-6 py-5 text-lg font-bold text-slate-500">
                        Lewati
                    </button>
                @endif
            </div>

            {{-- Panggil ulang: warga belum mendengar panggilan pertama. --}}
            @if ($currentTicket)
                <form method="POST" action="{{ route('loket.panggil-ulang', [$counter, $currentTicket]) }}" class="mt-3">
                    @csrf
                    <button
                        type="submit"
                        class="w-full rounded-xl border border-emerald-600 px-6 py-3 text-base font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                    >
                        Panggil Ulang {{ $currentTicket->label }}
                    </button>
                </form>
                <p class="mt-2 text-center text-xs text-slate-500">
                    Nomor dan loket tetap sama; hanya waktu panggil diperbarui.
                </p>
            @endif
        </section>

        <aside class="space-y-6">
            {{-- Ambil tiket baru untuk layanan loket ini. --}}
            <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 class="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">Ambil Tiket</h2>
                <form method="POST" action="{{ route('tiket.ambil', $counter->service) }}">
                    @csrf
                    <button
                        type="submit"
                        class="w-full rounded-xl border border-emerald-600 px-5 py-4 text-base font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                    >
                        Cetak Tiket Baru
                    </button>
                </form>
                <p class="mt-3 text-xs text-slate-500">
                    Tiket terbit lokal dan tetap berfungsi tanpa jaringan.
                </p>
            </div>

            <div class="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 class="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">Status Sinkronisasi</h2>
                <p class="text-sm text-slate-300">
                    {{ $syncConfigured ? 'Endpoint pusat dikonfigurasi.' : 'Mode offline penuh — endpoint pusat belum diatur.' }}
                </p>
                <p class="mt-2 text-sm text-slate-400">
                    {{ $pendingCount }} perubahan menunggu dikirim.
                </p>
            </div>
        </aside>
    </div>

    {{-- Antrian berikutnya. --}}
    <section class="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 class="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">Antrian Berikutnya</h2>

        @if ($waitingTickets->isEmpty())
            <p class="py-6 text-center text-slate-500">Tidak ada tiket menunggu.</p>
        @else
            <ol class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                @foreach ($waitingTickets as $ticket)
                    <li class="rounded-xl border border-slate-700 bg-slate-800 px-3 py-4 text-center">
                        <span class="block text-xl font-bold text-slate-100">{{ $ticket->label }}</span>
                        <span class="mt-1 block text-xs text-slate-500">{{ $ticket->issued_at?->format('H:i') }}</span>
                    </li>
                @endforeach
            </ol>
        @endif
    </section>

    {{-- Tiket dilewati yang masih bisa dikembalikan ke antrean hari ini. --}}
    @if ($skippedTickets->isNotEmpty())
        <section class="mt-6 rounded-2xl border border-amber-800 bg-slate-900 p-6">
            <h2 class="text-sm font-medium uppercase tracking-wide text-amber-400">Tiket Dilewati</h2>
            <p class="mt-1 mb-4 text-sm text-slate-400">
                Warga yang datang terlambat dapat dikembalikan ke antrean tanpa mengambil nomor baru.
            </p>

            <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                @foreach ($skippedTickets as $ticket)
                    <li class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-center">
                        <span class="block text-xl font-bold text-slate-100">{{ $ticket->label }}</span>
                        <span class="mt-1 block text-xs text-slate-500">
                            Dilewati {{ $ticket->finished_at?->format('H:i') }}
                        </span>

                        <form method="POST" action="{{ route('loket.kembalikan', [$counter, $ticket]) }}" class="mt-3">
                            @csrf
                            <button
                                type="submit"
                                class="w-full rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                            >
                                Kembalikan ke Antrean
                            </button>
                        </form>
                    </li>
                @endforeach
            </ul>
        </section>
    @endif
@endsection
