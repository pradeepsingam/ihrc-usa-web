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
use App\Models\Branch;

class BranchResource extends Resource
{
    protected static ?string $model = Branch::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;
    protected static string|UnitEnum|null $navigationGroup = "Organisation";
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make("country")->required(),
                TextInput::make("name")->label("Branch name")->required(),
                TextInput::make("representative"),
                TextInput::make("designation"),
                TextInput::make("email")->email(),
                TextInput::make("phone")->tel(),
                TextInput::make("location")->label("Office location")->columnSpanFull(),
                Textarea::make("activities")->label("Programs / activities")->rows(3)->columnSpanFull(),
                TextInput::make("sort")->label("Order")->numeric()->default(0),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->reorderable("sort")->defaultSort("sort")->columns([
            TextColumn::make("country")->searchable()->sortable(),
            TextColumn::make("name")->searchable(),
            TextColumn::make("representative")->searchable(),
            TextColumn::make("email"),
        ])->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => BranchResource\Pages\ListBranch::route('/'),
            'create' => BranchResource\Pages\CreateBranch::route('/create'),
            'edit' => BranchResource\Pages\EditBranch::route('/{record}/edit'),
        ];
    }
}
