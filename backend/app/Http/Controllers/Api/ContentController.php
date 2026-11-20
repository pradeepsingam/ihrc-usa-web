<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AwardCategory;
use App\Models\Branch;
use App\Models\Event;
use App\Models\FormDefinition;
use App\Models\Member;
use App\Models\News;
use App\Models\Page;
use App\Models\Partner;
use App\Models\ProgramDetail;
use App\Models\Project;
use App\Models\Publication;
use App\Models\Setting;
use App\Models\Supporter;
use App\Services\FormSpec;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerInterface;

/**
 * Everything the public website shows, in the same shape as src/content.js in the React app.
 */
class ContentController extends Controller
{
    public const CACHE_KEY = 'public-content';

    public function index(): JsonResponse
    {
        return response()->json(Cache::rememberForever(self::CACHE_KEY, fn () => json_decode(json_encode($this->build()), true)))
            ->header('Cache-Control', 'no-cache');
    }

    public function supporters(): JsonResponse
    {
        return response()->json($this->supporterLists());
    }

    protected function build(): array
    {
        $settings = Setting::orderBy('sort')->pluck('value', 'key');
        $siteInfo = ['social' => []];
        foreach ($settings as $key => $value) {
            if ($key !== 'paymentUrl') {
                data_set($siteInfo, $key, (string) $value);
            }
        }

        $date = fn ($d) => $d?->format('Y-m-d');
        $clean = fn (array $a) => array_filter($a, fn ($v) => $v !== null && $v !== '' && $v !== []);

        return [
            'siteInfo' => $siteInfo,
            'paymentUrl' => (string) ($settings['paymentUrl'] ?? ''),

            // Unpublished pages are sent as {published:false} so the website hides its built-in copy too.
            'pages' => Page::orderBy('menu_sort')->get()->mapWithKeys(fn (Page $p) => [$p->slug => $p->is_published ? $clean([
                'title' => $p->title,
                'sub' => (string) $p->subtitle,
                'b' => collect($p->sections ?? [])->map(fn ($s) => [$s['heading'] ?? '', $this->rich($s['body'] ?? '')])->values()->all(),
                'image' => $this->url($p->image),
                'images' => $this->urls($p->images),
                'menu' => $p->menu,
                'menuLabel' => $p->menu_label ?: $p->title,
                'form' => $p->form_slug,
                'published' => true,
            ]) : ['published' => false]]),

            'forms' => FormDefinition::where('is_published', true)->get()->mapWithKeys(fn ($f) => [$f->slug => FormSpec::toWebsite($f)]),

            'news' => $this->list('news'),
            'events' => $this->list('events'),
            'projects' => $this->list('projects'),
            'publications' => $this->list('publications'),

            'partners' => Partner::orderBy('sort')->get()->map(fn (Partner $p) => $clean([
                'name' => $p->name, 'logo' => $this->url($p->logo), 'category' => $p->category,
                'description' => $p->description, 'website' => $p->website,
            ])),

            'awardCategories' => AwardCategory::orderBy('sort')->get(['name', 'description']),

            'branches' => Branch::orderBy('sort')->orderBy('country')->get()->map(fn (Branch $b) => $clean([
                'id' => (string) $b->id, 'country' => $b->country, 'name' => $b->name,
                'representative' => $b->representative, 'designation' => $b->designation, 'email' => $b->email,
                'phone' => $b->phone, 'location' => $b->location, 'activities' => $b->activities,
            ])),

            // keyed "<group>-<seat>", e.g. "leadership-1" — same ids the React app uses
            'leaders' => Member::where('show_on_site', true)->whereNotNull('group')->whereNotNull('position')->whereIn('status', ['Active', 'Pending'])->get()->mapWithKeys(fn (Member $m) => [$m->group.'-'.$m->position => $clean([
                'name' => $m->name, 'photo' => $m->photo_public ? $this->url($m->photo) : null, 'bio' => $m->bio, 'memberId' => $m->member_id,
                'responsibilities' => $m->responsibilities,
            ])]),

            'programDetails' => ProgramDetail::all()->mapWithKeys(fn (ProgramDetail $p) => [$p->slug => $clean([
                'description' => $p->description, 'location' => $p->location, 'date' => $date($p->date),
                'activities' => array_values(array_filter($p->activities ?? [])), 'images' => $this->urls($p->images),
            ])]),

            'supporters' => $this->supporterLists(),
        ];
    }

