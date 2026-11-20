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
use App\Models\Publication;

class PublicationResource extends Resource
{
    protected static ?string $model = Publication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;
    protected static string|UnitEnum|null $navigationGroup = "News & Updates";
    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make("title")->required()->maxLength(255)->columnSpanFull(),
                Select::make("category")->options(fn () => SiteStructure::publicationCategories())->required(),
                DatePicker::make("date")->label("Publication date"),
                TextInput::make("year")->maxLength(10)->helperText("Optional – taken from the date when empty."),
                Textarea::make("description")->rows(3)->columnSpanFull(),
                Fields::document("file", "publications", "Document (PDF)")->required(),
                Fields::image("cover_image", "publications", "Cover image (optional)"),
                Fields::published(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort("created_at", "desc")->columns([
            TextColumn::make("title")->searchable()->wrap(),
            TextColumn::make("category")->badge(),
            TextColumn::make("date")->date()->sortable(),
            IconColumn::make("is_published")->label("Published")->boolean(),
        ])->filters([SelectFilter::make("category")->options(fn () => SiteStructure::publicationCategories())])
          ->recordActions([EditAction::make(), DeleteAction::make()])
          ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => PublicationResource\Pages\ListPublication::route('/'),
            'create' => PublicationResource\Pages\CreatePublication::route('/create'),
            'edit' => PublicationResource\Pages\EditPublication::route('/{record}/edit'),
        ];
    }
}
