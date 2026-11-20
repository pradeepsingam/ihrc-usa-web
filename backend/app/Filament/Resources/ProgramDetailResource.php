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
use App\Models\ProgramDetail;

class ProgramDetailResource extends Resource
{
    protected static ?string $model = ProgramDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;
    protected static string|UnitEnum|null $navigationGroup = "Website pages";
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = "Program details";

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                Select::make("slug")->label("Program")->options(fn () => SiteStructure::programOptions())->searchable()->required()->unique(ignoreRecord: true)->columnSpanFull(),
                Textarea::make("description")->rows(5)->helperText("Replaces the short program description on its page.")->columnSpanFull(),
                TextInput::make("location"),
                DatePicker::make("date"),
                TagsInput::make("activities")->placeholder("Type an activity and press Enter")->columnSpanFull(),
                Fields::gallery("images", "programs"),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make("slug")->label("Program")->formatStateUsing(fn ($state) => SiteStructure::programOptions()[$state] ?? $state)->searchable(),
            TextColumn::make("location"),
            TextColumn::make("updated_at")->label("Last edited")->since(),
        ])->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ProgramDetailResource\Pages\ListProgramDetail::route('/'),
            'create' => ProgramDetailResource\Pages\CreateProgramDetail::route('/create'),
            'edit' => ProgramDetailResource\Pages\EditProgramDetail::route('/{record}/edit'),
        ];
    }
}
