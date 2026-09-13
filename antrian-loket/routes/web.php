<?php

use App\Http\Controllers\CounterController;
use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\OfficeConfigurationController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\TicketHistoryController;
use App\Http\Controllers\TicketPrintController;
use Illuminate\Support\Facades\Route;

// Pilih loket (beranda operator).
Route::get('/', [CounterController::class, 'index'])->name('loket.index');

// Konsol operator untuk satu loket.
Route::get('/loket/{counter}', [CounterController::class, 'show'])->name('loket.show');

// Aksi mutasi antrian — semuanya POST, tidak ada mutasi lewat GET.
Route::post('/loket/{counter}/panggil', [CounterController::class, 'callNext'])->name('loket.panggil');
Route::post('/loket/{counter}/selesai/{ticket}', [CounterController::class, 'finish'])->name('loket.selesai');
Route::post('/loket/{counter}/lewati/{ticket}', [CounterController::class, 'skip'])->name('loket.lewati');
Route::post('/loket/{counter}/panggil-ulang/{ticket}', [CounterController::class, 'recall'])->name('loket.panggil-ulang');
Route::post('/loket/{counter}/kembalikan/{ticket}', [CounterController::class, 'restore'])->name('loket.kembalikan');

// Ambil tiket baru untuk sebuah layanan (meja tamu / walk-in).
Route::post('/layanan/{service}/ambil', [CounterController::class, 'issue'])->name('tiket.ambil');

// Pratinjau dan cetak tiket ke printer lokal.
Route::get('/tiket/{ticket}/cetak', [TicketPrintController::class, 'show'])->name('tiket.cetak');
Route::post('/tiket/{ticket}/cetak', [TicketPrintController::class, 'print'])->name('tiket.cetak.kirim');

// Status dan tindakan operasional lokal.
Route::get('/operasional', [OperationsController::class, 'index'])->name('operasional.index');
Route::post('/operasional/sinkronkan', [OperationsController::class, 'sync'])->name('operasional.sinkronkan');
Route::post('/operasional/backup', [OperationsController::class, 'backup'])->name('operasional.backup');

// Pengaturan lokal layanan dan loket.
Route::get('/pengaturan', [OfficeConfigurationController::class, 'index'])->name('pengaturan.index');
Route::post('/pengaturan/layanan', [OfficeConfigurationController::class, 'storeService'])->name('pengaturan.layanan.simpan');
Route::post('/pengaturan/layanan/{service}', [OfficeConfigurationController::class, 'updateService'])->name('pengaturan.layanan.perbarui');
Route::post('/pengaturan/loket', [OfficeConfigurationController::class, 'storeCounter'])->name('pengaturan.loket.simpan');
Route::post('/pengaturan/loket/{counter}', [OfficeConfigurationController::class, 'updateCounter'])->name('pengaturan.loket.perbarui');

Route::get('/laporan/harian', [DailyReportController::class, 'index'])->name('laporan.harian');

// Jejak audit tiket — hanya baca, tidak ada mutasi antrean.
Route::get('/riwayat', [TicketHistoryController::class, 'index'])->name('riwayat.index');
Route::get('/riwayat/{ticket}', [TicketHistoryController::class, 'show'])->name('riwayat.show');
