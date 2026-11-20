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
use App\Models\News;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNewspaper;
    protected static string|UnitEnum|null $navigationGroup = "News & Updates";
    protected static ?int $navigationSort = 1;
    protected static ?string $modelLabel = "news article";
    protected static ?string $pluralModelLabel = "news";

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make("title")->required()->maxLength(255)->columnSpanFull(),
                Select::make("type")->options(["News" => "News", "Press Release" => "Press Release", "Announcement" => "Announcement", "Statement" => "Statement", "Article" => "Article"])->default("News")->required(),
                DatePicker::make("date")->default(now())->required(),
                Textarea::make("summary")->rows(3)->helperText("Short text shown in news lists.")->columnSpanFull(),
                Fields::richText("body", "Full article", "news"),
                Fields::image("image", "news"),
                Section::make("Where it appears")->schema([Fields::program(), Fields::category(), Fields::slug(), Fields::published()]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort("date", "desc")->columns([
            ImageColumn::make("image")->disk("public")->square(),
            TextColumn::make("title")->searchable()->wrap(),
            TextColumn::make("type")->badge(),
            TextColumn::make("date")->date()->sortable(),
            IconColumn::make("is_published")->label("Published")->boolean(),
        ])->filters([SelectFilter::make("type")->options(["News" => "News", "Press Release" => "Press Release", "Announcement" => "Announcement", "Statement" => "Statement", "Article" => "Article"])])
          ->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => NewsResource\Pages\ListNews::route('/'),
            'create' => NewsResource\Pages\CreateNews::route('/create'),
            'edit' => NewsResource\Pages\EditNews::route('/{record}/edit'),
        ];
    }
}
