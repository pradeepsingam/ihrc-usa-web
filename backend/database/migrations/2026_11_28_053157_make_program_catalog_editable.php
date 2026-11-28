<?php

use App\Http\Controllers\Api\ContentController;
use App\Support\ContentCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('program_details', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->unsignedInteger('number')->nullable();
            $table->string('category')->nullable();
            $table->text('summary')->nullable();
            $table->string('image')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort')->default(0);
        });
        ContentCatalog::sync();
        Cache::forget(ContentController::CACHE_KEY);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_details', fn (Blueprint $table) => $table->dropColumn([
            'title', 'number', 'category', 'summary', 'image', 'image_url', 'is_published', 'sort',
        ]));
    }
};