    // ---------------------------------------------------------------- public lists (requirements 4.5)

    /** GET /api/{type} — published items, newest first. */
    public function listing(string $type): JsonResponse
    {
        return response()->json($this->list($type));
    }

    /** GET /api/{type}/{id} — one published item (id = web address slug, or number for publications). */
    public function show(string $type, string $id): JsonResponse
    {
        $item = collect($this->list($type))->firstWhere('id', $id);

        return $item ? response()->json($item) : response()->json(['message' => 'Not found.'], 404);
    }

    protected function list(string $type): array
    {
        $date = fn ($d) => $d?->format('Y-m-d');
        $clean = fn (array $a) => array_filter($a, fn ($v) => $v !== null && $v !== '' && $v !== []);

        return match ($type) {
            'news' => News::where('is_published', true)->orderByDesc('date')->orderByDesc('id')->get()->map(fn (News $n) => $clean([
                'id' => $n->slug, 'title' => $n->title, 'type' => $n->type, 'date' => $date($n->date),
                'summary' => $n->summary, 'body' => $this->rich($n->body), 'image' => $this->url($n->image),
                'program' => $n->program, 'category' => $n->category,
            ]))->all(),
            'events' => Event::where('is_published', true)->orderByDesc('date')->orderByDesc('id')->get()->map(fn (Event $e) => $clean([
                'id' => $e->slug, 'title' => $e->title, 'date' => $date($e->date), 'endDate' => $date($e->end_date),
                'location' => $e->location, 'description' => $e->description, 'body' => $this->rich($e->body),
                'image' => $this->url($e->image), 'images' => $this->urls($e->images),
                'program' => $e->program, 'category' => $e->category,
            ]) + ['registration' => (bool) $e->registration_open])->all(),
            'projects' => Project::where('is_published', true)->orderByDesc('date')->orderByDesc('id')->get()->map(fn (Project $p) => $clean([
                'id' => $p->slug, 'title' => $p->title, 'date' => $date($p->date), 'status' => $p->status,
                'location' => $p->location, 'summary' => $p->summary, 'body' => $this->rich($p->body),
                'image' => $this->url($p->image), 'images' => $this->urls($p->images), 'file' => $this->url($p->file),
                'program' => $p->program, 'category' => $p->category,
            ]))->all(),
            'publications' => Publication::where('is_published', true)->orderByDesc('date')->orderByDesc('id')->get()->map(fn (Publication $p) => $clean([
                'id' => (string) $p->id, 'title' => $p->title, 'category' => $p->category,
                'year' => $p->year ?: $p->date?->format('Y'), 'date' => $date($p->date),
                'description' => $p->description, 'file' => $this->url($p->file), 'cover' => $this->url($p->cover_image),
            ]))->all(),
            default => abort(404),
        };
    }

    /** Rich-text (HTML) from the admin editor, cleaned of anything unsafe. Plain text is left as it is. */
    protected function rich(mixed $html): mixed
    {
        if (! is_string($html) || $html === null || $html === '' || ! preg_match('/<[a-z][\s\S]*>/i', $html)) {
            return $html;
        }

        return app(HtmlSanitizerInterface::class)->sanitize($html);
    }

    protected function supporterLists(): array
    {
        $all = Supporter::orderBy('sort')->get();
        $map = fn ($s) => array_filter([
            'name' => $s->name, 'logo' => $this->url($s->logo), 'details' => $s->details, 'url' => $s->url,
        ]);

        return [
            'donors' => $all->where('type', 'donor')->map($map)->values(),
            'sponsors' => $all->where('type', 'sponsor')->map($map)->values(),
        ];
    }

    protected function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $u = preg_match('#^(https?:)?//|^/#', $path) ? $path : Storage::disk('public')->url($path);

        // The website runs on another domain, so links must be absolute.
        return str_starts_with($u, '/') && ! str_starts_with($u, '//') ? url($u) : $u;
    }

    protected function urls(?array $paths): array
    {
        return array_values(array_filter(array_map(fn ($p) => $this->url($p), $paths ?? [])));
    }
}
