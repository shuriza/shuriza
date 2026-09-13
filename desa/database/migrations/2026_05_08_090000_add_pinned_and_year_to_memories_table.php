<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('memories', function (Blueprint $table) {
            $table->boolean('is_pinned')->default(false)->after('status');
            $table->unsignedSmallInteger('year')->nullable()->after('is_pinned');
        });
    }

    public function down(): void
    {
        Schema::table('memories', function (Blueprint $table) {
            $table->dropColumn(['is_pinned', 'year']);
        });
    }
};
