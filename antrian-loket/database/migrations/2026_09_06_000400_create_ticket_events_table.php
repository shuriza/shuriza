<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_events', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('ticket_uuid')->index();
            $table->foreignId('ticket_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 16);
            $table->unsignedBigInteger('revision');
            $table->string('origin_device_id', 64);
            $table->json('payload')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_events');
    }
};
