<?php

namespace App\Filament\Resources;

use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

/** Admin users and their roles (Super Admin only). */
class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $slug = 'admin-users';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedKey;

    protected static string|UnitEnum|null $navigationGroup = 'Administration';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Admin users';

    protected static ?string $modelLabel = 'admin user';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make('name')->required()->maxLength(190),
                TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
                Select::make('role')->options(User::ROLES)->required()->default(User::EDITOR)
                    ->helperText('Super Admin: everything · Editor: news, events, projects, publications, supporters and pages · Membership Officer: members and applications · Viewer: read-only submissions and reports')
                    ->disabled(fn (?User $record) => $record?->is(auth()->user()))->dehydrated(fn (?User $record) => ! $record?->is(auth()->user())),
                TextInput::make('password')->password()->revealable()->minLength(10)
                    ->required(fn (string $operation) => $operation === 'create')
                    ->dehydrated(fn ($state) => filled($state))
                    ->helperText(fn (string $operation) => $operation === 'edit' ? 'Leave empty to keep the current password. Users can also reset it from the login page.' : 'At least 10 characters.'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->searchable(),
            TextColumn::make('email')->searchable(),
            TextColumn::make('role')->badge()->formatStateUsing(fn ($state) => User::ROLES[$state] ?? $state),
            IconColumn::make('app_authentication_secret')->label('Two-factor')->boolean()->state(fn ($record) => filled($record->app_authentication_secret)),
            TextColumn::make('created_at')->date()->label('Added'),
        ])->recordActions([EditAction::make(), DeleteAction::make()->hidden(fn ($record) => $record->is(auth()->user()))]);
    }

    public static function getPages(): array
    {
        return [
            'index' => UserResource\Pages\ListUser::route('/'),
            'create' => UserResource\Pages\CreateUser::route('/create'),
            'edit' => UserResource\Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
