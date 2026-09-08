<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('outbox_entries', function (Blueprint $table) {
            $table->id();

            // Sama dengan uuid ticket_event yang diwakili. Unik supaya
            // event tidak pernah masuk outbox dua kali.
            $table->uuid('event_uuid')->unique();

            $table->string('type', 16);
            $table->json('payload');

            $table->timestamp('synced_at')->nullable();
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->text('last_error')->nullable();

            $table->timestamps();

            // Jalur baca pengirim: yang belum tersinkron, urut lama ke baru.
            $table->index(['synced_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outbox_entries');
    }
};
