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
use App\Models\Project;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBriefcase;
    protected static string|UnitEnum|null $navigationGroup = "News & Updates";
    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make("title")->required()->maxLength(255)->columnSpanFull(),
                DatePicker::make("date")->required(),
                Select::make("status")->options(["Ongoing" => "Ongoing", "Completed" => "Completed", "Planned" => "Planned"])->default("Ongoing")->required(),
                TextInput::make("location")->columnSpanFull(),
                Textarea::make("summary")->rows(3)->columnSpanFull(),
                Fields::richText("body", "Full description", "projects"),
                Fields::image("image", "projects", "Main image"),
                Fields::document("file", "projects", "Report / document (optional)"),
                Section::make("Where it appears")->columnSpanFull()->columns(2)->schema([Fields::program(), Fields::category(), Fields::slug(), Fields::published()]),
                Fields::gallery("images", "projects"),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort("date", "desc")->columns([
            ImageColumn::make("image")->disk("public")->square(),
            TextColumn::make("title")->searchable()->wrap(),
            TextColumn::make("status")->badge()->color(fn ($state) => match ($state) { "Completed" => "success", "Planned" => "gray", default => "warning" }),
            TextColumn::make("date")->date()->sortable(),
            IconColumn::make("is_published")->label("Published")->boolean(),
        ])->filters([SelectFilter::make("status")->options(["Ongoing" => "Ongoing", "Completed" => "Completed", "Planned" => "Planned"])])
          ->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ProjectResource\Pages\ListProject::route('/'),
            'create' => ProjectResource\Pages\CreateProject::route('/create'),
            'edit' => ProjectResource\Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
