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
            'pages' => Page::orderBy('menu_sort')->get()->mapWithKeys(fn (Page $p) => [$p->slug => $this->item($p)]),

            'forms' => FormDefinition::where('is_published', true)->get()->mapWithKeys(fn ($f) => [$f->slug => $this->item($f)]),

            'news' => $this->list('news'),
            'events' => $this->list('events'),
            'projects' => $this->list('projects'),
            'publications' => $this->list('publications'),

            'partners' => Partner::orderBy('sort')->get()->map(fn (Partner $p) => $clean([
                'name' => $p->name, 'logo' => $this->url($p->logo), 'category' => $p->category,
                'description' => $p->description, 'website' => $p->website,
            ])),

            'awardCategories' => AwardCategory::orderBy('sort')->get()->map(fn (AwardCategory $a) => $clean(['name' => $a->name, 'description' => $a->description, 'image' => $this->url($a->image)]))->values(),

            'branches' => Branch::orderBy('sort')->orderBy('country')->get()->map(fn (Branch $b) => $clean([
                'id' => (string) $b->id, 'country' => $b->country, 'name' => $b->name,
                'representative' => $b->representative, 'designation' => $b->designation, 'email' => $b->email,
                'phone' => $b->phone, 'location' => $b->location, 'activities' => $b->activities,
            ])),

            // People shown on the website's Members pages, per page (any number per role).
            'people' => Member::where('show_on_site', true)->whereNotNull('group')->whereIn('status', ['Active', 'Pending'])
                ->orderByRaw('position is null')->orderBy('position')->orderBy('name')->get()
                ->groupBy('group')->map(fn ($list) => $list->map(fn (Member $m) => $clean([
                    'id' => $m->member_id ?: 'member-'.$m->id, 'name' => $m->name, 'role' => $m->public_role ?: $m->title,
                    'photo' => $m->photo_public ? $this->url($m->photo) : null, 'country' => $m->country,
                    'bio' => $m->bio, 'responsibilities' => $m->responsibilities,
                ]))->values()),

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
        $model = match ($type) {
            'news' => News::class, 'events' => Event::class, 'projects' => Project::class, 'publications' => Publication::class,
            default => abort(404),
        };

        return $model::where('is_published', true)->orderByDesc('date')->orderByDesc('id')->get()
            ->map(fn ($item) => $this->item($item))->all();
    }

    /** One item exactly as the website receives it (also used for admin previews of unsaved changes). */
    public function item(\Illuminate\Database\Eloquent\Model $m): array
    {
        $date = fn ($d) => $d?->format('Y-m-d');
        $clean = fn (array $a) => array_filter($a, fn ($v) => $v !== null && $v !== '' && $v !== []);

        return match (true) {
            $m instanceof News => $clean([
                'id' => $m->slug, 'title' => $m->title, 'type' => $m->type, 'date' => $date($m->date),
                'summary' => $m->summary, 'body' => $this->rich($m->body), 'image' => $this->url($m->image),
                'program' => $m->program, 'category' => $m->category,
            ]),
            $m instanceof Event => $clean([
                'id' => $m->slug, 'title' => $m->title, 'date' => $date($m->date), 'endDate' => $date($m->end_date),
                'location' => $m->location, 'description' => $m->description, 'body' => $this->rich($m->body),
                'image' => $this->url($m->image), 'images' => $this->urls($m->images),
                'program' => $m->program, 'category' => $m->category,
            ]) + ['registration' => (bool) ($m->registration_open ?? true)],
            $m instanceof Project => $clean([
                'id' => $m->slug, 'title' => $m->title, 'date' => $date($m->date), 'status' => $m->status,
                'location' => $m->location, 'summary' => $m->summary, 'body' => $this->rich($m->body),
                'image' => $this->url($m->image), 'images' => $this->urls($m->images), 'file' => $this->url($m->file),
                'program' => $m->program, 'category' => $m->category,
            ]),
            $m instanceof Publication => $clean([
                'id' => (string) $m->id, 'title' => $m->title, 'category' => $m->category,
                'year' => $m->year ?: $m->date?->format('Y'), 'date' => $date($m->date),
                'description' => $m->description, 'file' => $this->url($m->file), 'cover' => $this->url($m->cover_image),
            ]) + ['download' => (bool) ($m->allow_download ?? true)],
            $m instanceof Page => $m->is_published ? $clean([
                'title' => $m->title,
                'sub' => (string) $m->subtitle,
                'b' => collect($m->sections ?? [])->map(fn ($s) => [$s['heading'] ?? '', $this->rich($s['body'] ?? '')])->values()->all(),
                'image' => $this->url($m->image),
                'images' => $this->urls($m->images),
                'menu' => $m->menu,
                'menuLabel' => $m->menu_label ?: $m->title,
                'form' => $m->form_slug,
                'published' => true,
            ]) : ['published' => false],
            $m instanceof FormDefinition => FormSpec::toWebsite($m),
        };
    }

    /** Rich-text (HTML) from the admin editor, cleaned of anything unsafe. Plain text is left as it is. */
    public function rich(mixed $html): mixed
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

    public function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $u = preg_match('#^(https?:)?//|^/#', $path) ? $path : Storage::disk('public')->url($path);

        // The website runs on another domain, so links must be absolute.
        return str_starts_with($u, '/') && ! str_starts_with($u, '//') ? url($u) : $u;
    }

    public function urls(?array $paths): array
    {
        return array_values(array_filter(array_map(fn ($p) => $this->url($p), $paths ?? [])));
    }
}
