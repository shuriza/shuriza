<?php

use App\Http\Controllers\CounterController;
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

// Ambil tiket baru untuk sebuah layanan (meja tamu / walk-in).
Route::post('/layanan/{service}/ambil', [CounterController::class, 'issue'])->name('tiket.ambil');

// Pratinjau dan cetak tiket ke printer lokal.
Route::get('/tiket/{ticket}/cetak', [TicketPrintController::class, 'show'])->name('tiket.cetak');
Route::post('/tiket/{ticket}/cetak', [TicketPrintController::class, 'print'])->name('tiket.cetak.kirim');
