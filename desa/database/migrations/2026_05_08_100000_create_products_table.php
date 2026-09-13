<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 0)->nullable();
            $table->string('price_note')->nullable();
            $table->enum('category', ['makanan', 'minuman', 'kerajinan', 'pertanian', 'jasa', 'lainnya']);
            $table->string('image')->nullable();
            $table->string('contact_name');
            $table->string('contact_phone')->nullable();
            $table->string('contact_whatsapp')->nullable();
            $table->boolean('is_available')->default(true);
            $table->enum('status', ['pending', 'published', 'rejected'])->default('pending');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('submitted_by_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
