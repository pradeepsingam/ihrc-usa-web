<?php

namespace Tests\Feature;

use App\Filament\Resources\ProgramDetailResource;
use App\Filament\Resources\WebsiteContentResource;
use App\Models\Partner;
use App\Models\ProgramDetail;
use App\Models\User;
use App\Models\WebsiteContent;
use App\Support\ContentCatalog;
use App\Support\SiteStructure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class WebsiteContentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->seed();
        $this->actingAs(User::factory()->create(['role' => User::EDITOR]));
    }

    public function test_existing_programs_and_static_content_are_available_in_the_admin(): void
    {
        $this->assertSame(31, ProgramDetail::count());
        $this->assertSame(count(ContentCatalog::definitions()), WebsiteContent::count());
        $this->assertTrue(Partner::where('name', 'Peace One Day Mali')->exists());
        foreach (WebsiteContent::all() as $record) {
            $this->get(WebsiteContentResource::getUrl('edit', ['record' => $record]))->assertOk();
        }
        Livewire::test(ProgramDetailResource\Pages\ListProgramDetail::class)
            ->assertCanSeeTableRecords(ProgramDetail::orderBy('sort')->limit(10)->get());
    }

    public function test_program_edits_creates_and_unpublishing_reach_the_public_api(): void
    {
        $program = ProgramDetail::where('slug', 'education-for-children')->firstOrFail();
        Livewire::test(ProgramDetailResource\Pages\EditProgramDetail::class, ['record' => $program->id])
            ->fillForm(['title' => 'Learning for Every Child', 'summary' => 'Updated card description', 'description' => '<p>Updated full article</p>', 'category' => 'Learning'])
            ->call('save')->assertHasNoFormErrors();
        $data = $this->getJson('/api/content')->assertOk()->json();
        $card = collect($data['programs'])->firstWhere('slug', 'education-for-children');
        $this->assertSame('Learning for Every Child', $card['t']);
        $this->assertSame('Updated card description', $card['d']);
        $this->assertSame('Learning', $card['c']);
        $this->assertSame('<p>Updated full article</p>', $data['programDetails']['education-for-children']['description']);
        $this->assertStringContainsString('Learning for Every Child', SiteStructure::programOptions()['education-for-children']);

        Livewire::test(ProgramDetailResource\Pages\CreateProgramDetail::class)
            ->fillForm(['title' => 'New Program', 'slug' => 'new-program', 'number' => 32, 'category' => 'Learning', 'summary' => 'New card'])
            ->call('create')->assertHasNoFormErrors();
        $this->assertTrue(collect($this->getJson('/api/content')->json('programs'))->contains('slug', 'new-program'));

        Livewire::test(ProgramDetailResource\Pages\EditProgramDetail::class, ['record' => $program->id])
            ->fillForm(['is_published' => false])->call('save')->assertHasNoFormErrors();
        $data = $this->getJson('/api/content')->assertOk()->json();
        $this->assertFalse(collect($data['programs'])->contains('slug', 'education-for-children'));
        $this->assertArrayNotHasKey('education-for-children', $data['programDetails']);
    }

    public function test_text_lists_nested_groups_and_presentation_data_survive_admin_edits(): void
    {
        $edits = [
            'copy.Home' => fn (array $value): array => array_replace($value, ['text-about-ihrc-usa' => 'Our Updated Organisation']),
            'research.researchAreas' => fn (array $value): array => ['Updated research area'],
            'Home.slides' => function (array $value): array {
                $value[0]['h'] = 'Updated Homepage';

                return $value;
            },
            'research.researchTopics' => fn (array $value): array => [['Updated topic group', ['First topic', 'Second topic']]],
            'coreValues.coreValues' => function (array $value): array {
                $value[0]['name'] = 'Updated Integrity';

                return $value;
            },
            'ihrcBenefits.ihrcBenefits' => function (array $value): array {
                $value[0][1] = 'Updated benefit description';

                return $value;
            },
            'content.pubCategories' => fn (array $value): array => ['Updated category'],
        ];
        foreach ($edits as $key => $edit) {
            $record = WebsiteContent::where('key', $key)->firstOrFail();
            $expected = $edit($record->content['value']);
            Livewire::test(WebsiteContentResource\Pages\EditWebsiteContent::class, ['record' => $record->id])
                ->fillForm(['content' => ['value' => $this->repeaterState($expected)]])->call('save')->assertHasNoFormErrors();
            $this->assertSame($expected, $record->fresh()->content['value'], $key);
            $this->assertSame($expected, $this->getJson('/api/content')->assertOk()->json('websiteContent')[$key], $key);
        }
        $this->assertSame(['Updated category'], $this->getJson('/api/content')->json('pubCategories'));
        $this->assertSame(['Updated category' => 'Updated category'], SiteStructure::publicationCategories());
    }

    public function test_content_sync_preserves_admin_changes_and_edits_invalidate_public_cache(): void
    {
        $record = WebsiteContent::where('key', 'research.researchAreas')->firstOrFail();
        $this->getJson('/api/content')->assertOk();
        $record->update(['content' => ['value' => []]]);
        $program = ProgramDetail::where('slug', 'health')->firstOrFail();
        $program->update(['title' => 'Edited program', 'summary' => '', 'description' => 'Existing article']);
        ContentCatalog::sync();
        $this->assertSame([], $record->fresh()->content['value']);
        $this->assertSame('Edited program', $program->fresh()->title);
        $this->assertSame('', $program->fresh()->summary);
        $this->assertSame('Existing article', $program->fresh()->description);
        $this->assertSame([], $this->getJson('/api/content')->json('websiteContent')['research.researchAreas']);
    }

    /** Browser state for Filament simple repeaters wraps each text item. */
    private function repeaterState(mixed $value, bool $isItem = false): mixed
    {
        if (! is_array($value)) {
            return $value;
        }
        if (! $isItem && array_is_list($value) && isset($value[0]) && ! is_array($value[0])) {
            return array_map(fn ($text): array => ['text' => $text], $value);
        }

        return array_map(fn ($item) => $this->repeaterState($item, ! $isItem && array_is_list($value)), $value);
    }

    public function test_viewers_cannot_edit_website_content(): void
    {
        $record = WebsiteContent::firstOrFail();
        $this->actingAs(User::factory()->create(['role' => User::VIEWER]));
        $this->get(WebsiteContentResource::getUrl('edit', ['record' => $record]))->assertForbidden();
    }
}
