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
use App\Models\Supporter;

class SupporterResource extends Resource
{
    protected static ?string $model = Supporter::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;
    protected static string|UnitEnum|null $navigationGroup = "Organisation";
    protected static ?int $navigationSort = 4;
    protected static ?string $navigationLabel = "Donors & sponsors";

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                Select::make("type")->options(["donor" => "Donor", "sponsor" => "Sponsor"])->default("donor")->required(),
                TextInput::make("name")->required(),
                Textarea::make("details")->rows(3)->columnSpanFull(),
                TextInput::make("url")->label("Website")->url(),
                TextInput::make("sort")->label("Order")->numeric()->default(0),
                Fields::image("logo", "supporters", "Logo"),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->reorderable("sort")->defaultSort("sort")->columns([
            ImageColumn::make("logo")->disk("public"),
            TextColumn::make("name")->searchable(),
            TextColumn::make("type")->badge()->formatStateUsing(fn ($state) => ucfirst($state)),
        ])->filters([SelectFilter::make("type")->options(["donor" => "Donor", "sponsor" => "Sponsor"])])
          ->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => SupporterResource\Pages\ListSupporter::route('/'),
            'create' => SupporterResource\Pages\CreateSupporter::route('/create'),
            'edit' => SupporterResource\Pages\EditSupporter::route('/{record}/edit'),
        ];
    }
}
