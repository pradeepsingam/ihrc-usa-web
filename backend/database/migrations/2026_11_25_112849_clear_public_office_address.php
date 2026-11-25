<?php

use App\Http\Controllers\Api\ContentController;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('settings')->whereIn('key', ['address', 'mapUrl'])->update(['value' => null]);
        Cache::forget(ContentController::CACHE_KEY);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Removed public contact details are not republished on rollback.
    }
};
