<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Models\AwardCategory;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class AwardCategoryResource extends Resource
{
    protected static ?string $model = AwardCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static string|UnitEnum|null $navigationGroup = 'Organisation';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columnSpanFull()->schema([
                TextInput::make('name')->required(),
                Fields::richText('description', 'Full award category details', 'awards'),
                Fields::image('image', 'awards', 'Image (shown on the Awards page)'),
                TextInput::make('sort')->label('Order')->numeric()->default(0),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->reorderable('sort')->defaultSort('sort')->columns([
            ImageColumn::make('image')->disk('public'),
            TextColumn::make('name')->searchable(),
            TextColumn::make('description')->limit(80),
        ])->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => AwardCategoryResource\Pages\ListAwardCategory::route('/'),
            'create' => AwardCategoryResource\Pages\CreateAwardCategory::route('/create'),
            'edit' => AwardCategoryResource\Pages\EditAwardCategory::route('/{record}/edit'),
        ];
    }
}
