<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Models\ActivityLog;
use App\Models\Member;
use App\Support\Csv;
use App\Support\SiteStructure;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use UnitEnum;

/** The member register (requirements 4.4). */
class MemberResource extends Resource
{
    protected static ?string $model = Member::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedIdentification;

    protected static string|UnitEnum|null $navigationGroup = null;

    protected static ?string $slug = 'members';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Members';

    protected static ?string $modelLabel = 'member';

    protected static ?string $recordTitleAttribute = 'name';

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'member_id', 'email'];
    }

    /** CSV columns used for export and import. */
    public const CSV = ['member_id', 'name', 'title', 'status', 'email', 'phone', 'country', 'city', 'address', 'date_of_birth', 'gender',
        'nationality', 'profession', 'organization', 'interests', 'joined_at', 'expires_at', 'fee_status', 'show_on_site', 'group', 'public_role', 'position'];

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Membership')->columns(3)->columnSpanFull()->schema([
                TextInput::make('member_id')->label('Member ID')->disabled()->dehydrated(false)->placeholder('Created automatically')
                    ->helperText('Used on the Verify Member page.'),
                Select::make('status')->options(Member::STATUSES)->default('Active')->required(),
                TextInput::make('title')->label('Membership title / category')->datalist(Member::TITLES)->maxLength(190),
                DatePicker::make('joined_at')->label('Joined')->default(now()),
                DatePicker::make('expires_at')->label('Expires')->default(now()->addYear()),
                Select::make('fee_status')->options(Member::FEE_STATUSES),
            ]),
            Section::make('Personal details')->columns(3)->columnSpanFull()->schema([
                TextInput::make('name')->label('Full name')->required()->maxLength(190)->columnSpan(2),
                DatePicker::make('date_of_birth'),
                Select::make('gender')->options(['Female' => 'Female', 'Male' => 'Male', 'Other' => 'Other', 'Prefer not to say' => 'Prefer not to say']),
                TextInput::make('nationality'),
                TextInput::make('profession'),
                TextInput::make('organization')->columnSpan(2),
                Textarea::make('interests')->label('Areas of interest')->rows(2)->columnSpanFull(),
            ]),
            Section::make('Contact')->columns(3)->columnSpanFull()->schema([
                TextInput::make('email')->email(),
                TextInput::make('phone')->label('WhatsApp / mobile')->tel(),
                TextInput::make('country'),
                TextInput::make('city'),
                Textarea::make('address')->rows(2)->columnSpan(2),
            ]),
            Section::make('Files')->columns(3)->columnSpanFull()
                ->description('ID document and CV are private: only admins can open them. The photo is shown publicly only when allowed.')
                ->schema([
                    Fields::image('photo', 'members', 'Photo')->avatar(),
                    FileUpload::make('id_document')->label('ID document')->disk('local')->directory('members-private')->visibility('private')->downloadable()->maxSize(20480),
                    FileUpload::make('cv')->label('CV')->disk('local')->directory('members-private')->visibility('private')->downloadable()->maxSize(102400),
                    Toggle::make('photo_public')->label('Photo may be shown publicly')->default(true),
                ]),
            static::publicSection(),
        ]);
    }

    public static function publicSection(): Section
    {
        $on = fn (Get $get) => (bool) $get('show_on_site');

        return Section::make('Show on the public website')->columns(3)->columnSpanFull()
            ->description('Turn on to show this person on a Members page (Leadership, Ambassadors, Directors…). Any number of people can have the same role.')
            ->schema([
                Toggle::make('show_on_site')->label('Show on public site')->live()->columnSpanFull(),
                Select::make('group')->label('Members page')->options(fn () => SiteStructure::groupOptions())
                    ->required($on)->visible($on)->live()->searchable(),
                TextInput::make('public_role')->label('Role on the page')->maxLength(190)
                    ->datalist(fn (Get $get) => SiteStructure::roleOptions($get('group')))
                    ->required($on)->visible($on)->placeholder('e.g. President')
                    ->helperText('Pick a suggestion or type a new role.'),
                TextInput::make('position')->label('Order on the page')->numeric()->minValue(0)->visible($on)
                    ->helperText('Lower numbers are shown first. Leave empty to sort by name.'),
                Textarea::make('bio')->label('Biography')->rows(5)->columnSpanFull()->visible($on),
                Textarea::make('responsibilities')->rows(3)->columnSpanFull()->visible($on),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('id', 'desc')->columns([
            ImageColumn::make('photo')->disk('public')->circular(),
            TextColumn::make('member_id')->label('Member ID')->searchable()->copyable()->sortable(),
            TextColumn::make('name')->searchable()->sortable(),
            TextColumn::make('title')->searchable()->toggleable(),
            TextColumn::make('country')->searchable()->toggleable(),
            TextColumn::make('status')->badge()->color(fn ($state) => match ($state) { 'Active' => 'success', 'Pending' => 'warning', 'Suspended', 'Rejected' => 'danger', default => 'gray' }),
            TextColumn::make('expires_at')->label('Expires')->date()->sortable()->toggleable(),
            IconColumn::make('show_on_site')->label('On website')->boolean()->toggleable(),
            TextColumn::make('group')->label('Members page')->formatStateUsing(fn ($state) => SiteStructure::groupOptions()[$state] ?? $state)->toggleable()->sortable(),
            TextColumn::make('public_role')->label('Role')->toggleable()->searchable(),
        ])->filters([
            SelectFilter::make('group')->label('Members page')->options(fn () => SiteStructure::groupOptions()),
            SelectFilter::make('status')->options(Member::STATUSES),
            SelectFilter::make('fee_status')->options(Member::FEE_STATUSES),
            TernaryFilter::make('show_on_site')->label('Shown on public site'),
        ])->headerActions([
            Action::make('export')->label('Export CSV')->icon(Heroicon::ArrowDownTray)->color('gray')
                ->action(fn ($livewire) => static::exportCsv($livewire->getFilteredSortedTableQuery()->get())),
            Action::make('import')->label('Import CSV')->icon(Heroicon::ArrowUpTray)->color('gray')
                ->visible(fn () => auth()->user()->can('create', Member::class))
                ->modalDescription('Columns (first row): '.implode(', ', self::CSV).'. Only "name" is required. Rows with an existing member_id or email update that member.')
                ->schema([FileUpload::make('file')->label('CSV file')->disk('local')->directory('imports')->acceptedFileTypes(['text/csv', 'text/plain', 'application/vnd.ms-excel'])->required()])
                ->action(fn (array $data) => static::importCsv($data['file'])),
        ])->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([
                BulkAction::make('exportSelected')->label('Export selected (CSV)')->icon(Heroicon::ArrowDownTray)->action(fn (Collection $records) => static::exportCsv($records)),
                BulkAction::make('setStatus')->label('Change status')->icon(Heroicon::Flag)
                    ->authorize(fn () => auth()->user()->can('update', Member::class))
                    ->schema([Select::make('status')->options(Member::STATUSES)->required()])
                    ->action(fn (Collection $records, array $data) => $records->each->update(['status' => $data['status']]))->deselectRecordsAfterCompletion(),
                DeleteBulkAction::make(),
            ])]);
    }

    public static function exportCsv(Collection $members)
    {
        return Csv::download('members-'.now()->format('Y-m-d').'.csv', self::CSV, $members->map(fn (Member $m) => collect(self::CSV)->mapWithKeys(fn ($c) => [$c => match (true) {
            $m->$c instanceof \DateTimeInterface => $m->$c->format('Y-m-d'),
            is_bool($m->$c) => $m->$c ? 'yes' : 'no',
            default => $m->$c,
        }])->all()));
    }

    public static function importCsv(string $path): void
    {
        $rows = Csv::read(Storage::disk('local')->path($path));
        $created = $updated = 0;
        $errors = [];
        foreach ($rows as $i => $row) {
            $name = trim($row['name'] ?? $row['full_name'] ?? '');
            if ($name === '') {
                $errors[] = 'Row '.($i + 2).': name is missing';

                continue;
            }
            $attrs = ['name' => $name];
            foreach (self::CSV as $c) {
                $v = trim((string) ($row[$c] ?? ''));
                if ($v === '' || in_array($c, ['member_id', 'name'], true)) {
                    continue;
                }
                $attrs[$c] = match ($c) {
                    'show_on_site' => in_array(strtolower($v), ['1', 'yes', 'true', 'y'], true),
                    'date_of_birth', 'joined_at', 'expires_at' => rescue(fn () => Carbon::parse($v)->toDateString(), null, false),
                    'status' => Member::STATUSES[ucfirst(strtolower($v))] ?? 'Active',
                    'position' => (int) $v ?: null,
                    default => $v,
                };
            }
            $existing = (($id = strtoupper(trim($row['member_id'] ?? ''))) ? Member::firstWhere('member_id', $id) : null)
                ?? (! empty($attrs['email']) ? Member::firstWhere('email', $attrs['email']) : null);
            try {
                if ($existing) {
                    $existing->update($attrs);
                    $updated++;
                } else {
                    Member::create($attrs + ['status' => 'Active', 'joined_at' => now()]);
                    $created++;
                }
            } catch (\Throwable $e) {
                $errors[] = 'Row '.($i + 2).': '.str($e->getMessage())->limit(120);
            }
        }
        Storage::disk('local')->delete($path);
        ActivityLog::record('imported', null, ['created' => $created, 'updated' => $updated, 'errors' => count($errors)], 'Members CSV');

        Notification::make()->title("Import finished: $created added, $updated updated")
            ->body($errors ? implode("\n", array_slice($errors, 0, 8)) : null)
            ->{$errors ? 'warning' : 'success'}()->persistent()->send();
    }

    public static function getPages(): array
    {
        return [
            'index' => MemberResource\Pages\ListMember::route('/'),
            'create' => MemberResource\Pages\CreateMember::route('/create'),
            'edit' => MemberResource\Pages\EditMember::route('/{record}/edit'),
        ];
    }
}
