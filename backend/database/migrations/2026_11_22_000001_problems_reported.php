<?php

use App\Support\SiteStructure;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/** Changes from "IHRC Problems Reported" (20 Nov 2026). */
return new class extends Migration
{
    public function up(): void
    {
        // #3: people on the website have a role; any number of people can share a role.
        // "position" is now only the display order.
        Schema::table('members', function (Blueprint $t) {
            $t->string('public_role')->nullable()->after('group');
            $t->dropUnique(['group', 'position']);
        });
        foreach (DB::table('members')->whereNotNull('group')->whereNotNull('position')->get() as $m) {
            DB::table('members')->where('id', $m->id)->update(['public_role' => SiteStructure::role($m->group, (int) $m->position)]);
        }

        // #4: publications can be view-only.
        Schema::table('publications', fn (Blueprint $t) => $t->boolean('allow_download')->default(true));

        // #8: award category image.
        Schema::table('award_categories', fn (Blueprint $t) => $t->string('image')->nullable());
    }

    public function down(): void
    {
        Schema::table('award_categories', fn (Blueprint $t) => $t->dropColumn('image'));
        Schema::table('publications', fn (Blueprint $t) => $t->dropColumn('allow_download'));
        Schema::table('members', function (Blueprint $t) {
            $t->dropColumn('public_role');
            $t->unique(['group', 'position']);
        });
    }
};
