<?php

use App\Http\Controllers\Api\ContentController;
use App\Support\ContentCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->boolean('is_composite')->default(false);
            $table->boolean('show_default_content')->default(true);
        });
        ContentCatalog::sync();
        Cache::forget(ContentController::CACHE_KEY);
    }

    public function down(): void
    {
        Schema::table('pages', fn (Blueprint $table) => $table->dropColumn(['is_composite', 'show_default_content']));
    }
};
