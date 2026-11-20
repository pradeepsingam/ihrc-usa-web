<?php

namespace App\Filament\Resources;

use App\Filament\Support\Fields;
use App\Mail\NewsletterMail;
use App\Models\ActivityLog;
use App\Models\Newsletter;
use App\Models\Subscriber;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;
use UnitEnum;

/** Write and send newsletters to confirmed subscribers. Every email has an unsubscribe link. */
class NewsletterResource extends Resource
{
    protected static ?string $model = Newsletter::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelopeOpen;

    protected static string|UnitEnum|null $navigationGroup = 'Newsletter';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columnSpanFull()->schema([
                TextInput::make('subject')->required()->maxLength(190),
                Fields::richText('body', 'Message', 'newsletters')->required(),
            ])->disabled(fn (?Newsletter $record) => (bool) $record?->sent_at),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('created_at', 'desc')->columns([
            TextColumn::make('subject')->searchable()->wrap(),
            TextColumn::make('sent_at')->label('Sent')->dateTime('d M Y H:i')->placeholder('Draft'),
            TextColumn::make('sent_count')->label('Recipients'),
        ])->recordActions([EditAction::make(), static::sendAction(), DeleteAction::make()->visible(fn ($record) => ! $record->sent_at)]);
    }

    public static function sendAction(): Action
    {
        return Action::make('send')->label('Send')->icon(Heroicon::PaperAirplane)->color('success')
            ->visible(fn (Newsletter $record) => ! $record->sent_at && auth()->user()->can('update', $record))
            ->requiresConfirmation()
            ->modalDescription(fn () => 'This newsletter will be emailed to '.Subscriber::active()->count().' confirmed subscribers. It cannot be undone.')
            ->action(function (Newsletter $record) {
                $count = 0;
                Subscriber::active()->orderBy('id')->chunk(200, function ($subs) use ($record, &$count) {
                    foreach ($subs as $s) {
                        Mail::to($s->email)->queue(new NewsletterMail($record, $s));
                        $count++;
                    }
                });
                $record->update(['sent_at' => now(), 'sent_count' => $count, 'sent_by' => auth()->id()]);
                ActivityLog::record('sent', $record, ['recipients' => $count]);
                Notification::make()->success()->title("Newsletter queued for $count subscribers")->send();
            });
    }

    public static function testAction(): Action
    {
        return Action::make('test')->label('Send test to me')->icon(Heroicon::Beaker)->color('gray')
            ->action(function (Newsletter $record) {
                $me = Subscriber::firstOrNew(['email' => auth()->user()->email]);
                Mail::to(auth()->user()->email)->send(new NewsletterMail($record, $me->exists ? $me : tap($me, fn ($m) => $m->token = 'preview')));
                Notification::make()->success()->title('Test sent to '.auth()->user()->email)->send();
            });
    }

    public static function getPages(): array
    {
        return [
            'index' => NewsletterResource\Pages\ListNewsletter::route('/'),
            'create' => NewsletterResource\Pages\CreateNewsletter::route('/create'),
            'edit' => NewsletterResource\Pages\EditNewsletter::route('/{record}/edit'),
        ];
    }
}
