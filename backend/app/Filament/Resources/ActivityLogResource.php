<?php

namespace App\Filament\Resources;

use App\Models\ActivityLog;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

/** Who changed what and when (requirements 4.1). Read-only. */
class ActivityLogResource extends Resource
{
    protected static ?string $model = ActivityLog::class;

    protected static ?string $slug = 'activity-log';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClock;

    protected static string|UnitEnum|null $navigationGroup = 'Administration';

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Activity log';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function columns(): array
    {
        return [
            TextColumn::make('created_at')->label('When')->dateTime('d M Y H:i')->sortable(),
            TextColumn::make('user.name')->label('Who')->placeholder('System'),
            TextColumn::make('action')->badge()->color(fn ($state) => match ($state) { 'created' => 'success', 'deleted', 'rejected' => 'danger', 'approved' => 'success', default => 'gray' }),
            TextColumn::make('subject_type')->label('What'),
            TextColumn::make('subject_label')->label('Item')->wrap()->searchable(),
            TextColumn::make('changes')->label('Changed fields')->state(fn ($record) => $record->action === 'updated' ? implode(', ', array_keys($record->changes ?? [])) : null)->wrap()->placeholder('—'),
        ];
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(3)->columnSpanFull()->schema([
                TextEntry::make('created_at')->label('When')->dateTime(),
                TextEntry::make('user.name')->label('Who')->placeholder('System'),
                TextEntry::make('action')->badge(),
                TextEntry::make('subject_type')->label('What'),
                TextEntry::make('subject_id')->label('Record ID'),
                TextEntry::make('subject_label')->label('Item'),
            ]),
            Section::make('Changes')->columnSpanFull()->visible(fn ($record) => ! empty($record->changes))->schema([
                KeyValueEntry::make('changes')->hiddenLabel()->keyLabel('Field')->valueLabel('Change')
                    ->state(fn ($record) => collect($record->changes)->map(fn ($c) => is_array($c) && array_key_exists('to', $c)
                        ? json_encode($c['from'], JSON_UNESCAPED_UNICODE).' → '.json_encode($c['to'], JSON_UNESCAPED_UNICODE)
                        : (is_scalar($c) ? (string) $c : json_encode($c, JSON_UNESCAPED_UNICODE)))->all()),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('id', 'desc')->columns(static::columns())
            ->filters([
                SelectFilter::make('user_id')->label('Who')->options(fn () => User::pluck('name', 'id')),
                SelectFilter::make('action')->options(fn () => ActivityLog::distinct()->pluck('action', 'action')),
                SelectFilter::make('subject_type')->label('What')->options(fn () => ActivityLog::distinct()->whereNotNull('subject_type')->pluck('subject_type', 'subject_type')),
            ])->recordActions([ViewAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ActivityLogResource\Pages\ListActivityLog::route('/'),
            'view' => ActivityLogResource\Pages\ViewActivityLog::route('/{record}'),
        ];
    }
}
