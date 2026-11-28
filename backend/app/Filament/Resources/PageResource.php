<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Models\FormDefinition;
use App\Models\Page;
use App\Models\WebsiteContent;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

/** Page Builder (requirements 4.2): website text pages, their address, sections, images and menu entry. */
class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocument;

    protected static string|UnitEnum|null $navigationGroup = 'Website pages';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Pages';

    /** Website menus a page can be added to (they match the menus in src/data.js). */
    public const MENUS = [
        'About' => 'About Us', 'Members' => 'Our Members', 'News & Events' => 'Events & News',
        'Get Involved' => 'Get Involved', 'Contact' => 'Contact', 'Top' => 'Main menu (top level)',
    ];

    /** Addresses already used by the website. */
    public const RESERVED = ['admin', 'api', 'forms', 'news', 'events', 'projects', 'publications', 'programs', 'search', 'verify', 'member-profile',
        'contact', 'volunteer', 'membership', 'apply', 'research', 'donation', 'awards', 'partnerships', 'partnership-application', 'report-concern',
        'accreditation', 'human-rights', 'what-we-do', 'our-partners', 'our-supporters', 'recognition', 'countries', 'roles-responsibilities',
        'global-network', 'membership-benefits', 'storage'];

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Page')->columns(2)->columnSpanFull()->schema([
                TextInput::make('title')->required()->maxLength(190),
                TextInput::make('slug')->label('Web address')->prefix('/')->required()->alphaDash()->maxLength(80)
                    ->unique(ignoreRecord: true)->notIn(fn (?Page $record): array => $record?->is_builtin ? [] : self::RESERVED)
                    ->validationMessages(['not_in' => 'This address is already used by the website.'])
                    ->disabled(fn (?Page $record) => $record?->is_builtin)->dehydrated(fn (?Page $record) => ! $record?->is_builtin)
                    ->helperText(fn (?Page $record) => $record?->is_builtin ? 'Built-in page: the address cannot change.' : 'e.g. annual-report-2026'),
                Textarea::make('subtitle')->rows(2)->columnSpanFull(),
                Fields::image('image', 'pages', 'Header background image (optional)'),
                Toggle::make('show_default_content')->label('Show existing page sections and forms')->default(true)
                    ->helperText('Keep existing website content below the sections added here. Edit its text using the links below.')->visible(fn (?Page $record) => (bool) $record?->is_composite),
                Toggle::make('is_published')->label('Published (visible on the website)')->default(true)->inline(false),
            ]),
            Section::make('Edit existing website sections')->columnSpanFull()->collapsible()
                ->description('Edit the original text and lists here. Forms are edited in Form Builder; news, events, projects and publications have their own editors.')
                ->schema(fn (?Page $record): array => [Actions::make([
                    ...WebsiteContent::whereIn('key', static::contentKeys($record?->slug))->get()->map(fn (WebsiteContent $entry) => Action::make('content'.$entry->id)->label($entry->label)->url(WebsiteContentResource::getUrl('edit', ['record' => $entry])))->all(),
                ])]),
            Section::make('Sections')->columnSpanFull()->schema([
                Repeater::make('sections')->hiddenLabel()->schema([
                    TextInput::make('heading')->required(),
                    Fields::richText('body', 'Text', 'pages'),
                ])->itemLabel(fn (array $state) => $state['heading'] ?? null)->collapsible()->reorderable()->addActionLabel('Add section')->defaultItems(1),
            ]),
            Section::make('Images and form')->columns(2)->columnSpanFull()->collapsible()->schema([
                Fields::gallery('images', 'pages', 'Image gallery (shown under the text)'),
                Select::make('form_slug')->label('Show a form on this page')->options(fn () => FormDefinition::where('is_published', true)->pluck('title', 'slug'))
                    ->helperText('Forms are made in Website pages → Form Builder.'),
            ]),
            Section::make('Menu')->columns(3)->columnSpanFull()->schema([
                Select::make('menu')->label('Add to menu')->options(self::MENUS)->placeholder('Not in a menu')->live(),
                TextInput::make('menu_label')->label('Menu text')->placeholder('Same as the title')->visible(fn (Get $get) => filled($get('menu'))),
                TextInput::make('menu_sort')->label('Order in menu')->numeric()->default(0)->visible(fn (Get $get) => filled($get('menu'))),
            ])->description('Built-in pages are already in the menus; use this for new pages.'),
        ]);
    }

    public static function contentKeys(?string $slug): array
    {
        return match ($slug) {
            'volunteer', 'membership', 'contact' => ['copy.Forms', 'Forms.areas'],
            'research' => ['copy.Research', 'research.researchAreas', 'research.researchWho', 'research.researchBenefits', 'research.researchTopics', 'research.equalOpportunity', 'research.researchRef', 'research.researchClosingDate'],
            'membership-benefits' => ['copy.Content', 'data.benefits', 'ihrcBenefits.ihrcBenefits', 'copy.BenefitsOfIhrc'],
            'objectives' => ['objectives.objectiveGroups', 'coreValues.coreValues', 'sdgs.sdgs', 'copy.ObjectivesSection', 'copy.CoreValues', 'copy.SdgGoals'],
            'what-we-do' => ['copy.WhatWeDo', 'WhatWeDo.purpose', 'WhatWeDo.areas'],
            'roles-responsibilities' => ['copy.Roles', 'roles.rolesIntro', 'roles.rolesStructure', 'roles.roles', 'roles.codeOfConduct'],
            'our-partners', 'recognition' => ['copy.OurPartners', 'copy.Recognition', 'recognition.recognitionText', 'recognition.recognitionSections', 'recognition.recognitionMarquee'],
            'countries' => ['copy.Countries', 'countries.countries'],
            'accreditation' => ['copy.Accreditation', 'Accreditation.intro', 'Accreditation.notice', 'Accreditation.docChecklist'],
            'partnership-application' => ['copy.PartnershipApplication'],
            'projects' => ['copy.Projects'],
            'report-concern' => ['copy.PublicPages', 'ComplaintForm.complaintInfo'],
            default => ['copy.PublicPages', 'PublicPages.hr', 'PublicPages.hrLinks', 'PublicPages.pc'],
        };
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('title')->columns([
            TextColumn::make('title')->searchable()->sortable(),
            TextColumn::make('slug')->label('Address')->formatStateUsing(fn ($state) => '/'.$state)->searchable(),
            TextColumn::make('menu')->formatStateUsing(fn ($state) => self::MENUS[$state] ?? $state)->placeholder('—'),
            IconColumn::make('is_published')->label('Published')->boolean(),
            TextColumn::make('updated_at')->label('Last edited')->since()->sortable(),
        ])->recordActions([
            EditAction::make(),
            DeleteAction::make()->visible(fn (Page $record) => ! $record->is_builtin && auth()->user()->can('delete', $record)),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => PageResource\Pages\ListPage::route('/'),
            'create' => PageResource\Pages\CreatePage::route('/create'),
            'edit' => PageResource\Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
