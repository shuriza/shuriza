@extends('layouts.app')

@section('title', 'Pilih Loket')

@section('content')
    <h1 class="mb-2 text-3xl font-bold tracking-tight">Pilih Loket</h1>
    <p class="mb-8 text-lg text-slate-400">Pilih loket yang akan Anda layani hari ini.</p>

    @if ($rows->isEmpty())
        <div class="rounded-xl border border-slate-700 bg-slate-900 px-6 py-10 text-center text-lg text-slate-400">
            Belum ada loket yang buka. Hubungi administrator untuk membuka loket.
        </div>
    @else
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ($rows as $row)
                <a
                    href="{{ route('loket.show', $row['counter']) }}"
                    class="group block rounded-2xl border border-slate-700 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800"
                >
                    <div class="mb-1 text-sm font-medium uppercase tracking-wide text-emerald-400">
                        {{ $row['counter']->name }}
                    </div>
                    <div class="mb-4 text-2xl font-bold text-slate-100">
                        {{ $row['counter']->service->name }}
                    </div>

                    <dl class="flex items-center gap-6 text-sm text-slate-400">
                        <div>
                            <dt class="text-xs uppercase tracking-wide">Menunggu</dt>
                            <dd class="text-xl font-semibold text-slate-200">{{ $row['waitingCount'] }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs uppercase tracking-wide">Perkiraan Tunggu</dt>
                            <dd class="text-xl font-semibold text-slate-200">{{ $row['estimatedWaitMinutes'] }} mnt</dd>
                        </div>
                    </dl>

                    @if ($row['counter']->operator_name)
                        <p class="mt-4 text-xs text-slate-500">Petugas: {{ $row['counter']->operator_name }}</p>
                    @endif

                    <span class="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-emerald-500">
                        Buka Konsol Loket
                    </span>
                </a>
            @endforeach
        </div>
    @endif
@endsection
