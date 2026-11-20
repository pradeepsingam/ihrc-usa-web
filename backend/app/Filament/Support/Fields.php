<?php

namespace App\Filament\Support;

use App\Support\SiteStructure;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

/** Small helpers shared by the admin forms. */
class Fields
{
    public static function image(string $name, string $dir, string $label = 'Image'): FileUpload
    {
        return FileUpload::make($name)->label($label)->image()->disk('public')->directory($dir)
            ->visibility('public')->maxSize(5120)->imageEditor();
    }

    public static function gallery(string $name, string $dir, string $label = 'Gallery images'): FileUpload
    {
        return FileUpload::make($name)->label($label)->image()->multiple()->reorderable()->appendFiles()
            ->disk('public')->directory($dir)->visibility('public')->maxSize(5120)->maxFiles(30)->columnSpanFull();
    }

    public static function document(string $name, string $dir, string $label = 'File'): FileUpload
    {
        return FileUpload::make($name)->label($label)->disk('public')->directory($dir)->visibility('public')
            ->acceptedFileTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'])
            ->maxSize(20480)->downloadable()->openable();
    }

    /** Rich text editor for article bodies; images are uploaded to the public disk. */
    public static function richText(string $name, string $label, string $dir): RichEditor
    {
        return RichEditor::make($name)->label($label)->columnSpanFull()
            ->toolbarButtons([['bold', 'italic', 'underline', 'strike', 'link'], ['h2', 'h3'], ['bulletList', 'orderedList', 'blockquote'], ['attachFiles', 'table'], ['undo', 'redo']])
            ->fileAttachmentsDisk('public')->fileAttachmentsDirectory($dir.'/attachments')->fileAttachmentsVisibility('public');
    }

    /** Older plain-text content (paragraphs separated by empty lines) shown correctly in the rich editor. */
    public static function textToHtml($state)
    {
        // Built-in list sections: ["item", …] or {intro, items: […]}
        if (is_array($state)) {
            $items = array_is_list($state) ? $state : ($state['items'] ?? []);
            $intro = array_is_list($state) ? '' : (string) ($state['intro'] ?? '');

            return ($intro !== '' ? '<p>'.e($intro).'</p>' : '').'<ul>'.collect($items)->map(fn ($i) => '<li><p>'.e(is_array($i) ? implode(' – ', $i) : $i).'</p></li>')->implode('').'</ul>';
        }
        if (! is_string($state) || $state === '' || preg_match('/<(p|h[1-6]|ul|ol|div|br|strong|em|a)\b/i', $state)) {
            return $state;
        }

        return collect(preg_split('/\R{2,}/', trim($state)))
            ->map(fn ($para) => '<p>'.nl2br(e(trim($para)), false).'</p>')->implode('');
    }

    public static function slug(): TextInput
    {
        return TextInput::make('slug')->label('Web address (slug)')->unique(ignoreRecord: true)->alphaDash()
            ->helperText('Leave empty to create it from the title.');
    }

    public static function program(): Select
    {
        return Select::make('program')->label('Show on program')->options(fn () => SiteStructure::programOptions())
            ->searchable()->helperText('Optional – the item is also listed on this program’s page.');
    }

    public static function category(): Select
    {
        return Select::make('category')->label('Program category')->options(fn () => SiteStructure::programCategories())
            ->helperText('Optional – use when the item is not tied to one program.');
    }

    public static function published(): Toggle
    {
        return Toggle::make('is_published')->label('Published (visible on the website)')->default(true);
    }
}
