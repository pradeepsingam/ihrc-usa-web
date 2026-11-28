<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Models\ProgramDetail;
use App\Support\SiteStructure;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class ProgramDetailResource extends Resource
{
    protected static ?string $model = ProgramDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static string|UnitEnum|null $navigationGroup = 'Website pages';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Programs';

    protected static ?string $modelLabel = 'program';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(2)->columnSpanFull()->schema([
                TextInput::make('title')->label('Program title')->required()->maxLength(190),
                Fields::slug()->required()->maxLength(190),
                TextInput::make('number')->label('Objective number')->numeric()->minValue(1)->required(),
                TextInput::make('category')->datalist(fn () => array_keys(SiteStructure::programCategories()))->required()->maxLength(190),
                TextInput::make('sort')->label('Display order')->numeric()->minValue(0)->default(0),
                Fields::published(),
                Textarea::make('summary')->label('Short description (program cards)')->rows(3)->columnSpanFull(),
                Fields::richText('description', 'Full program description', 'programs'),
                Fields::image('image', 'programs', 'Program image upload'),
                TextInput::make('image_url')->label('Program image URL')->maxLength(1000)
                    ->rules(['nullable', 'regex:~^(?:https?://|/)[^\\s]*$~'])
                    ->helperText('An uploaded image takes priority over this URL.'),
                TextInput::make('location'),
                DatePicker::make('date'),
                TagsInput::make('activities')->placeholder('Type an activity and press Enter')->columnSpanFull(),
                Fields::gallery('images', 'programs'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('sort')->columns([
            TextColumn::make('number')->label('No.')->sortable(),
            TextColumn::make('title')->searchable()->sortable(),
            TextColumn::make('category')->searchable()->sortable(),
            IconColumn::make('is_published')->label('Published')->boolean(),
            TextColumn::make('location'),
            TextColumn::make('updated_at')->label('Last edited')->since(),
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
