<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reactions', function (Blueprint $table) {
            $table->id();
            $table->string('emoji'); // heart, laugh, wow, pray, fire
            $table->morphs('reactable'); // reactable_type, reactable_id
            $table->string('session_id')->nullable(); // for anonymous reactions
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->unique(['emoji', 'reactable_type', 'reactable_id', 'session_id'], 'unique_reaction');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reactions');
    }
};
