<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $t) {
            $t->id();
            $t->string('key')->unique();
            $t->string('label');
            $t->text('value')->nullable();
            $t->unsignedInteger('sort')->default(0);
            $t->timestamps();
        });

        Schema::create('pages', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('title');
            $t->text('subtitle')->nullable();
            $t->json('sections')->nullable();
            $t->timestamps();
        });

        Schema::create('news', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('title');
            $t->string('type')->default('News');
            $t->date('date')->nullable();
            $t->text('summary')->nullable();
            $t->longText('body')->nullable();
            $t->string('image')->nullable();
            $t->string('program')->nullable();
            $t->string('category')->nullable();
            $t->boolean('is_published')->default(true);
            $t->timestamps();
        });

        Schema::create('events', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('title');
            $t->date('date')->nullable();
            $t->date('end_date')->nullable();
            $t->string('location')->nullable();
            $t->text('description')->nullable();
            $t->longText('body')->nullable();
            $t->string('image')->nullable();
            $t->json('images')->nullable();
            $t->string('program')->nullable();
            $t->string('category')->nullable();
            $t->boolean('is_published')->default(true);
            $t->timestamps();
        });

        Schema::create('projects', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->string('title');
            $t->date('date')->nullable();
            $t->string('status')->default('Ongoing');
            $t->string('location')->nullable();
            $t->text('summary')->nullable();
            $t->longText('body')->nullable();
            $t->string('image')->nullable();
            $t->json('images')->nullable();
            $t->string('file')->nullable();
            $t->string('program')->nullable();
            $t->string('category')->nullable();
            $t->boolean('is_published')->default(true);
            $t->timestamps();
        });

        Schema::create('publications', function (Blueprint $t) {
            $t->id();
            $t->string('title');
            $t->string('category');
            $t->string('year')->nullable();
            $t->text('description')->nullable();
            $t->string('file');
            $t->boolean('is_published')->default(true);
            $t->timestamps();
        });

        Schema::create('partners', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('logo')->nullable();
            $t->string('category')->nullable();
            $t->text('description')->nullable();
            $t->string('website')->nullable();
            $t->unsignedInteger('sort')->default(0);
            $t->timestamps();
        });

        Schema::create('supporters', function (Blueprint $t) {
            $t->id();
            $t->string('type')->default('donor'); // donor | sponsor
            $t->string('name');
            $t->string('logo')->nullable();
            $t->text('details')->nullable();
            $t->string('url')->nullable();
            $t->unsignedInteger('sort')->default(0);
            $t->timestamps();
        });

        Schema::create('branches', function (Blueprint $t) {
            $t->id();
            $t->string('country');
            $t->string('name');
            $t->string('representative')->nullable();
            $t->string('designation')->nullable();
            $t->string('email')->nullable();
            $t->string('phone')->nullable();
            $t->string('location')->nullable();
            $t->text('activities')->nullable();
            $t->unsignedInteger('sort')->default(0);
            $t->timestamps();
        });

        Schema::create('award_categories', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->text('description')->nullable();
            $t->unsignedInteger('sort')->default(0);
            $t->timestamps();
        });

        Schema::create('members', function (Blueprint $t) {
            $t->id();
            $t->string('group');          // e.g. "leadership", "ambassadors"
            $t->unsignedInteger('position'); // seat number inside the group (1, 2, 3…)
            $t->string('name');
            $t->string('photo')->nullable();
            $t->text('bio')->nullable();
            $t->text('responsibilities')->nullable();
            $t->timestamps();
            $t->unique(['group', 'position']);
        });

        Schema::create('program_details', function (Blueprint $t) {
            $t->id();
            $t->string('slug')->unique();
            $t->text('description')->nullable();
            $t->string('location')->nullable();
            $t->date('date')->nullable();
            $t->json('activities')->nullable();
            $t->json('images')->nullable();
            $t->timestamps();
        });

        Schema::create('form_submissions', function (Blueprint $t) {
            $t->id();
            $t->string('form');
            $t->string('subject')->nullable();
            $t->json('data')->nullable();
            $t->json('files')->nullable();
            $t->timestamp('submitted_at')->nullable();
            $t->timestamp('read_at')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['form_submissions', 'program_details', 'members', 'award_categories', 'branches', 'supporters', 'partners', 'publications', 'projects', 'events', 'news', 'pages', 'settings'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
