<?php

namespace Tests\Feature;

use App\Filament\Resources;
use App\Mail\NewsletterMail;
use App\Mail\SubmissionConfirmation;
use App\Mail\SubmissionReceived;
use App\Mail\SubscribeConfirmation;
use App\Models;
use App\Models\FormSubmission;
use App\Models\Member;
use App\Models\Setting;
use App\Models\Subscriber;
use App\Models\User;
use App\Services\MemberFromSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

/** One test (or more) per item of "IHRC Backend Admin Requirements v2". */
class RequirementsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        Storage::fake('local');
        Mail::fake();
        $this->seed();
    }

    protected function admin(string $role = User::SUPER_ADMIN): User
    {
        return User::factory()->create(['role' => $role]);
    }

    protected function setMailbox(string $box, string $email): void
    {
        Setting::where('key', 'mailbox.'.$box)->update(['value' => $email]);
    }

    /** A complete, valid volunteer application exactly as the website sends it. */
    protected function volunteerAnswers(): array
    {
        $spec = \App\Services\FormSpec::toWebsite(Models\FormDefinition::where('slug', 'volunteer')->first());
        $data = [];
        foreach (collect($spec['sections'])->flatMap(fn ($s) => $s['blocks']) as $b) {
            if (in_array($b['t'], ['info', 'file'])) {
                continue;
            }
            $key = \App\Services\FormSpec::answerKey($b);
            $data[$key] = match (true) {
                isset($b['mustAgree']) => $b['mustAgree'],
                $b['t'] === 'email' => 'ann@example.org',
                $b['t'] === 'date' => 'January 15, 1990',
                isset($b['opts']) => $b['opts'][0],
                $b['t'] === 'agree' => 'All statements accepted',
                default => 'Answer',
            };
        }
        $data['1. Full Name'] = 'Ann Perera';
        $data['5. Country of Residence'] = 'Sri Lanka';
        $data['15. Previous Human Rights Experience?'] = 'No';

        return $data;
    }

    protected function volunteerFiles(): array
    {
        return [
            'photo' => UploadedFile::fake()->image('photo.jpg', 100, 100)->size(200),
            'idDoc' => UploadedFile::fake()->create('id.pdf', 100, 'application/pdf'),
            'cv' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        ];
    }

    // ---------------------------------------------------------------- 3.2 / 3.3 forms workflow

    public function test_form_is_routed_to_its_mailbox_with_reference_and_auto_reply(): void
    {
        $this->setMailbox('complaints', 'complaints@ihrc.test');
        $this->setMailbox('info', 'info@ihrc.test');

        $r = $this->postJson('/api/forms', ['form' => 'Complaint Submission', 'subject' => 'Complaint – A', 'data' => ['Section A · 6. Email Address' => 'victim@example.org', 'Text' => 'x']])
            ->assertCreated()->json();

        $this->assertMatchesRegularExpression('/^IHRC-\d{4}-\d{6}$/', $r['reference']);
        $s = FormSubmission::first();
        $this->assertSame('complaints', $s->mailbox);
        $this->assertSame('New', $s->status);
        Mail::assertSent(SubmissionReceived::class, fn ($m) => $m->hasTo('complaints@ihrc.test') && $m->submission->is($s));
        Mail::assertSent(SubmissionConfirmation::class, fn ($m) => $m->hasTo('victim@example.org') && $m->hasReplyTo('complaints@ihrc.test'));
        Mail::assertSent(SubmissionReceived::class, fn ($m) => $m->hasReplyTo('victim@example.org'));
        $this->assertNotNull($s->fresh()->mailed_at);
    }

    public function test_every_website_form_maps_to_the_right_mailbox(): void
    {
        $expect = [
            'Membership Registration' => 'membership', 'Volunteer Registration' => 'volunteer', 'Researchers Application' => 'research',
            'Event Registration: Human Rights Day' => 'event', 'Award Nomination' => 'award', 'Complaint Submission' => 'complaints',
            'CSO Partnership' => 'partnership', 'Donation Details' => 'official', 'Sponsor Registration Form' => 'official',
            'IHRC-USA Website Enquiry' => 'info', 'IHRC-USA Accreditation & Recognition Application — Form IHRC-USA/ACC/001' => 'accreditation',
        ];
        foreach ($expect as $form => $box) {
            $this->assertSame($box, \App\Support\Mailboxes::keyFor($form), $form);
        }
    }

    public function test_mailboxes_default_to_ihrc_usa_org(): void
    {
        foreach (\App\Support\Mailboxes::BOXES as $box => $label) {
            $this->assertSame($box.'@ihrc-usa.org', \App\Support\Mailboxes::address($box));
        }
    }

    public function test_mailbox_falls_back_to_info_then_contact_email(): void
    {
        Setting::where('key', 'like', 'mailbox.%')->update(['value' => null]);
        $this->assertSame('info@gmail.com', \App\Support\Mailboxes::address('award')); // site contact email
        $this->setMailbox('info', 'info@ihrc.test');
        $this->assertSame('info@ihrc.test', \App\Support\Mailboxes::address('award'));
        $this->setMailbox('award', 'award@ihrc.test');
        $this->assertSame('award@ihrc.test', \App\Support\Mailboxes::address('award'));
    }

    public function test_builder_forms_check_required_fields_and_file_rules(): void
    {
        $data = $this->volunteerAnswers();

        // Missing required answer
        $missing = $data;
        unset($missing['1. Full Name']);
        $this->post('/api/forms', ['form' => 'Volunteer Registration', 'data' => json_encode($missing)] + $this->volunteerFiles(), ['Accept' => 'application/json'])
            ->assertStatus(422)->assertJsonPath('message', 'Please answer: Full Name');

        // Must-agree answer not accepted
        $disagree = $data;
        $disagree['24. Members Restrictions & Regulations'] = 'I disagree';
        $this->post('/api/forms', ['form' => 'Volunteer Registration', 'data' => json_encode($disagree)] + $this->volunteerFiles(), ['Accept' => 'application/json'])
            ->assertStatus(422);

        // Photo over its 1 MB limit
        $files = $this->volunteerFiles();
        $files['photo'] = UploadedFile::fake()->image('big.jpg')->size(1500);
        $this->post('/api/forms', ['form' => 'Volunteer Registration', 'data' => json_encode($data)] + $files, ['Accept' => 'application/json'])
            ->assertStatus(422)->assertJsonFragment(['message' => 'Photograph (35x45mm or 3.5x4cm): file is larger than 1 MB']);

        // Missing required upload
        $files = $this->volunteerFiles();
        unset($files['cv']);
        $this->post('/api/forms', ['form' => 'Volunteer Registration', 'data' => json_encode($data)] + $files, ['Accept' => 'application/json'])
            ->assertStatus(422);

        // Conditional field not shown → not required; everything valid → accepted
        $this->post('/api/forms', ['form' => 'Volunteer Registration', 'data' => json_encode($data)] + $this->volunteerFiles(), ['Accept' => 'application/json'])
            ->assertCreated();
        $this->assertSame(1, FormSubmission::count());
    }

    public function test_spam_honeypot_links_and_bad_email_are_blocked(): void
    {
        $this->postJson('/api/forms', ['form' => 'Contact', 'data' => ['Message' => 'hi'], '_hp' => 'http://spam'])->assertCreated();
        $this->postJson('/api/forms', ['form' => 'Contact', 'data' => ['Message' => str_repeat('http://x.y ', 9)]])->assertStatus(422);
        $this->postJson('/api/forms', ['form' => 'Contact', 'data' => ['Email' => 'not@valid']])->assertStatus(422);
        $this->assertSame(0, FormSubmission::count());
    }

    public function test_uploads_are_virus_scanned_when_a_scanner_is_configured(): void
    {
        config(['services.virus_scan.command' => "sh -c 'exit 1' --"]); // scanner reports "infected"
        $this->post('/api/forms', ['form' => 'Contact', 'data' => '{"a":"b"}', 'cv' => UploadedFile::fake()->create('cv.pdf', 10)], ['Accept' => 'application/json'])
            ->assertStatus(422)->assertJsonFragment(['message' => "The file for 'cv' was rejected by the virus scanner."]);
        $this->assertSame([], Storage::disk('local')->allFiles('submissions'));

        config(['services.virus_scan.command' => 'true']); // clean
        $this->post('/api/forms', ['form' => 'Contact', 'data' => '{"a":"b"}', 'cv' => UploadedFile::fake()->create('cv.pdf', 10)], ['Accept' => 'application/json'])->assertCreated();
        $this->assertSame('clean', FormSubmission::first()->files['cv']['scan']);
    }

    // ---------------------------------------------------------------- 4.1 roles, log

    public function test_roles_limit_what_each_admin_can_do(): void
    {
        FormSubmission::create(['form' => 'Complaint Submission', 'data' => ['a' => 'b']]);
        FormSubmission::create(['form' => 'Membership Registration', 'data' => ['a' => 'b']]);

        $editor = $this->admin(User::EDITOR);
        $this->actingAs($editor)->get('/admin/news/create')->assertOk();
        $this->get('/admin/form-submissions')->assertForbidden();
        $this->get('/admin/members')->assertForbidden();
        $this->get('/admin/settings')->assertForbidden();
        $this->get('/admin/admin-users')->assertForbidden();

        $officer = $this->admin(User::MEMBERSHIP_OFFICER);
        $this->actingAs($officer)->get('/admin/members/create')->assertOk();
        $this->get('/admin/news')->assertForbidden();
        $this->get('/admin/form-submissions')->assertOk()->assertSee('Membership Registration')->assertDontSee('Complaint Submission');
        $complaint = FormSubmission::where('form', 'Complaint Submission')->first();
        $this->get('/admin/form-submissions/'.$complaint->id)->assertNotFound();

        $viewer = $this->admin(User::VIEWER);
        $this->actingAs($viewer)->get('/admin/form-submissions/'.$complaint->id)->assertOk();
        $this->assertFalse($viewer->can('update', $complaint));
        $this->get('/admin/news')->assertForbidden();
        $this->get('/admin/activity-log')->assertOk();

        $super = $this->admin();
        $this->assertTrue($super->can('delete', $complaint));
        $this->assertFalse($super->can('delete', new Models\ActivityLog), 'nobody can edit the activity log');
    }

    public function test_activity_log_records_who_changed_what(): void
    {
        $this->actingAs($editor = $this->admin(User::EDITOR));
        $n = Models\News::create(['title' => 'Hello', 'date' => '2026-01-01']);
        $n->update(['title' => 'Hello world']);
        $n->delete();

        $log = Models\ActivityLog::where('subject_type', 'News')->orderBy('id')->get();
        $this->assertSame(['created', 'updated', 'deleted'], $log->pluck('action')->all());
        $this->assertSame($editor->id, $log[1]->user_id);
        $this->assertSame(['from' => 'Hello', 'to' => 'Hello world'], $log[1]->changes['title']);
    }

    public function test_password_reset_and_two_factor_are_available(): void
    {
        $this->get('/admin/password-reset/request')->assertOk();
        $this->assertTrue(filament()->getPanel('admin')->hasMultiFactorAuthentication());
        $this->assertSame(60, (int) config('session.lifetime'));
    }

    // ---------------------------------------------------------------- 4.2 inbox

    public function test_inbox_status_notes_approval_and_exports(): void
    {
        $this->actingAs($this->admin(User::MEMBERSHIP_OFFICER));
        $this->post('/api/forms', ['form' => 'Volunteer Registration', 'subject' => 'Volunteer – Ann', 'data' => json_encode($this->volunteerAnswers())] + $this->volunteerFiles(), ['Accept' => 'application/json'])->assertCreated();
        $s = FormSubmission::first();

        Livewire::test(Resources\FormSubmissionResource\Pages\ViewFormSubmission::class, ['record' => $s->id])
            ->callAction('status', ['status' => 'In review', 'note' => 'Checking references'])
            ->callAction('approve', ['note' => 'Welcome']);

        $s->refresh();
        $this->assertSame('Approved', $s->status);
        $this->assertStringContainsString('Checking references', $s->notes);
        $m = Member::find($s->member_id);
        $this->assertSame('Ann Perera', $m->name);
        $this->assertSame('Active', $m->status);
        $this->assertSame('Sri Lanka', $m->country);
        $this->assertSame('1990-01-15', $m->date_of_birth->toDateString());
        $this->assertNull($m->email, 'the Volunteer form has no email question');
        $this->assertSame('Answer', $m->phone);
        $this->assertMatchesRegularExpression('/^IHRC-M-\d{5}$/', $m->member_id);
        Storage::disk('public')->assertExists($m->photo);
        Storage::disk('local')->assertExists($m->cv);

        // PDF and CSV
        $pdf = Livewire::test(Resources\FormSubmissionResource\Pages\ViewFormSubmission::class, ['record' => $s->id])->callAction('pdf');
        $pdf->assertFileDownloaded($s->reference.'.pdf');
        Livewire::test(Resources\FormSubmissionResource\Pages\ListFormSubmission::class)
            ->filterTable('status', 'Approved')->assertCanSeeTableRecords([$s])
            ->callTableAction('exportCsv')->assertFileDownloaded();
    }

    public function test_reject_and_event_registrations(): void
    {
        $this->actingAs($this->admin());
        $e = Models\Event::create(['title' => 'Human Rights Day', 'date' => now()->addMonth()]);
        $this->postJson('/api/forms', ['form' => 'Event Registration', 'data' => ['Event' => 'Human Rights Day', 'Full name' => 'Bo', 'Email' => 'bo@example.org']])->assertCreated();
        $s = FormSubmission::first();
        $this->assertSame($e->id, $s->event_id);
        $this->assertSame(1, $e->registrations()->count());

        Livewire::test(Resources\FormSubmissionResource\Pages\ViewFormSubmission::class, ['record' => $s->id])->callAction('reject', ['note' => 'Event full']);
        $this->assertSame('Rejected', $s->fresh()->status);
        $this->get('/admin/events/'.$e->id.'/edit')->assertOk()->assertSee('Registrations');
    }

    // ---------------------------------------------------------------- 4.4 members

    public function test_member_csv_import_export_and_public_verify(): void
    {
        $this->actingAs($this->admin(User::MEMBERSHIP_OFFICER));
        $csv = "name,email,title,country,status,expires_at\nKala Devi,kala@example.org,Ambassador,Sri Lanka,Active,2027-12-31\n,missing@example.org,,,,\nRavi,ravi@example.org,Member,India,suspended,\n";
        Storage::disk('local')->put('imports/m.csv', $csv);
        \App\Filament\Resources\MemberResource::importCsv('imports/m.csv');
        $this->assertSame(2, Member::count());
        $kala = Member::firstWhere('email', 'kala@example.org');
        $this->assertSame('2027-12-31', $kala->expires_at->toDateString());
        $this->assertSame('Suspended', Member::firstWhere('email', 'ravi@example.org')->status);

        // Re-import updates instead of duplicating
        Storage::disk('local')->put('imports/m2.csv', "member_id,name,city\n{$kala->member_id},Kala Devi,Colombo\n");
        \App\Filament\Resources\MemberResource::importCsv('imports/m2.csv');
        $this->assertSame(2, Member::count());
        $this->assertSame('Colombo', $kala->fresh()->city);

        Livewire::test(Resources\MemberResource\Pages\ListMember::class)->callTableAction('export')->assertFileDownloaded();

        // Public verification: only name, title, country, status, photo
        $res = $this->getJson('/api/verify/'.strtolower($kala->member_id))->assertOk()->json();
        $this->assertSame(['found', 'memberId', 'name', 'title', 'country', 'status', 'photo'], array_keys($res));
        $this->assertSame('Kala Devi', $res['name']);
        $this->getJson('/api/verify/IHRC-M-99999')->assertNotFound();
    }

    // ---------------------------------------------------------------- 4.5 content

    public function test_public_lists_rich_text_registration_switch_and_publication_cover(): void
    {
        Models\News::create(['title' => 'Old', 'date' => '2025-01-01', 'body' => '<p>Hi <script>alert(1)</script><strong>bold</strong></p>']);
        Models\News::create(['title' => 'New', 'date' => '2026-01-01']);
        Models\News::create(['title' => 'Hidden', 'date' => '2026-06-01', 'is_published' => false]);
        Models\Event::create(['title' => 'Closed', 'date' => now()->addMonth(), 'registration_open' => false]);
        Models\Publication::create(['title' => 'Report', 'category' => 'Annual Reports', 'file' => 'p.pdf', 'date' => '2026-03-01', 'cover_image' => 'c.jpg']);

        $this->getJson('/api/news')->assertOk()->assertJsonCount(2)->assertJsonPath('0.title', 'New');
        $old = $this->getJson('/api/news/old')->assertOk()->json();
        $this->assertStringNotContainsString('<script', $old['body']);
        $this->assertStringContainsString('<strong>bold</strong>', $old['body']);
        $this->getJson('/api/news/hidden')->assertNotFound();
        $this->getJson('/api/events')->assertJsonPath('0.registration', false);
        $pub = $this->getJson('/api/publications')->json()[0];
        $this->assertSame('2026', $pub['year']);
        $this->assertStringEndsWith('/storage/c.jpg', $pub['cover']);
    }

    // ---------------------------------------------------------------- 4.2 page builder / 4.3 form builder

    public function test_page_builder_creates_menu_pages_and_unpublishes(): void
    {
        $this->actingAs($this->admin(User::EDITOR));
        Livewire::test(Resources\PageResource\Pages\CreatePage::class)->fillForm([
            'title' => 'Annual Report 2026', 'slug' => 'annual-report-2026', 'subtitle' => 'Our year',
            'sections' => [['heading' => 'Summary', 'body' => '<p>Great year</p>']],
            'menu' => 'About', 'menu_label' => 'Annual Report', 'is_published' => true, 'form_slug' => 'volunteer',
        ])->call('create')->assertHasNoFormErrors();

        Livewire::test(Resources\PageResource\Pages\CreatePage::class)->fillForm(['title' => 'X', 'slug' => 'news', 'sections' => [['heading' => 'a', 'body' => 'b']]])
            ->call('create')->assertHasFormErrors(['slug']);

        Models\Page::where('slug', 'refund')->first()->update(['is_published' => false]);

        $pages = $this->getJson('/api/content')->json('pages');
        $this->assertSame('About', $pages['annual-report-2026']['menu']);
        $this->assertSame('Annual Report', $pages['annual-report-2026']['menuLabel']);
        $this->assertSame('volunteer', $pages['annual-report-2026']['form']);
        $this->assertSame(['published' => false], $pages['refund']);
    }

    public function test_form_builder_creates_a_form_the_website_can_render_and_the_backend_checks(): void
    {
        $this->actingAs($this->admin());
        Livewire::test(Resources\FormDefinitionResource\Pages\CreateFormDefinition::class)->fillForm([
            'title' => 'Workshop Sign-up', 'slug' => 'workshop', 'name' => 'Workshop Sign-up', 'mailbox' => 'event', 'is_published' => true,
            'intro' => ['Join our workshop.'],
            'sections' => [['title' => 'You', 'blocks' => [
                ['type' => 'field', 'data' => ['kind' => 'text', 'label' => 'Full name', 'req' => true]],
                ['type' => 'choice', 'data' => ['kind' => 'radio', 'label' => 'Attending online?', 'id' => 'online', 'opts' => ['Yes', 'No'], 'req' => true]],
                ['type' => 'field', 'data' => ['kind' => 'email', 'label' => 'Email for the link', 'req' => true, 'show_if_id' => 'online', 'show_if_eq' => 'Yes']],
                ['type' => 'file', 'data' => ['label' => 'Certificate', 'id' => 'cert', 'kinds' => ['pdf'], 'max_mb' => 2]],
                ['type' => 'agree', 'data' => ['label' => 'Declaration', 'items' => "I confirm\nI agree to the rules", 'req' => true]],
                ['type' => 'table', 'data' => ['label' => 'Education', 'cols' => ['Degree', 'Year'], 'rows' => 2]],
            ]]],
        ])->call('create')->assertHasNoFormErrors();

        $form = $this->getJson('/api/content')->json('forms.workshop');
        $this->assertSame('Workshop Sign-up', $form['name']);
        $this->assertSame(['text', 'radio', 'email', 'file', 'agree', 'table'], array_column($form['sections'][0]['blocks'], 't'));
        $this->assertSame(['id' => 'online', 'eq' => 'Yes'], $form['sections'][0]['blocks'][2]['showIf']);
        $this->assertSame(['I confirm', 'I agree to the rules'], $form['sections'][0]['blocks'][4]['items']);
        $this->assertSame(['kinds' => ['pdf'], 'maxMB' => 2], $form['sections'][0]['blocks'][3]['file']);

        $base = ['Full name' => 'Ann', 'Declaration' => 'All statements accepted'];
        $this->postJson('/api/forms', ['form' => 'Workshop Sign-up', 'data' => $base + ['Attending online?' => 'No']])->assertCreated();
        $this->postJson('/api/forms', ['form' => 'Workshop Sign-up', 'data' => $base + ['Attending online?' => 'Yes']])->assertStatus(422); // email now required
        $this->assertSame('event', FormSubmission::first()->mailbox);
    }

    // ---------------------------------------------------------------- 4.6 newsletter

    public function test_subscribe_double_opt_in_unsubscribe_and_send(): void
    {
        $this->postJson('/api/subscribe', ['email' => 'Reader@Example.org', 'name' => 'Reader'])->assertCreated();
        $s = Subscriber::first();
        $this->assertSame('reader@example.org', $s->email);
        $this->assertFalse($s->isActive());
        Mail::assertSent(SubscribeConfirmation::class, fn ($m) => $m->hasTo('reader@example.org'));

        $this->get('/api/subscribe/confirm/'.$s->token)->assertOk()->assertSee('Subscription confirmed');
        $this->assertTrue($s->fresh()->isActive());
        $this->postJson('/api/subscribe', ['email' => 'reader@example.org'])->assertStatus(409);
        $this->postJson('/api/subscribe', ['email' => 'nope'])->assertStatus(422);

        $this->actingAs($this->admin(User::EDITOR));
        $n = Models\Newsletter::create(['subject' => 'November news', 'body' => '<p>Hello</p>']);
        Livewire::test(Resources\NewsletterResource\Pages\EditNewsletter::class, ['record' => $n->id])->callAction('send');
        Mail::assertQueued(NewsletterMail::class, fn ($m) => $m->hasTo('reader@example.org'));
        $this->assertSame(1, $n->fresh()->sent_count);
        $html = (new NewsletterMail($n, $s))->render();
        $this->assertStringContainsString(route('unsubscribe', $s->token), $html);

        $this->get('/api/unsubscribe/'.$s->token)->assertOk();
        $this->assertFalse($s->fresh()->isActive());
    }

    public function test_mail_test_command_and_admin_button(): void
    {
        $this->artisan('mail:test', ['to' => 'me@example.org'])->assertSuccessful();
        $this->actingAs($this->admin());
        Livewire::test(Resources\SettingResource\Pages\ListSetting::class)->callTableAction('testEmail', data: ['to' => 'me@example.org'])->assertNotified();
        $this->actingAs($this->admin(User::EDITOR))->get('/admin/settings')->assertForbidden();
    }

    // ---------------------------------------------------------------- dashboard

    public function test_dashboard_shows_counts(): void
    {
        FormSubmission::create(['form' => 'Contact', 'data' => ['a' => 'b'], 'submitted_at' => now()]);
        Member::create(['name' => 'A', 'status' => 'Active']);
        $this->actingAs($this->admin())->get('/admin')->assertOk();
        Livewire::test(\App\Filament\Widgets\StatsOverview::class)->assertSee('New submissions')->assertSee('Active members')->assertSee('Subscribers');
        Livewire::test(\App\Filament\Widgets\LatestSubmissions::class)->assertSee('Contact');
        Livewire::test(\App\Filament\Widgets\LatestActivity::class)->assertOk();
    }
}
