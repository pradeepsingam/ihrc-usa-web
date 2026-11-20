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
use App\Models\Setting;

class SettingResource extends Resource
{
    protected static ?string $model = Setting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;
    protected static string|UnitEnum|null $navigationGroup = "Administration";
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationLabel = "Settings";

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort("sort")->paginated(false)
            ->defaultGroup(\Filament\Tables\Grouping\Group::make("key")->label("")->getTitleFromRecordUsing(fn ($record) => str_starts_with($record->key, "mailbox.") ? "Mailboxes – where each website form is sent" : (str_starts_with($record->key, "social.") ? "Social links" : "Contact details and payment"))->getKeyFromRecordUsing(fn ($record) => str_starts_with($record->key, "mailbox.") ? "3" : (str_starts_with($record->key, "social.") ? "2" : "1"))->orderQueryUsing(fn ($q) => $q))
            ->description("Click a value to edit it; changes save automatically. Mailboxes: forms whose mailbox is empty go to the Info mailbox, then to the contact email.")
            ->headerActions([
                \Filament\Actions\Action::make("testEmail")->label("Send test email")->icon(Heroicon::Envelope)->color("gray")
                    ->modalDescription(fn () => \App\Support\MailCheck::describe())
                    ->fillForm(fn () => ["to" => auth()->user()->email])
                    ->schema([TextInput::make("to")->label("Send to")->email()->required()])
                    ->action(function (array $data) {
                        $error = \App\Support\MailCheck::send($data["to"]);
                        $n = \Filament\Notifications\Notification::make();
                        $error ? $n->danger()->title("Sending failed")->body($error)->persistent()->send()
                               : $n->success()->title(\App\Support\MailCheck::sentMessage($data["to"]))->send();
                    }),
            ])
            ->columns([
                TextColumn::make("label")->label("Setting")->weight("bold"),
                TextInputColumn::make("value")->label("Value"),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => SettingResource\Pages\ListSetting::route('/'),
        ];
    }
}
