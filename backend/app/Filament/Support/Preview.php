<?php

namespace App\Filament\Support;

use App\Http\Controllers\Api\ContentController;
use App\Models\Event;
use App\Models\FormDefinition;
use App\Models\News;
use App\Models\Page;
use App\Models\Project;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor\RichContentRenderer;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

/**
 * "Preview" button on the edit screens: shows the real website page with the unsaved changes.
 * The current form values are turned into the same JSON the website reads, kept for 30 minutes
 * under a random token, and the website's /preview/<token> page displays them.
 */
class Preview
{
    public const TYPES = [
        News::class => 'news', Event::class => 'event', Project::class => 'project',
        Page::class => 'page', FormDefinition::class => 'form',
    ];

    public static function action(): Action
    {
        return Action::make('preview')->label('Preview')->icon(Heroicon::Eye)->color('gray')
            ->visible(fn () => filled(config('app.frontend_url')))
            ->modalHeading('Preview – how it will look on the website (not saved yet)')
            ->modalWidth(Width::SevenExtraLarge)
            ->modalSubmitAction(false)->modalCancelActionLabel('Close preview')
            ->modalContent(fn ($livewire) => view('filament.preview', ['url' => static::url($livewire)]));
    }

    public static function url($livewire): string
    {
        $modelClass = $livewire->getResource()::getModel();
        $record = method_exists($livewire, 'getRecord') ? $livewire->getRecord() : null;
        $data = static::clean($livewire->data ?? []);

        $model = $record ? (clone $record) : new $modelClass;
        $model->forceFill(collect($data)->only(array_merge($model->getFillable(), array_keys($data)))->all());
        $model->slug ??= Str::slug((string) ($model->title ?? 'preview')) ?: 'preview';
        if ($model instanceof Page) {
            $model->is_published = true;
        }

        $token = Str::random(40);
        Cache::put('preview:'.$token, [
            'type' => self::TYPES[$modelClass] ?? 'news',
            'item' => json_decode(json_encode(app(ContentController::class)->item($model)), true),
        ], now()->addMinutes(30));

        return rtrim((string) config('app.frontend_url'), '/').'/preview/'.$token;
    }

    /** Raw Livewire form state → plain values: uploads become paths/URLs, rich text becomes HTML, lists lose their keys. */
    protected static function clean(mixed $value, ?string $key = null): mixed
    {
        if ($value instanceof TemporaryUploadedFile) {
            return rescue(fn () => $value->temporaryUrl(), null, false);
        }
        if (! is_array($value)) {
            return $value;
        }
        // Rich editor content (TipTap document)
        if (($value['type'] ?? null) === 'doc' && array_key_exists('content', $value)) {
            return RichContentRenderer::make($value)->toHtml();
        }
        $isUploadList = in_array($key, ['image', 'photo', 'logo', 'cover_image', 'file'], true);
        $out = [];
        foreach ($value as $k => $v) {
            $out[$k] = static::clean($v, is_string($k) && ! Str::isUuid($k) ? $k : $key);
        }
        // Repeaters, builders and uploads are keyed by random ids; the website needs plain lists.
        if ($out && collect(array_keys($out))->every(fn ($k) => is_string($k) && Str::isUuid($k))) {
            $out = array_values($out);
        }
        if ($isUploadList) {
            return array_values(array_filter($out))[0] ?? null;
        }

        return $out;
    }
}
