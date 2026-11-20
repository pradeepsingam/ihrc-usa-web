<?php

namespace App\Services;

use App\Models\FormDefinition;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * Converts forms between the admin Form Builder format and the structure the website's
 * RegistrationForm component understands (src/components/RegistrationForm.jsx), and checks
 * submitted answers against a form.
 *
 * Website block:  {t, id, n, label, hint, lines, req, opts, other, mustAgree, showIf:{id,eq},
 *                  file:{kinds,maxMB}, notes, payOnline, items, cols, rows, rowLabels, rowHead, cellOpts}
 * Builder block:  {type: field|choice|file|agree|table|info, data: {...}}
 */
class FormSpec
{
    public const EXT = [
        'image' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp'],
        'pdf' => ['pdf'],
        'document' => ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt'],
    ];

    // ------------------------------------------------------------------ website -> builder

    public static function toBuilderSections(array $sections): array
    {
        return array_map(fn ($s) => [
            'title' => $s['title'] ?? '',
            'note' => $s['note'] ?? null,
            'blocks' => array_map([static::class, 'toBuilderBlock'], $s['blocks'] ?? []),
        ], $sections);
    }

    public static function toBuilderBlock(array $b): array
    {
        $common = array_filter([
            'id' => $b['id'] ?? null,
            'n' => isset($b['n']) && $b['n'] !== '' ? (string) $b['n'] : null,
            'label' => $b['label'] ?? null,
            'hint' => $b['hint'] ?? null,
            'lines' => isset($b['lines']) ? implode("\n", $b['lines']) : null,
            'req' => ! empty($b['req']),
            'show_if_id' => $b['showIf']['id'] ?? null,
            'show_if_eq' => $b['showIf']['eq'] ?? null,
        ], fn ($v) => $v !== null);

        return match ($b['t']) {
            'info' => ['type' => 'info', 'data' => ['lines' => implode("\n", $b['lines'] ?? [])]],
            'radio', 'select', 'multi' => ['type' => 'choice', 'data' => $common + [
                'kind' => $b['t'], 'opts' => $b['opts'] ?? [], 'other' => $b['other'] ?? null, 'must_agree' => $b['mustAgree'] ?? null,
            ]],
            'file' => ['type' => 'file', 'data' => $common + [
                'kinds' => $b['file']['kinds'] ?? ['pdf'], 'max_mb' => $b['file']['maxMB'] ?? 10,
                'notes' => isset($b['notes']) ? implode("\n", $b['notes']) : null, 'pay_online' => ! empty($b['payOnline']),
            ]],
            'agree' => ['type' => 'agree', 'data' => $common + ['items' => implode("\n", $b['items'] ?? [])]],
            'table' => ['type' => 'table', 'data' => $common + [
                'cols' => $b['cols'] ?? [], 'rows' => $b['rows'] ?? null, 'row_labels' => $b['rowLabels'] ?? [],
                'row_head' => $b['rowHead'] ?? null, 'cell_opts' => $b['cellOpts'] ?? [],
            ]],
            default => ['type' => 'field', 'data' => $common + ['kind' => $b['t']]],
        };
    }

    // ------------------------------------------------------------------ builder -> website

    public static function toWebsite(FormDefinition $f): array
    {
        return [
            'key' => $f->slug,
            'name' => $f->name,
            'title' => $f->title,
            'intro' => array_values(array_filter($f->intro ?? [])),
            'successMessage' => $f->success_message,
            'sections' => array_map(fn ($s) => array_filter([
                'title' => $s['title'] ?? '',
                'note' => $s['note'] ?? null,
                'blocks' => array_values(array_filter(array_map([static::class, 'toWebsiteBlock'], $s['blocks'] ?? []))),
            ], fn ($v) => $v !== null), $f->sections ?? []),
        ];
    }

