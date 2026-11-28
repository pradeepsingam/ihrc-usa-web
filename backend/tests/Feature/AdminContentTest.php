<?php

namespace Tests\Feature;

use App\Filament\Resources;
use App\Models;
use App\Models\FormDefinition;
use App\Models\Member;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Env;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        foreach (['', 'news', 'events', 'projects', 'publications', 'members', 'branches', 'partners', 'supporters', 'award-categories', 'program-details', 'website-contents', 'pages', 'form-builder', 'subscribers', 'newsletters', 'settings', 'form-submissions', 'activity-log', 'admin-users', 'profile'] as $s) {
            $this->get("/admin/$s")->assertOk();
        }
        foreach (Page::all() as $p) {
            $this->get("/admin/pages/{$p->id}/edit")->assertOk();
        }
        foreach (FormDefinition::all() as $f) {
            $this->get("/admin/form-builder/{$f->id}/edit")->assertOk();
        }
        foreach (['news', 'events', 'projects', 'publications', 'members', 'branches', 'partners', 'supporters', 'award-categories', 'program-details', 'pages', 'form-builder', 'newsletters', 'admin-users'] as $s) {
            $this->get("/admin/$s/create")->assertOk();
        }
    }

    public function test_images_survive_save_and_reopen_with_a_separate_public_upload_directory(): void
    {
        $root = storage_path('framework/testing/shared-host-public');
        $environment = Env::getRepository();
        $environment->set('PUBLIC_STORAGE_PATH', $root);
        $filesystems = require config_path('filesystems.php');
        config(['filesystems.disks.public' => $filesystems['disks']['public']]);
        Storage::forgetDisk('public');

        try {
            $this->create(Resources\NewsResource\Pages\CreateNews::class, [
                'title' => 'Upload persistence', 'date' => '2026-11-22',
                'image' => UploadedFile::fake()->image('persistent.jpg'), 'is_published' => true,
            ]);
            $record = Models\News::firstOrFail();
            $image = $record->image;
            $this->assertFileExists($root.'/'.$image);

            Livewire::test(Resources\NewsResource\Pages\EditNews::class, ['record' => $record->getRouteKey()])
                ->fillForm(['summary' => 'Saved again without replacing the image'])
                ->call('save')->assertHasNoFormErrors();
            $this->assertSame($image, $record->fresh()->image);
            $this->assertFileExists($root.'/'.$image);
            $this->assertStringEndsWith('/storage/'.$image, $this->api()['news'][0]['image']);
        } finally {
            $environment->clear('PUBLIC_STORAGE_PATH');
            Storage::forgetDisk('public');
            File::deleteDirectory($root);
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
        Storage::disk('public')->assertExists(Str::after($n['image'], '/storage/'));

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

    public function test_members_any_number_per_role_with_country(): void
    {
        foreach (['Jane Doe', 'John Roe', 'Third President'] as $i => $name) {
            $this->create(Resources\MemberResource\Pages\CreateMember::class, [
                'member_id' => 'IHRC-P-'.($i + 1), 'name' => $name, 'show_on_site' => true, 'group' => 'leadership', 'public_role' => 'President',
                'country' => $i ? 'India' : 'Sri Lanka', 'position' => $i, 'photo' => UploadedFile::fake()->image('p.jpg'),
            ]);
        }
        $this->create(Resources\MemberResource\Pages\CreateMember::class, ['member_id' => 'IHRC-PRIVATE-1', 'name' => 'Not public']);
        Livewire::test(Resources\MemberResource\Pages\CreateMember::class)
            ->fillForm(['name' => 'X', 'show_on_site' => true])->call('create')->assertHasFormErrors(['group', 'public_role']);

        $people = $this->api()['people'];
        $this->assertSame(['Jane Doe', 'John Roe', 'Third President'], array_column($people['leadership'], 'name'));
        $this->assertSame(['President', 'President', 'President'], array_column($people['leadership'], 'role'));
        $this->assertSame('Sri Lanka', $people['leadership'][0]['country']);
        $this->assertStringStartsWith('http', $people['leadership'][0]['photo']);
        $this->assertCount(1, $people, 'members not shown on the site stay private');

        // Older website builds read "leaders" (<page>-<number>); the same people must be there.
        $leaders = $this->api()['leaders'];
        $this->assertSame(['leadership-1', 'leadership-2', 'leadership-3'], array_keys($leaders));
        $this->assertSame('Jane Doe', $leaders['leadership-1']['name']);

        Livewire::test(Resources\MemberResource\Pages\ListMember::class)->set('activeTab', 'website')
            ->assertCanSeeTableRecords(Member::where('show_on_site', true)->get())
            ->assertCanNotSeeTableRecords(Member::where('name', 'Not public')->get());
    }

    public function test_member_ids_are_entered_manually_and_can_be_changed(): void
    {
        $this->create(Resources\MemberResource\Pages\CreateMember::class, [
            'member_id' => ' custom-2026-42 ', 'name' => 'Manual Member',
        ]);
        $member = Member::where('name', 'Manual Member')->firstOrFail();
        $this->assertSame('CUSTOM-2026-42', $member->member_id);

        Livewire::test(Resources\MemberResource\Pages\EditMember::class, ['record' => $member->getRouteKey()])
            ->fillForm(['name' => 'Updated Member'])->call('save')->assertHasNoFormErrors();
        $this->assertSame('CUSTOM-2026-42', $member->fresh()->member_id);

        Livewire::test(Resources\MemberResource\Pages\EditMember::class, ['record' => $member->getRouteKey()])
            ->fillForm(['member_id' => ' replacement-42 '])->call('save')->assertHasNoFormErrors();
        $this->assertSame('REPLACEMENT-42', $member->fresh()->member_id);
        $this->getJson('/api/verify/replacement-42')->assertOk()->assertJsonPath('name', 'Updated Member');
        $this->getJson('/api/verify/CUSTOM-2026-42')->assertNotFound();
    }

    public function test_member_admin_rejects_empty_and_duplicate_member_ids(): void
    {
        $this->create(Resources\MemberResource\Pages\CreateMember::class, [
            'member_id' => 'ASSIGNED-42', 'name' => 'Existing Member',
        ]);
        $this->create(Resources\MemberResource\Pages\CreateMember::class, [
            'member_id' => 'OTHER-43', 'name' => 'Other Member',
        ]);

        Livewire::test(Resources\MemberResource\Pages\CreateMember::class)
            ->fillForm(['member_id' => '   ', 'name' => 'Missing ID'])
            ->call('create')->assertHasFormErrors(['member_id' => 'required']);
        Livewire::test(Resources\MemberResource\Pages\CreateMember::class)
            ->fillForm(['member_id' => ' assigned-42 ', 'name' => 'Duplicate ID'])
            ->call('create')->assertHasFormErrors(['member_id' => 'unique']);

        $other = Member::where('member_id', 'OTHER-43')->firstOrFail();
        Livewire::test(Resources\MemberResource\Pages\EditMember::class, ['record' => $other->getRouteKey()])
            ->fillForm(['member_id' => 'assigned-42'])->call('save')->assertHasFormErrors(['member_id' => 'unique']);
        $this->assertSame('OTHER-43', $other->fresh()->member_id);
        $this->assertDatabaseMissing('members', ['name' => 'Missing ID']);
        $this->assertDatabaseMissing('members', ['name' => 'Duplicate ID']);
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
        $partner = collect($d['partners'])->firstWhere('name', 'Partner Org');
        $this->assertNotNull($partner);
        $this->assertStringStartsWith('http', $partner['logo']);
        $this->assertSame('Big Sponsor', $d['supporters']['sponsors'][0]['name']);
        $this->assertSame('Kind Donor', $d['supporters']['donors'][0]['name']);
        $this->assertSame('Peace Award', $d['awardCategories'][0]['name']);
        $this->getJson('/api/supporters')->assertOk()->assertJsonPath('donors.0.name', 'Kind Donor');
    }

    public function test_public_content_omits_the_office_address_and_map(): void
    {
        Models\Setting::where('key', 'address')->firstOrFail()->update(['value' => 'Private office address']);
        Models\Setting::where('key', 'mapUrl')->firstOrFail()->update(['value' => 'https://maps.google.com/?q=private-office']);

        $response = $this->getJson('/api/content')->assertOk();
        $this->assertArrayNotHasKey('address', $response->json('siteInfo'));
        $this->assertArrayNotHasKey('mapUrl', $response->json('siteInfo'));
        $response->assertDontSee('Private office address')->assertDontSee('private-office');
    }

    public function test_pages_program_details_and_settings(): void
    {
        $page = Page::where('slug', 'who-we-are')->first();
        Livewire::test(Resources\PageResource\Pages\EditPage::class, ['record' => $page->getRouteKey()])
            ->fillForm(['title' => 'About IHRC', 'subtitle' => 'New sub', 'sections' => [['heading' => 'H1', 'body' => 'B1'], ['heading' => 'H2', 'body' => 'B2']]])
            ->call('save')->assertHasNoFormErrors();

        $program = Models\ProgramDetail::where('slug', 'environmental-protection')->firstOrFail();
        Livewire::test(Resources\ProgramDetailResource\Pages\EditProgramDetail::class, ['record' => $program->getRouteKey()])
            ->fillForm(['description' => 'Long text', 'activities' => ['Tree planting', 'Cleanups']])
            ->call('save')->assertHasNoFormErrors();

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
