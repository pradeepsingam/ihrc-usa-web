<?php

namespace App\Filament\Resources;

use App\Models\FormDefinition;
use App\Support\Mailboxes;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ReplicateAction;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

/**
 * Form Builder (requirements 4.3). Builds forms in the same structure the website's
 * RegistrationForm already understands; published forms appear at /forms/<address>
 * and can be placed on any page from the Page Builder.
 */
class FormDefinitionResource extends Resource
{
    protected static ?string $model = FormDefinition::class;

    protected static ?string $slug = 'form-builder';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static string|UnitEnum|null $navigationGroup = 'Website pages';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Form Builder';

    protected static ?string $modelLabel = 'form';

    /** Fields every question has. */
    protected static function common(): array
    {
        return [
            TextInput::make('label')->label('Question')->required()->columnSpan(3),
            TextInput::make('n')->label('No.')->placeholder('e.g. 12')->maxLength(6),
            TextInput::make('id')->label('Field ID')->alphaDash()->maxLength(60)->placeholder('auto')
                ->helperText('Short name used for uploads and "show only if". Leave empty to create it from the question.')->columnSpan(2),
            Toggle::make('req')->label('Required')->inline(false),
            TextInput::make('hint')->label('Hint text')->columnSpan(3),
            Textarea::make('lines')->label('Explanation shown above the answer (one paragraph per line)')->rows(2)->columnSpanFull(),
            Fieldset::make('Show only if (conditional display)')->columns(2)->columnSpanFull()->schema([
                TextInput::make('show_if_id')->label('Field ID of another question')->alphaDash(),
                TextInput::make('show_if_eq')->label('…has this answer'),
            ]),
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Form')->columns(2)->columnSpanFull()->schema([
                TextInput::make('title')->required()->maxLength(190)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set, $get, ?FormDefinition $record) => $record ? null : ($get('name') ?: $set('name', $state))),
                TextInput::make('slug')->label('Web address')->prefix('/forms/')->required()->alphaDash()->unique(ignoreRecord: true)
                    ->disabled(fn (?FormDefinition $record) => $record?->is_builtin)->dehydrated(fn (?FormDefinition $record) => ! $record?->is_builtin)
                    ->helperText(fn (?FormDefinition $record) => $record?->is_builtin ? 'Built-in form: also used on its own website page.' : null),
                TextInput::make('name')->label('Name in the inbox')->required()->maxLength(190)
                    ->unique(ignoreRecord: true)->helperText('Submissions are listed under this name.'),
                Select::make('mailbox')->label('Send to mailbox')->options(Mailboxes::options())->default('info')->required(),
                Repeater::make('intro')->label('Introduction paragraphs')->simple(Textarea::make('text')->rows(2))->defaultItems(0)->columnSpanFull(),
                Textarea::make('success_message')->label('Message after sending')->rows(2)->placeholder('Thank you. We will review your application and get back to you.'),
                Toggle::make('is_published')->label('Published')->default(true)->inline(false),
            ]),
            Section::make('Questions')->columnSpanFull()->schema([
                Repeater::make('sections')->hiddenLabel()->addActionLabel('Add section')->collapsible()->reorderable()
                    ->itemLabel(fn (array $state) => ($state['title'] ?? '') ?: 'Section')
                    ->schema([
                        TextInput::make('title')->label('Section title'),
                        TextInput::make('note')->label('Section note'),
                        Builder::make('blocks')->label('Questions')->addActionLabel('Add question')->collapsible()->reorderable()->blockNumbers(false)
                            ->blocks([
                                Block::make('field')->label(fn (?array $state) => 'Text answer'.(($state['label'] ?? '') ? ': '.Str::limit($state['label'], 60) : ''))
                                    ->icon(Heroicon::OutlinedPencil)->columns(6)->schema([
                                        Select::make('kind')->label('Type')->options(['text' => 'Short text', 'textarea' => 'Long text', 'email' => 'Email', 'tel' => 'Phone', 'date' => 'Date'])->default('text')->required()->columnSpan(2),
                                        ...static::common(),
                                    ]),
                                Block::make('choice')->label(fn (?array $state) => 'Choice'.(($state['label'] ?? '') ? ': '.Str::limit($state['label'], 60) : ''))
                                    ->icon(Heroicon::OutlinedListBullet)->columns(6)->schema([
                                        Select::make('kind')->label('Type')->options(['radio' => 'One choice (radio)', 'select' => 'Drop-down list', 'multi' => 'Several choices (checkboxes)'])->default('radio')->required()->columnSpan(2),
                                        ...static::common(),
                                        TagsInput::make('opts')->label('Choices')->required()->placeholder('Type a choice and press Enter')->reorderable()->columnSpanFull(),
                                        TextInput::make('other')->label('"Other" choice with a text box (optional)')->placeholder('e.g. Other')->columnSpan(3),
                                        TextInput::make('must_agree')->label('Answer that must be chosen to submit (optional)')->placeholder('e.g. I agree')->columnSpan(3),
                                    ]),
                                Block::make('file')->label(fn (?array $state) => 'File upload'.(($state['label'] ?? '') ? ': '.Str::limit($state['label'], 60) : ''))
                                    ->icon(Heroicon::OutlinedPaperClip)->columns(6)->schema([
                                        ...static::common(),
                                        CheckboxList::make('kinds')->label('Allowed files')->options(['pdf' => 'PDF', 'image' => 'Image (jpg, png, heic…)', 'document' => 'Document (doc, docx, odt…)'])->default(['pdf'])->required()->columns(3)->columnSpan(4),
                                        TextInput::make('max_mb')->label('Maximum size (MB)')->numeric()->minValue(1)->maxValue(100)->default(10)->required()->columnSpan(2),
                                        Textarea::make('notes')->label('Numbered notes (one per line)')->rows(2)->columnSpan(4),
                                        Toggle::make('pay_online')->label('Show "Pay Online" button')->inline(false)->columnSpan(2),
                                    ]),
                                Block::make('agree')->label(fn (?array $state) => 'Statements to accept'.(($state['label'] ?? '') ? ': '.Str::limit($state['label'], 60) : ''))
                                    ->icon(Heroicon::OutlinedCheckBadge)->columns(6)->schema([
                                        ...static::common(),
                                        Textarea::make('items')->label('Statements – one per line (each must be ticked)')->rows(4)->required()->columnSpanFull(),
                                    ]),
                                Block::make('table')->label(fn (?array $state) => 'Table'.(($state['label'] ?? '') ? ': '.Str::limit($state['label'], 60) : ''))
                                    ->icon(Heroicon::OutlinedTableCells)->columns(6)->schema([
                                        ...static::common(),
                                        TagsInput::make('cols')->label('Column names')->required()->reorderable()->columnSpanFull(),
                                        TextInput::make('rows')->label('Number of rows')->numeric()->minValue(1)->maxValue(20)->default(3)->columnSpan(2),
                                        TagsInput::make('row_labels')->label('…or fixed row names (optional)')->reorderable()->columnSpan(2),
                                        TextInput::make('row_head')->label('Heading of the row-name column')->columnSpan(2),
                                        TagsInput::make('cell_opts')->label('Cells are drop-downs with these choices (optional)')->columnSpanFull(),
                                    ]),
                                Block::make('info')->label('Information text')->icon(Heroicon::OutlinedInformationCircle)->schema([
                                    Textarea::make('lines')->label('Text (one paragraph per line)')->rows(3)->required(),
                                ]),
                            ]),
                    ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('title')->columns([
            TextColumn::make('title')->searchable(),
            TextColumn::make('slug')->label('Address')->formatStateUsing(fn ($state) => '/forms/'.$state),
            TextColumn::make('mailbox')->formatStateUsing(fn ($state) => Mailboxes::BOXES[$state] ?? $state),
            TextColumn::make('questions')->label('Questions')->state(fn ($record) => collect($record->sections ?? [])->sum(fn ($s) => count($s['blocks'] ?? []))),
            IconColumn::make('is_published')->label('Published')->boolean(),
            TextColumn::make('updated_at')->label('Last edited')->since(),
        ])->recordActions([
            EditAction::make(),
            Action::make('open')->label('View on site')->icon(Heroicon::ArrowTopRightOnSquare)->color('gray')
                ->url(fn ($record) => rtrim((string) config('app.frontend_url'), '/').'/forms/'.$record->slug, shouldOpenInNewTab: true)
                ->visible(fn () => filled(config('app.frontend_url'))),
            ReplicateAction::make()->label('Copy')->excludeAttributes(['is_builtin'])
                ->mutateRecordDataUsing(fn (array $data) => ['slug' => $data['slug'].'-copy', 'name' => $data['name'].' (copy)', 'title' => $data['title'].' (copy)'] + $data),
            DeleteAction::make()->visible(fn ($record) => ! $record->is_builtin),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => FormDefinitionResource\Pages\ListFormDefinition::route('/'),
            'create' => FormDefinitionResource\Pages\CreateFormDefinition::route('/create'),
            'edit' => FormDefinitionResource\Pages\EditFormDefinition::route('/{record}/edit'),
        ];
    }
}
