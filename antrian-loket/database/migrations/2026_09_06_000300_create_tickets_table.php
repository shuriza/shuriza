<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            // Identitas global tiket. Dibuat di device, jadi kunci idempoten
            // saat sinkronisasi ke pusat.
            $table->uuid('uuid')->unique();

            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('counter_id')->nullable()->constrained()->nullOnDelete();

            $table->date('service_date');
            $table->unsignedInteger('number');
            $table->string('label', 12);

            $table->string('status', 16)->default('menunggu');

            $table->timestamp('issued_at');
            $table->timestamp('called_at')->nullable();
            $table->timestamp('finished_at')->nullable();

            // Lamport-style counter untuk resolusi konflik. Naik setiap
            // transisi status; pemenang adalah revisi tertinggi.
            $table->unsignedBigInteger('revision')->default(1);

            // Device yang melakukan perubahan terakhir. Tie-breaker
            // deterministik saat revision sama.
            $table->string('origin_device_id', 64);

            $table->timestamps();

            // Nomor antrian unik per layanan per hari. Ini yang membuat dua
            // loket tidak bisa menerbitkan nomor kembar.
            $table->unique(['service_id', 'service_date', 'number']);

            // Jalur baca utama loket: tiket menunggu paling awal.
            $table->index(['service_id', 'service_date', 'status', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
