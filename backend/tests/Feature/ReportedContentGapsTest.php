<?php

namespace Tests\Feature;

use App\Filament\Resources\AwardCategoryResource;
use App\Filament\Resources\FormDefinitionResource;
use App\Filament\Resources\PageResource;
use App\Mail\SubmissionReceived;
use App\Models\AwardCategory;
use App\Models\FormDefinition;
use App\Models\FormSubmission;
use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use App\Models\WebsiteContent;
use App\Services\FormSpec;
use App\Support\ContentCatalog;
use App\Support\SiteStructure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class ReportedContentGapsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        Mail::fake();
        $this->seed();
        $this->actingAs(User::factory()->create(['role' => User::SUPER_ADMIN]));
    }

    public function test_all_requested_pages_and_forms_have_working_admin_editors(): void
    {
        foreach (['volunteer', 'global-network', 'research', 'membership', 'membership-benefits', 'awards', 'partnership-application', 'accreditation', 'who-we-are', 'chairman-message', 'vision-mission', 'objectives', 'what-we-do', 'roles-responsibilities', 'our-partners', 'recognition', 'countries', 'human-rights', 'events', 'news', 'projects', 'publications'] as $slug) {
            $page = Page::where('slug', $slug)->firstOrFail();
            $this->get(PageResource::getUrl('edit', ['record' => $page]))->assertOk();
        }
        foreach (array_keys(SiteStructure::all()['forms']) as $slug) {
            $form = FormDefinition::where('slug', $slug)->firstOrFail();
            $this->get(FormDefinitionResource::getUrl('edit', ['record' => $form]))->assertOk();
            Livewire::test(FormDefinitionResource\Pages\EditFormDefinition::class, ['record' => $form->id])
                ->call('save')->assertHasNoFormErrors();
            $this->assertSame(FormSpec::toWebsite($form->fresh())['sections'], $this->getJson('/api/content')->json('forms')[$slug]['sections']);
        }
    }

    public function test_composite_page_edits_images_and_sections_reach_the_api_without_losing_existing_content(): void
    {
        $page = Page::where('slug', 'awards')->firstOrFail();
        Livewire::test(PageResource\Pages\EditPage::class, ['record' => $page->id])
            ->fillForm(['title' => 'Updated Awards', 'subtitle' => 'Updated introduction', 'sections' => [['heading' => 'Eligibility', 'body' => '<p>Complete award information.</p>']], 'show_default_content' => false])
            ->call('save')->assertHasNoFormErrors();
        $this->getJson('/api/content')->assertJsonPath('pages.awards.title', 'Updated Awards')->assertJsonPath('pages.awards.composite', true)->assertJsonPath('pages.awards.showDefaultContent', false)->assertJsonPath('pages.awards.b.0.0', 'Eligibility');
        ContentCatalog::sync();
        $this->assertSame('Updated Awards', $page->fresh()->title);
        $page->update(['is_published' => false]);
        $this->getJson('/api/content')->assertJsonPath('pages.awards.published', false);
    }

    public function test_edited_form_questions_messages_and_mailbox_control_real_submissions(): void
    {
        $form = FormDefinition::where('slug', 'award-nomination')->firstOrFail();
        $sections = FormSpec::toBuilderSections([['title' => 'Nomination', 'blocks' => [['t' => 'email', 'id' => 'email', 'label' => 'Your email', 'req' => 1], ['t' => 'select', 'id' => 'category', 'label' => 'Choose award', 'req' => 1, 'opts' => ['Community', 'Research']]]]]);
        Livewire::test(FormDefinitionResource\Pages\EditFormDefinition::class, ['record' => $form->id])
            ->fillForm(['title' => 'Nominate a changemaker', 'name' => 'Edited award application', 'sections' => $sections, 'mailbox' => 'research', 'success_message' => 'Nomination received.'])
            ->call('save')->assertHasNoFormErrors();
        Setting::updateOrCreate(['key' => 'mailbox.research'], ['label' => 'Research', 'value' => 'research@example.org']);
        $this->getJson('/api/content')->assertJsonPath('forms.award-nomination.title', 'Nominate a changemaker')->assertJsonPath('forms.award-nomination.sections.0.blocks.1.opts.0', 'Community');
        $this->postJson('/api/forms', ['form' => 'Old display name', 'formKey' => 'award-nomination', 'data' => ['Your email' => 'person@example.org']])->assertUnprocessable();
        $this->postJson('/api/forms', ['form' => 'Old display name', 'formKey' => 'award-nomination', 'data' => ['Your email' => 'person@example.org', 'Choose award' => 'Community']])->assertCreated()->assertJsonPath('message', 'Nomination received.');
        $this->assertSame('research', FormSubmission::latest('id')->first()->mailbox);
        Mail::assertSent(SubmissionReceived::class, fn ($mail) => $mail->hasTo('research@example.org'));
        $form->refresh()->update(['is_published' => false]);
        $this->getJson('/api/content')->assertJsonPath('forms.award-nomination.published', false);
        $this->postJson('/api/forms', ['form' => $form->name, 'formKey' => $form->slug, 'data' => ['Your email' => 'person@example.org', 'Choose award' => 'Community']])->assertForbidden();
    }

    public function test_content_upgrade_adds_missing_controls_without_overwriting_existing_edits(): void
    {
        $entry = WebsiteContent::where('key', 'copy.PublicPages')->firstOrFail();
        $value = $entry->content['value'];
        unset($value['section-heading-award-categories']);
        $value['page-title-awards-recognition'] = 'Previously edited award title';
        $entry->update(['content' => ['value' => $value]]);
        Page::where('slug', 'awards')->delete();
        ContentCatalog::sync();
        $this->assertSame('Award Categories', $entry->fresh()->content['value']['section-heading-award-categories']);
        $this->assertSame('Previously edited award title', Page::where('slug', 'awards')->firstOrFail()->title);
    }

    public function test_award_details_and_original_image_are_exposed_with_a_stable_address(): void
    {
        $image = UploadedFile::fake()->image('original.jpg');
        $image->storeAs('awards', 'original.jpg', 'public');
        $award = AwardCategory::create(['name' => 'Community Service', 'description' => 'Old text', 'image' => 'awards/original.jpg']);
        Livewire::test(AwardCategoryResource\Pages\EditAwardCategory::class, ['record' => $award->id])
            ->fillForm(['name' => 'Community Award', 'description' => '<h2>Eligibility</h2><p>Full award details.</p>'])->call('save')->assertHasNoFormErrors();
        $payload = $this->getJson('/api/content')->assertOk()->json('awardCategories.0');
        $this->assertSame((string) $award->id, $payload['id']);
        $this->assertStringContainsString('Full award details.', $payload['description']);
        $this->assertStringContainsString('/storage/awards/original.jpg', $payload['image']);
    }
}
