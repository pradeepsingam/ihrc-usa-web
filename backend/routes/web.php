<?php

use App\Models\FormSubmission;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::redirect('/', '/admin');

// Files uploaded with website forms are private: only logged-in admins can open them.
Route::get('/admin/submissions/{submission}/files/{key}', function (FormSubmission $submission, string $key) {
    abort_unless(auth()->check() && auth()->user()->can('view', $submission), 403);
    // Membership Officers only see application forms, not e.g. complaints.
    abort_unless(\App\Filament\Resources\FormSubmissionResource::getEloquentQuery()->whereKey($submission->id)->exists(), 403);
    $file = $submission->files[$key] ?? abort(404);

    return Storage::disk('local')->download($file['path'], $file['name']);
})->middleware('web')->name('admin.submission-file');
