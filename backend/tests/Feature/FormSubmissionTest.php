<?php

namespace Tests\Feature;

use App\Models\FormSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** The website forms post to /api/forms exactly like src/lib/submitForm.js does. */
class FormSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_json_form_is_stored(): void
    {
        $this->postJson('/api/forms', ['form' => 'IHRC-USA Website Enquiry', 'subject' => 'IHRC-USA Website Enquiry', 'submittedAt' => now()->toIso8601String(), 'data' => ['Name' => 'Ann', 'Message' => 'Hi']])
            ->assertCreated();
        $s = FormSubmission::first();
        $this->assertSame(['Name' => 'Ann', 'Message' => 'Hi'], $s->data);
        $this->assertNull($s->read_at);
    }

    public function test_multipart_form_with_files_is_stored_and_downloadable_by_admin(): void
    {
        Storage::fake('local');
        $this->post('/api/forms', [
            'form' => 'Membership Application', 'subject' => 'Membership – Ann', 'data' => json_encode(['1. Full Name' => 'Ann']),
            'photo' => UploadedFile::fake()->image('photo.heic'),
            'eduCert' => UploadedFile::fake()->create('certs.pdf', 60 * 1024, 'application/pdf'), // 60 MB
            'cv' => UploadedFile::fake()->create('cv.odt', 20),
        ], ['Accept' => 'application/json'])->assertCreated();

        $s = FormSubmission::first();
        $this->assertSame(['photo', 'eduCert', 'cv'], array_keys($s->files));
        Storage::disk('local')->assertExists($s->files['eduCert']['path']);

        $this->actingAs(User::factory()->create());
        $this->get("/admin/submissions/{$s->id}/files/cv")->assertOk()->assertDownload('cv.odt');
        $this->get("/admin/form-submissions/{$s->id}")->assertOk()->assertSee('1. Full Name')->assertSee('Ann');
        $this->assertNotNull($s->fresh()->read_at, 'Opening a submission marks it as read');
    }

    public function test_long_event_form_name_is_accepted(): void
    {
        $this->postJson('/api/forms', ['form' => 'Event Registration: '.str_repeat('Very long title ', 20), 'data' => ['Name' => 'A']])->assertCreated();
    }

    public function test_rejects_bad_files_and_missing_data(): void
    {
        $this->postJson('/api/forms', ['form' => 'x'])->assertStatus(422);
        $this->post('/api/forms', ['form' => 'x', 'data' => '{}', 'cv' => UploadedFile::fake()->create('virus.exe', 10)], ['Accept' => 'application/json'])->assertStatus(422);
        $this->assertSame(0, FormSubmission::count());
    }

    public function test_cors_allows_the_website(): void
    {
        $this->withHeaders(['Origin' => 'http://localhost:5173', 'Access-Control-Request-Method' => 'POST'])
            ->options('/api/forms')->assertHeader('Access-Control-Allow-Origin');
    }
}
