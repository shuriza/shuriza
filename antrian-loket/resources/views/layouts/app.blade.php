<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title', 'Antrian Loket') — {{ config('antrian.office.name') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 antialiased">
    <header class="border-b border-slate-800 bg-slate-900">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <a href="{{ route('loket.index') }}" class="flex items-baseline gap-3">
                <span class="text-2xl font-bold tracking-tight text-emerald-400">Antrian Loket</span>
                <span class="hidden text-sm text-slate-400 sm:inline">{{ config('antrian.office.name') }}</span>
            </a>

            {{-- Indikator konektivitas dan outbox; diperbarui oleh resources/js/app.js. --}}
            <div
                id="sync-indicator"
                data-pending="{{ $pendingCount ?? 0 }}"
                data-configured="{{ filled(config('antrian.sync.endpoint')) ? 'true' : 'false' }}"
                role="status"
                title="Status jaringan perangkat, bukan bukti koneksi atau sinkronisasi ke pusat."
                class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300"
            >
                <span id="sync-dot" class="inline-block h-2.5 w-2.5 rounded-full bg-slate-500"></span>
                <span id="sync-text">Memeriksa koneksi…</span>
            </div>
        </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-8">
        @if (session('status'))
            <div class="mb-6 rounded-xl border border-emerald-700 bg-emerald-900/40 px-5 py-4 text-lg text-emerald-200">
                {{ session('status') }}
            </div>
        @endif

        @if (session('error'))
            <div class="mb-6 rounded-xl border border-rose-700 bg-rose-900/40 px-5 py-4 text-lg text-rose-200">
                {{ session('error') }}
            </div>
        @endif

        @yield('content')
    </main>

    <footer class="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        {{ config('antrian.office.name') }} — {{ config('antrian.office.address') }}
    </footer>
</body>
</html>