    public static function toWebsiteBlock(array $block): ?array
    {
        $d = $block['data'] ?? [];
        $lines = fn ($v) => array_values(array_filter(array_map('trim', preg_split('/\R/', (string) $v))));
        if (($block['type'] ?? '') === 'info') {
            return ($l = $lines($d['lines'] ?? '')) ? ['t' => 'info', 'lines' => $l] : null;
        }
        $id = trim((string) ($d['id'] ?? '')) ?: Str::camel(Str::slug(Str::limit((string) ($d['label'] ?? 'field'), 40, ''))) ?: 'field';
        $b = [
            't' => match ($block['type'] ?? 'field') {
                'choice' => $d['kind'] ?? 'radio',
                'file', 'agree', 'table' => $block['type'],
                default => $d['kind'] ?? 'text',
            },
            'id' => $id,
            'label' => (string) ($d['label'] ?? ''),
        ];
        if (($d['n'] ?? '') !== '' && isset($d['n'])) {
            $b['n'] = is_numeric($d['n']) ? (int) $d['n'] : $d['n'];
        }
        if (! empty($d['hint'])) {
            $b['hint'] = $d['hint'];
        }
        if ($l = $lines($d['lines'] ?? '')) {
            $b['lines'] = $l;
        }
        if (! empty($d['req'])) {
            $b['req'] = 1;
        }
        if (! empty($d['show_if_id'])) {
            $b['showIf'] = ['id' => $d['show_if_id'], 'eq' => (string) ($d['show_if_eq'] ?? '')];
        }
        switch ($block['type']) {
            case 'choice':
                $b['opts'] = array_values($d['opts'] ?? []);
                if (! empty($d['other'])) {
                    $b['other'] = $d['other'];
                    if (! in_array($d['other'], $b['opts'], true)) {
                        $b['opts'][] = $d['other'];
                    }
                }
                if (! empty($d['must_agree'])) {
                    $b['mustAgree'] = $d['must_agree'];
                }
                break;
            case 'file':
                $b['file'] = ['kinds' => array_values($d['kinds'] ?? ['pdf']) ?: ['pdf'], 'maxMB' => (int) ($d['max_mb'] ?? 10) ?: 10];
                if ($n = $lines($d['notes'] ?? '')) {
                    $b['notes'] = $n;
                }
                if (! empty($d['pay_online'])) {
                    $b['payOnline'] = 1;
                }
                break;
            case 'agree':
                $b['items'] = is_array($d['items'] ?? null) ? array_values(array_filter($d['items'])) : $lines($d['items'] ?? '');
                break;
            case 'table':
                $b['cols'] = array_values($d['cols'] ?? []);
                if (! empty($d['row_labels'])) {
                    $b['rowLabels'] = array_values($d['row_labels']);
                    if (! empty($d['row_head'])) {
                        $b['rowHead'] = $d['row_head'];
                    }
                } else {
                    $b['rows'] = max(1, (int) ($d['rows'] ?? 3));
                }
                if (! empty($d['cell_opts'])) {
                    $b['cellOpts'] = array_values($d['cell_opts']);
                }
                break;
        }

        return $b;
    }

    // ------------------------------------------------------------------ checking a submission

    /** The label the website uses as the answer key: "12. Full Name" or "Full Name". */
    public static function answerKey(array $b): string
    {
        return (isset($b['n']) && $b['n'] !== '' ? $b['n'].'. ' : '').$b['label'];
    }

    /**
     * Returns a list of error messages (empty when the submission is valid).
     *
     * @param  array<string,string>  $data  answers keyed by question label
     * @param  array<string,UploadedFile>  $files  uploads keyed by block id
     */
    public static function validate(array $spec, array $data, array $files): array
    {
        $blocks = collect($spec['sections'] ?? [])->flatMap(fn ($s) => $s['blocks'] ?? [])->filter(fn ($b) => ($b['t'] ?? '') !== 'info');
        $byId = $blocks->keyBy('id');
        $value = fn ($b) => trim((string) ($data[static::answerKey($b)] ?? ''));
        $errors = [];

        foreach ($blocks as $b) {
            if (! empty($b['showIf'])) {
                $target = $byId[$b['showIf']['id']] ?? null;
                if (! $target || $value($target) !== (string) $b['showIf']['eq']) {
                    continue; // hidden on the website, so not required
                }
            }
            $label = $b['label'];

            if ($b['t'] === 'file') {
                $file = $files[$b['id']] ?? null;
                if (! $file) {
                    if (! empty($b['req'])) {
                        $errors[] = "Please upload: $label";
                    }

                    continue;
                }
                $allowed = collect($b['file']['kinds'] ?? ['pdf'])->flatMap(fn ($k) => self::EXT[$k] ?? [])->unique()->all();
                if (! in_array(strtolower($file->getClientOriginalExtension()), $allowed, true)) {
                    $errors[] = "$label: file type not allowed (allowed: ".implode(', ', $allowed).')';
                } elseif ($file->getSize() > ($b['file']['maxMB'] ?? 10) * 1024 * 1024) {
                    $errors[] = "$label: file is larger than ".$b['file']['maxMB'].' MB';
                }

                continue;
            }

            $v = $value($b);
            if (! empty($b['req']) && $v === '') {
                $errors[] = "Please answer: $label";
            } elseif ($v !== '' && $b['t'] === 'email' && ! filter_var($v, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "$label: enter a valid email address";
            } elseif ($v !== '' && ! empty($b['mustAgree']) && $v !== $b['mustAgree']) {
                $errors[] = "$label: must be accepted";
            }
        }

        return $errors;
    }
}
