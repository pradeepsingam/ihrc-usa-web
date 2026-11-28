<?php

namespace App\Filament\Resources;

use App\Models\WebsiteContent;
use App\Support\ContentCatalog;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class WebsiteContentResource extends Resource
{
    protected static ?string $model = WebsiteContent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPencilSquare;

    protected static string|UnitEnum|null $navigationGroup = 'Website pages';

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Website content';

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Website content')->columnSpanFull()->schema([
                TextInput::make('label')->label('Section')->disabled()->dehydrated(false),
            ]),
            Section::make('Content')->columnSpanFull()->schema(fn (?WebsiteContent $record): array => static::fields(ContentCatalog::definitions()[$record?->key]['content'] ?? [], 'content')),
        ]);
    }

    /** Build ordinary text fields and ordered lists from each section's exported structure. */
    protected static function fields(array $values, string $prefix = ''): array
    {
        $fields = [];
        $labels = ['value' => 'Content', 't' => 'Title', 'd' => 'Description', 'n' => 'Number', 'c' => 'Category / caption', 'h' => 'Heading', 'h2' => 'Second heading', 'p' => 'Text', 'to' => 'Link', 'src' => 'Image URL', 'img' => 'Image URL', 'bg' => 'Background image URL', '0' => 'Title / item', '1' => 'Description / link'];
        foreach ($values as $key => $value) {
            $name = $prefix === '' ? (string) $key : $prefix.'.'.$key;
            $label = $labels[(string) $key] ?? str($key)->replace(['-', '_'], ' ')->headline()->toString();
            if (is_array($value)) {
                if (array_is_list($value)) {
                    $first = $value[0] ?? '';
                    $field = Repeater::make($name)->label($label)->collapsible()->reorderable()->defaultItems(0)
                        ->addActionLabel('Add item')->maxItems(300);
                    if (is_array($first)) {
                        $field->schema(static::fields($first))->collapsed()
                            ->itemLabel(fn (array $state): string => str((string) ($state['title'] ?? $state['name'] ?? $state['t'] ?? $state[0] ?? 'Item'))->limit(90)->toString());
                    } else {
                        $field->simple(Textarea::make('text')->label('Text')->rows(2)->maxLength(30000));
                    }
                    $fields[] = $field->columnSpanFull();
                } else {
                    $fields[] = Section::make($label)->schema(static::fields($value, $name))->collapsible()->columnSpanFull();
                }
            } elseif (is_bool($value)) {
                $fields[] = Toggle::make($name)->label($label);
            } elseif (is_int($value) || is_float($value)) {
                $fields[] = TextInput::make($name)->label($label)->numeric()->required();
            } elseif ($value === null) {
                $fields[] = Hidden::make($name)->default(null);
            } else {
                $field = Textarea::make($name)->label($label)->rows(strlen((string) $value) > 180 ? 5 : 2)->maxLength(30000)->columnSpanFull();
                if (in_array((string) $key, ['to', 'src', 'img', 'bg', 'url', 'website', 'logo'], true) || ($key === 1 && preg_match('~^(?:/|https?://)~', (string) $value))) {
                    $field->rules(['nullable', 'regex:~^(?:https?://|/|\#)[^\r\n]*$~']);
                }
                $fields[] = $field;
            }
        }

        return $fields;
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('label')->columns([
            TextColumn::make('label')->label('Section')->searchable()->sortable(),
            TextColumn::make('group')->label('Content type')->searchable()->sortable(),
            TextColumn::make('updated_at')->label('Last edited')->since(),
        ])->filters([
            SelectFilter::make('group')->label('Content type')->options(fn (): array => WebsiteContent::distinct()->pluck('group', 'group')->all()),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => WebsiteContentResource\Pages\ListWebsiteContent::route('/'),
            'edit' => WebsiteContentResource\Pages\EditWebsiteContent::route('/{record}/edit'),
        ];
    }
}
