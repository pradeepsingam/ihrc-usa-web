<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Everything added for "IHRC Backend Admin Requirements v2":
 * form workflow, roles, activity log, member register, page/form builder, newsletter.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('form_submissions', function (Blueprint $t) {
            $t->string('reference')->nullable()->unique()->after('id');
            $t->string('status')->default('New')->index();
            $t->longText('notes')->nullable();
            $t->string('mailbox')->nullable();
            $t->string('applicant_email')->nullable();
            $t->foreignId('event_id')->nullable()->index();
            $t->foreignId('member_id')->nullable()->index();
            $t->timestamp('mailed_at')->nullable();
            $t->timestamp('confirmation_sent_at')->nullable();
            $t->string('ip', 64)->nullable();
        });

        Schema::table('users', function (Blueprint $t) {
            $t->string('role')->default('viewer');
            $t->text('app_authentication_secret')->nullable();
            $t->text('app_authentication_recovery_codes')->nullable();
        });

        Schema::create('activity_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->index();
            $t->string('action');            // created, updated, deleted, approved, rejected, status, imported, sent…
            $t->string('subject_type')->nullable();
            $t->unsignedBigInteger('subject_id')->nullable();
            $t->string('subject_label')->nullable();
            $t->json('changes')->nullable();
            $t->timestamp('created_at')->nullable()->index();
        });

        // The member register. Rows with show_on_site + group/position also fill the public Members pages.
        Schema::table('members', function (Blueprint $t) {
            $t->string('member_id')->nullable()->unique();
            $t->string('group')->nullable()->change();
            $t->unsignedInteger('position')->nullable()->change();
            $t->date('date_of_birth')->nullable();
            $t->string('gender')->nullable();
            $t->string('nationality')->nullable();
            $t->string('country')->nullable();
            $t->string('city')->nullable();
            $t->text('address')->nullable();
            $t->string('phone')->nullable();
            $t->string('email')->nullable()->index();
            $t->string('title')->nullable();
            $t->string('profession')->nullable();
            $t->string('organization')->nullable();
            $t->text('interests')->nullable();
            $t->boolean('photo_public')->default(true);
            $t->string('id_document')->nullable();
            $t->string('cv')->nullable();
            $t->string('status')->default('Active')->index();
            $t->date('joined_at')->nullable();
            $t->date('expires_at')->nullable();
            $t->string('fee_status')->nullable();
            $t->boolean('show_on_site')->default(false)->index();
            $t->foreignId('submission_id')->nullable();
        });

        Schema::table('events', function (Blueprint $t) {
            $t->boolean('registration_open')->default(true);
        });

        Schema::table('publications', function (Blueprint $t) {
            $t->date('date')->nullable();
            $t->string('cover_image')->nullable();
        });

        Schema::table('pages', function (Blueprint $t) {
            $t->boolean('is_builtin')->default(false);
            $t->boolean('is_published')->default(true);
            $t->string('image')->nullable();
            $t->json('images')->nullable();
            $t->string('menu')->nullable();
            $t->string('menu_label')->nullable();
            $t->unsignedInteger('menu_sort')->default(0);
            $t->string('form_slug')->nullable();
        });

        Schema::create('form_definitions', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('name');                 // sent with each submission, shown in the inbox
            $t->string('title');
            $t->json('intro')->nullable();      // list of paragraphs
            $t->json('sections')->nullable();   // [{title, note, blocks:[{type, data}]}]
            $t->string('mailbox')->nullable();  // settings key, e.g. "membership"
            $t->text('success_message')->nullable();
            $t->boolean('is_published')->default(true);
            $t->boolean('is_builtin')->default(false);
            $t->timestamps();
        });

        Schema::create('subscribers', function (Blueprint $t) {
            $t->id();
            $t->string('email')->unique();
            $t->string('name')->nullable();
            $t->string('token', 64)->unique();
            $t->timestamp('confirmed_at')->nullable();
            $t->timestamp('unsubscribed_at')->nullable();
            $t->string('ip', 64)->nullable();
            $t->timestamps();
        });

        Schema::create('newsletters', function (Blueprint $t) {
            $t->id();
            $t->string('subject');
            $t->longText('body');
            $t->timestamp('sent_at')->nullable();
            $t->unsignedInteger('sent_count')->default(0);
            $t->foreignId('sent_by')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletters');
        Schema::dropIfExists('subscribers');
        Schema::dropIfExists('form_definitions');
        Schema::dropIfExists('activity_logs');
        Schema::table('pages', fn (Blueprint $t) => $t->dropColumn(['is_builtin', 'is_published', 'image', 'images', 'menu', 'menu_label', 'menu_sort', 'form_slug']));
        Schema::table('publications', fn (Blueprint $t) => $t->dropColumn(['date', 'cover_image']));
        Schema::table('events', fn (Blueprint $t) => $t->dropColumn('registration_open'));
        Schema::table('members', fn (Blueprint $t) => $t->dropColumn(['member_id', 'date_of_birth', 'gender', 'nationality', 'country', 'city', 'address', 'phone', 'email', 'title', 'profession', 'organization', 'interests', 'photo_public', 'id_document', 'cv', 'status', 'joined_at', 'expires_at', 'fee_status', 'show_on_site', 'submission_id']));
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['role', 'app_authentication_secret', 'app_authentication_recovery_codes']));
        Schema::table('form_submissions', fn (Blueprint $t) => $t->dropColumn(['reference', 'status', 'notes', 'mailbox', 'applicant_email', 'event_id', 'member_id', 'mailed_at', 'confirmation_sent_at', 'ip']));
    }
};
