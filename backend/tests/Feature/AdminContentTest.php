<?php

namespace Tests\Feature;

use App\Filament\Resources;
use App\Models;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Creates and edits content through the real admin (Filament) screens,
 * then checks that /api/content returns it in the shape the React website reads.
 */
class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->seed();
        $this->actingAs(User::first());
    }

    protected function api(): array
    {
        return $this->getJson('/api/content')->assertOk()->json();
    }

    protected function create(string $page, array $data): void
    {
        Livewire::test($page)->fillForm($data)->call('create')->assertHasNoFormErrors();
    }

    public function test_every_admin_screen_opens(): void
    {
        foreach (['', 'news', 'events', 'projects', 'publications', 'members', 'leadership-people', 'branches', 'partners', 'supporters', 'award-categories', 'program-details', 'pages', 'form-builder', 'subscribers', 'newsletters', 'settings', 'form-submissions', 'activity-log', 'admin-users', 'profile'] as $s) {
            $this->get("/admin/$s")->assertOk();
        }
        foreach (\App\Models\Page::all() as $p) {
            $this->get("/admin/pages/{$p->id}/edit")->assertOk();
        }
        foreach (\App\Models\FormDefinition::all() as $f) {
            $this->get("/admin/form-builder/{$f->id}/edit")->assertOk();
        }
        foreach (['news', 'events', 'projects', 'publications', 'members', 'leadership-people', 'branches', 'partners', 'supporters', 'award-categories', 'program-details', 'pages', 'form-builder', 'newsletters', 'admin-users'] as $s) {
            $this->get("/admin/$s/create")->assertOk();
        }
    }

    public function test_news_with_image_and_unpublish(): void
    {
        $this->create(Resources\NewsResource\Pages\CreateNews::class, [
            'title' => 'Peace Walk 2026', 'type' => 'Press Release', 'date' => '2026-11-01',
            'summary' => 'Short', 'body' => "Para 1\n\nPara 2", 'program' => 'education-for-children',
            'image' => UploadedFile::fake()->image('walk.jpg'), 'is_published' => true,
        ]);
        $n = $this->api()['news'][0];
        $this->assertSame('peace-walk-2026', $n['id']);
        $this->assertSame('Press Release', $n['type']);
        $this->assertSame('2026-11-01', $n['date']);
        $this->assertSame('education-for-children', $n['program']);
        $this->assertStringStartsWith('http', $n['image']);
        Storage::disk('public')->assertExists(\Illuminate\Support\Str::after($n['image'], '/storage/'));

        // Edit in admin → API changes immediately (cache cleared)
        $record = Models\News::first();
        Livewire::test(Resources\NewsResource\Pages\EditNews::class, ['record' => $record->getRouteKey()])
            ->fillForm(['title' => 'Peace Walk – updated'])->call('save')->assertHasNoFormErrors();
        $this->assertSame('Peace Walk – updated', $this->api()['news'][0]['title']);

        // Unpublished items disappear from the website
        $record->refresh()->update(['is_published' => false]);
        $this->assertSame([], $this->api()['news']);
    }

    public function test_events_projects_publications(): void
    {
        $this->create(Resources\EventResource\Pages\CreateEvent::class, [
            'title' => 'Human Rights Day', 'date' => '2027-12-10', 'end_date' => '2027-12-11', 'location' => 'Vavuniya',
            'description' => 'Annual event', 'images' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.jpg')],
        ]);
        $this->create(Resources\ProjectResource\Pages\CreateProject::class, [
            'title' => 'Clean Water', 'date' => '2026-05-01', 'status' => 'Completed', 'category' => 'Environment',
            'file' => UploadedFile::fake()->create('report.pdf', 50, 'application/pdf'),
        ]);
        $this->create(Resources\PublicationResource\Pages\CreatePublication::class, [
            'title' => 'Handbook', 'category' => 'Official Handbook', 'year' => '2026',
            'file' => UploadedFile::fake()->create('handbook.pdf', 100, 'application/pdf'),
        ]);
        $d = $this->api();
        $this->assertSame('human-rights-day', $d['events'][0]['id']);
        $this->assertSame('2027-12-11', $d['events'][0]['endDate']);
        $this->assertCount(2, $d['events'][0]['images']);
        $this->assertSame('Completed', $d['projects'][0]['status']);
        $this->assertStringEndsWith('.pdf', $d['projects'][0]['file']);
        $this->assertSame('Official Handbook', $d['publications'][0]['category']);
        $this->assertStringEndsWith('.pdf', $d['publications'][0]['file']);
    }

    public function test_members_seats_are_unique_per_page(): void
    {
        $this->create(Resources\LeadershipResource\Pages\CreateLeadership::class, [
            'group' => 'leadership', 'position' => 1, 'name' => 'Jane Doe', 'bio' => 'Bio', 'photo' => UploadedFile::fake()->image('jane.jpg'),
        ]);
        $this->create(Resources\MemberResource\Pages\CreateMember::class, ['show_on_site' => true, 'group' => 'ambassadors', 'position' => 1, 'name' => 'Amb One']);
        $this->create(Resources\MemberResource\Pages\CreateMember::class, ['name' => 'Not public']);
        Livewire::test(Resources\LeadershipResource\Pages\CreateLeadership::class)
            ->fillForm(['group' => 'leadership', 'position' => 1, 'name' => 'Duplicate'])->call('create')
            ->assertHasFormErrors(['position' => 'unique']);

        $leaders = $this->api()['leaders'];
        $this->assertSame('Jane Doe', $leaders['leadership-1']['name']);
        $this->assertStringStartsWith('http', $leaders['leadership-1']['photo']);
        $this->assertSame('Amb One', $leaders['ambassadors-1']['name']);
        $this->assertCount(2, $leaders, 'members not shown on the site stay private');
    }

    public function test_organisation_lists(): void
    {
        $this->create(Resources\BranchResource\Pages\CreateBranch::class, ['country' => 'Sri Lanka', 'name' => 'Northern Branch', 'email' => 'north@example.org']);
        $this->create(Resources\PartnerResource\Pages\CreatePartner::class, ['name' => 'Partner Org', 'website' => 'https://example.org', 'logo' => UploadedFile::fake()->image('logo.png')]);
        $this->create(Resources\SupporterResource\Pages\CreateSupporter::class, ['type' => 'sponsor', 'name' => 'Big Sponsor']);
        $this->create(Resources\SupporterResource\Pages\CreateSupporter::class, ['type' => 'donor', 'name' => 'Kind Donor']);
        $this->create(Resources\AwardCategoryResource\Pages\CreateAwardCategory::class, ['name' => 'Peace Award', 'description' => 'For peace']);

        $d = $this->api();
        $this->assertSame('Northern Branch', $d['branches'][0]['name']);
        $this->assertSame('Partner Org', $d['partners'][0]['name']);
        $this->assertStringStartsWith('http', $d['partners'][0]['logo']);
        $this->assertSame('Big Sponsor', $d['supporters']['sponsors'][0]['name']);
        $this->assertSame('Kind Donor', $d['supporters']['donors'][0]['name']);
        $this->assertSame('Peace Award', $d['awardCategories'][0]['name']);
        $this->getJson('/api/supporters')->assertOk()->assertJsonPath('donors.0.name', 'Kind Donor');
    }

    public function test_pages_program_details_and_settings(): void
    {
        $page = Models\Page::where('slug', 'who-we-are')->first();
        Livewire::test(Resources\PageResource\Pages\EditPage::class, ['record' => $page->getRouteKey()])
            ->fillForm(['title' => 'About IHRC', 'subtitle' => 'New sub', 'sections' => [['heading' => 'H1', 'body' => 'B1'], ['heading' => 'H2', 'body' => 'B2']]])
            ->call('save')->assertHasNoFormErrors();

        $this->create(Resources\ProgramDetailResource\Pages\CreateProgramDetail::class, [
            'slug' => 'environmental-protection', 'description' => 'Long text', 'activities' => ['Tree planting', 'Cleanups'],
        ]);

        Models\Setting::where('key', 'email')->first()->update(['value' => 'office@ihrc.example']);
        Models\Setting::where('key', 'social.youtube')->first()->update(['value' => 'https://youtube.com/@ihrc']);
        Models\Setting::where('key', 'paymentUrl')->first()->update(['value' => 'https://pay.example.org']);

        $d = $this->api();
        $this->assertSame('About IHRC', $d['pages']['who-we-are']['title']);
        $this->assertSame([['H1', '<p>B1</p>'], ['H2', '<p>B2</p>']], $d['pages']['who-we-are']['b']);
        $this->assertSame(['Tree planting', 'Cleanups'], $d['programDetails']['environmental-protection']['activities']);
        $this->assertSame('office@ihrc.example', $d['siteInfo']['email']);
        $this->assertSame('https://youtube.com/@ihrc', $d['siteInfo']['social']['youtube']);
        $this->assertSame('https://pay.example.org', $d['paymentUrl']);
    }

    public function test_cannot_open_admin_or_files_when_logged_out(): void
    {
        auth()->logout();
        $this->get('/admin/news')->assertRedirect('/admin/login');
        $s = Models\FormSubmission::create(['form' => 'x', 'files' => ['cv' => ['name' => 'cv.pdf', 'path' => 'submissions/cv.pdf']]]);
        $this->get("/admin/submissions/{$s->id}/files/cv")->assertForbidden();
    }
}
