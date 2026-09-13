@extends('layouts.app')

@section('title', 'Pengaturan Kantor')

@section('content')
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Pengaturan Kantor</h1>
        <p class="mt-2 text-slate-400">Kelola layanan, estimasi, loket, petugas, dan status operasional lokal.</p>
    </div>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 class="text-xl font-bold">Tambah layanan</h2>
        <form method="POST" action="{{ route('pengaturan.layanan.simpan') }}" class="mt-5 grid gap-4 md:grid-cols-5">
            @csrf
            <label class="grid gap-1 text-sm text-slate-300">
                Kode
                <input name="code" value="{{ old('code') }}" maxlength="4" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 uppercase">
            </label>
            <label class="grid gap-1 text-sm text-slate-300 md:col-span-2">
                Nama layanan
                <input name="name" value="{{ old('name') }}" maxlength="255" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
            </label>
            <label class="grid gap-1 text-sm text-slate-300">
                Estimasi (menit)
                <input type="number" name="estimated_minutes" value="{{ old('estimated_minutes', 5) }}" min="1" max="240" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
            </label>
            <div class="flex items-end gap-3">
                <input type="hidden" name="is_active" value="0">
                <label class="flex items-center gap-2 pb-2 text-sm text-slate-300">
                    <input type="checkbox" name="is_active" value="1" @checked(old('is_active', true)) class="size-4 rounded border-slate-600 bg-slate-950 text-emerald-600">
                    Aktif
                </label>
                <button type="submit" class="ml-auto rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500">Tambah</button>
            </div>
        </form>
    </section>

    <section class="mt-8">
        <h2 class="text-xl font-bold">Layanan</h2>
        <div class="mt-4 grid gap-4 lg:grid-cols-2">
            @foreach ($services as $service)
                <form method="POST" action="{{ route('pengaturan.layanan.perbarui', $service) }}" class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                    @csrf
                    <div class="grid gap-4 sm:grid-cols-4">
                        <label class="grid gap-1 text-sm text-slate-300">
                            Kode
                            <input name="code" value="{{ $service->code }}" maxlength="4" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 uppercase">
                        </label>
                        <label class="grid gap-1 text-sm text-slate-300 sm:col-span-2">
                            Nama
                            <input name="name" value="{{ $service->name }}" maxlength="255" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                        </label>
                        <label class="grid gap-1 text-sm text-slate-300">
                            Menit
                            <input type="number" name="estimated_minutes" value="{{ $service->estimated_minutes }}" min="1" max="240" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                        </label>
                    </div>
                    <div class="mt-4 flex items-center justify-between gap-4">
                        <div>
                            <input type="hidden" name="is_active" value="0">
                            <label class="flex items-center gap-2 text-sm text-slate-300">
                                <input type="checkbox" name="is_active" value="1" @checked($service->is_active) class="size-4 rounded border-slate-600 bg-slate-950 text-emerald-600">
                                Layanan aktif
                            </label>
                            <p class="mt-1 text-xs text-slate-500">{{ $service->counters->count() }} loket terhubung</p>
                        </div>
                        <button type="submit" class="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600">Simpan layanan</button>
                    </div>
                </form>
            @endforeach
        </div>
    </section>

    <section class="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 class="text-xl font-bold">Tambah loket</h2>
        <form method="POST" action="{{ route('pengaturan.loket.simpan') }}" class="mt-5 grid gap-4 md:grid-cols-5">
            @csrf
            <label class="grid gap-1 text-sm text-slate-300">
                Nama loket
                <input name="name" value="{{ old('name') }}" maxlength="255" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
            </label>
            <label class="grid gap-1 text-sm text-slate-300">
                Layanan
                <select name="service_id" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                    @foreach ($services as $service)
                        <option value="{{ $service->id }}" @selected((int) old('service_id') === $service->id)>{{ $service->code }} · {{ $service->name }}</option>
                    @endforeach
                </select>
            </label>
            <label class="grid gap-1 text-sm text-slate-300 md:col-span-2">
                Nama petugas
                <input name="operator_name" value="{{ old('operator_name') }}" maxlength="255" class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
            </label>
            <div class="flex items-end gap-3">
                <input type="hidden" name="is_open" value="0">
                <label class="flex items-center gap-2 pb-2 text-sm text-slate-300">
                    <input type="checkbox" name="is_open" value="1" @checked(old('is_open', true)) class="size-4 rounded border-slate-600 bg-slate-950 text-emerald-600">
                    Buka
                </label>
                <button type="submit" class="ml-auto rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500">Tambah</button>
            </div>
        </form>
    </section>

    <section class="mt-8">
        <h2 class="text-xl font-bold">Loket</h2>
        <div class="mt-4 grid gap-4 lg:grid-cols-2">
            @foreach ($counters as $counter)
                <form method="POST" action="{{ route('pengaturan.loket.perbarui', $counter) }}" class="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                    @csrf
                    <div class="grid gap-4 sm:grid-cols-2">
                        <label class="grid gap-1 text-sm text-slate-300">
                            Nama
                            <input name="name" value="{{ $counter->name }}" maxlength="255" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                        </label>
                        <label class="grid gap-1 text-sm text-slate-300">
                            Layanan
                            <select name="service_id" required class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                                @foreach ($services as $service)
                                    <option value="{{ $service->id }}" @selected($counter->service_id === $service->id)>{{ $service->code }} · {{ $service->name }}</option>
                                @endforeach
                            </select>
                        </label>
                        <label class="grid gap-1 text-sm text-slate-300 sm:col-span-2">
                            Petugas
                            <input name="operator_name" value="{{ $counter->operator_name }}" maxlength="255" class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                        </label>
                    </div>
                    <div class="mt-4 flex items-center justify-between gap-4">
                        <div>
                            <input type="hidden" name="is_open" value="0">
                            <label class="flex items-center gap-2 text-sm text-slate-300">
                                <input type="checkbox" name="is_open" value="1" @checked($counter->is_open) class="size-4 rounded border-slate-600 bg-slate-950 text-emerald-600">
                                Loket buka
                            </label>
                        </div>
                        <button type="submit" class="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600">Simpan loket</button>
                    </div>
                </form>
            @endforeach
        </div>
    </section>
@endsection
