<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Models\Member;
use App\Support\SiteStructure;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

/**
 * "Leadership and People": the people shown on the public Members pages.
 * They are members of the register with "show on public site" switched on.
 */
class LeadershipResource extends Resource
{
    protected static ?string $model = Member::class;

    protected static ?string $slug = 'leadership-people';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static string|UnitEnum|null $navigationGroup = 'Members';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Leadership & People';

    protected static ?string $modelLabel = 'person';

    protected static ?string $pluralModelLabel = 'Leadership & People';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('show_on_site', true);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Person')->columns(3)->columnSpanFull()->schema([
                TextInput::make('name')->required()->maxLength(190)->columnSpan(2),
                Fields::image('photo', 'members', 'Photo')->avatar(),
                TextInput::make('title')->label('Membership title')->datalist(Member::TITLES),
                TextInput::make('country'),
                Select::make('status')->options(Member::STATUSES)->default('Active')->required(),
                Toggle::make('photo_public')->label('Photo may be shown publicly')->default(true),
            ]),
            MemberResource::publicSection(required: true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('group')->columns([
            ImageColumn::make('photo')->disk('public')->circular(),
            TextColumn::make('name')->searchable(),
            TextColumn::make('group')->label('Page')->formatStateUsing(fn ($state) => SiteStructure::groupOptions()[$state] ?? $state)->sortable(),
            TextColumn::make('position')->label('Seat / role')->formatStateUsing(fn ($state, $record) => $state.' — '.SiteStructure::role((string) $record->group, (int) $state)),
            TextColumn::make('member_id')->label('Member ID')->toggleable(),
        ])->filters([SelectFilter::make('group')->label('Page')->options(fn () => SiteStructure::groupOptions())])
            ->recordActions([
                EditAction::make(),
                Action::make('hide')->label('Remove from site')->icon(Heroicon::EyeSlash)->color('gray')->requiresConfirmation()
                    ->modalDescription('The person stays in the member register but is no longer shown on the website.')
                    ->visible(fn ($record) => auth()->user()->can('update', $record))
                    ->action(fn (Member $record) => $record->update(['show_on_site' => false])),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => LeadershipResource\Pages\ListLeadership::route('/'),
            'create' => LeadershipResource\Pages\CreateLeadership::route('/create'),
            'edit' => LeadershipResource\Pages\EditLeadership::route('/{record}/edit'),
        ];
    }
}
