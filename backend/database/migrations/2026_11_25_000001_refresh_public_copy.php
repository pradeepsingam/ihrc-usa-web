<?php

use App\Http\Controllers\Api\ContentController;
use App\Support\PublicCopy;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $fields = [
            'pages' => ['title', 'subtitle', 'sections', 'menu_label'],
            'form_definitions' => ['title', 'intro', 'sections', 'success_message'],
            'news' => ['title', 'summary', 'body'],
            'events' => ['title', 'description', 'body'],
            'projects' => ['title', 'summary', 'description', 'body'],
            'publications' => ['title', 'description', 'category'],
            'partners' => ['description', 'category'],
            'branches' => ['designation', 'activities'],
            'members' => ['title', 'public_role', 'bio', 'responsibilities'],
            'program_details' => ['description', 'activities'],
            'award_categories' => ['name', 'description'],
        ];

        foreach ($fields as $table => $columns) {
            $columns = array_values(array_intersect($columns, Schema::getColumnListing($table)));
            foreach (DB::table($table)->select(['id', ...$columns])->get() as $row) {
                $changes = [];
                foreach ($columns as $column) {
                    $before = $row->{$column};
                    $decoded = is_string($before) ? json_decode($before, true) : null;
                    $after = is_array($decoded)
                        ? json_encode(PublicCopy::clean($decoded), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                        : PublicCopy::clean($before);
                    if ($after !== $before) {
                        $changes[$column] = $after;
                    }
                }
                if ($changes) {
                    DB::table($table)->where('id', $row->id)->update($changes);
                }
            }
        }

        DB::table('settings')->where('key', 'email')->where('value', 'info@gmail.com')->update(['value' => 'info@ihrc-usa.org']);
        DB::table('pages')->where('slug', 'our-supporters')->update(['is_published' => false]);
        $volunteer = DB::table('form_definitions')->where('slug', 'volunteer')->first();
        if ($volunteer) {
            $sections = json_decode($volunteer->sections, true) ?: [];
            $hasEmail = collect($sections)->flatMap(fn ($section) => $section['blocks'] ?? [])
                ->contains(fn ($block) => ($block['data']['kind'] ?? null) === 'email');
            if (! $hasEmail && $sections) {
                $index = count($sections) > 1 ? 1 : 0;
                $sections[$index]['blocks'][] = ['type' => 'field', 'data' => ['id' => 'email', 'kind' => 'email', 'label' => 'Email Address', 'req' => true]];
                DB::table('form_definitions')->where('id', $volunteer->id)->update(['sections' => json_encode($sections)]);
            }
        }
        Cache::forget(ContentController::CACHE_KEY);
    }

    public function down(): void
    {
        // Editorial changes are retained; the deployment backup preserves the original copy.
    }
};
