<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Support\SiteStructure;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\TextInputColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;
use App\Models\Event;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;
    protected static string|UnitEnum|null $navigationGroup = "News & Updates";
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make("title")->required()->maxLength(255)->columnSpanFull(),
                DatePicker::make("date")->label("Start date")->required(),
                DatePicker::make("end_date")->label("End date")->afterOrEqual("date"),
                TextInput::make("location")->columnSpanFull(),
                Textarea::make("description")->rows(3)->helperText("Short text shown in event lists.")->columnSpanFull(),
                Fields::richText("body", "Full details", "events"),
                Fields::image("image", "events", "Main image"),
                Section::make("Where it appears")->schema([Fields::program(), Fields::category(), Fields::slug(), Fields::published(),
                    \Filament\Forms\Components\Toggle::make("registration_open")->label("Registration form open")->default(true)->helperText("Shows the registration form for upcoming events.")]),
                Fields::gallery("images", "events"),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort("date", "desc")->columns([
            ImageColumn::make("image")->disk("public")->square(),
            TextColumn::make("title")->searchable()->wrap(),
            TextColumn::make("date")->date()->sortable(),
            TextColumn::make("location")->searchable()->toggleable(),
            IconColumn::make("is_published")->label("Published")->boolean(),
            TextColumn::make("registrations_count")->counts("registrations")->label("Registrations")->sortable(),
        ])->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array
    {
        return [EventResource\RelationManagers\RegistrationsRelationManager::class];
    }

    public static function getPages(): array
    {
        return [
            'index' => EventResource\Pages\ListEvent::route('/'),
            'create' => EventResource\Pages\CreateEvent::route('/create'),
            'edit' => EventResource\Pages\EditEvent::route('/{record}/edit'),
        ];
    }
}
