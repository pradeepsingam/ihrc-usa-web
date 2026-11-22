<?php

namespace App\Filament\Resources;

use App\Mail\SubscribeConfirmation;
use App\Models\Subscriber;
use App\Services\SubscriberWelcome;
use App\Support\Csv;
use App\Support\MailCheck;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use UnitEnum;

/** Newsletter subscribers (requirements 4.6): view, search, export, unsubscribe. */
class SubscriberResource extends Resource
{
    protected static ?string $model = Subscriber::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAtSymbol;

    protected static string|UnitEnum|null $navigationGroup = 'Newsletter';

    protected static ?int $navigationSort = 1;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function status(Subscriber $s): string
    {
        return $s->unsubscribed_at ? 'Unsubscribed' : ($s->confirmed_at ? 'Subscribed' : 'Waiting for confirmation');
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Subscriber')->columns(3)->columnSpanFull()->schema([
                TextEntry::make('email')->copyable(),
                TextEntry::make('name')->placeholder('—'),
                TextEntry::make('status')->state(fn ($record) => static::status($record))->badge()
                    ->color(fn ($state) => match ($state) {
                        'Subscribed' => 'success', 'Unsubscribed' => 'gray', default => 'warning'
                    }),
                TextEntry::make('created_at')->label('Signed up')->dateTime('d M Y H:i'),
                TextEntry::make('confirmed_at')->label('Confirmed')->dateTime('d M Y H:i')->placeholder('Not confirmed yet'),
                TextEntry::make('unsubscribed_at')->label('Unsubscribed')->dateTime('d M Y H:i')->placeholder('—'),
                TextEntry::make('welcome_sent_at')->label('Welcome email sent')->dateTime('d M Y H:i')->placeholder('Not sent'),
                TextEntry::make('welcome_error')->label('Email delivery issue')->placeholder('None')->columnSpanFull(),
                TextEntry::make('ip')->label('Signed up from (IP address)')->placeholder('—'),
                TextEntry::make('updated_at')->label('Last change')->since(),
            ]),
        ]);
    }

    /** Buttons on a subscriber's page. */
    public static function subscriberActions(): array
    {
        return [
            Action::make('welcome')->label('Resend subscription email')->icon(Heroicon::Envelope)->color('gray')
                ->visible(fn ($record) => $record->isActive() && auth()->user()->can('update', $record))
                ->action(function (Subscriber $record) {
                    $sent = app(SubscriberWelcome::class)->send($record);
                    $notification = Notification::make()->title($sent ? 'Subscription email sent' : 'Could not send the email');
                    ($sent ? $notification->success() : $notification->danger())->send();
                }),
            Action::make('resend')->label('Resend confirmation email')->icon(Heroicon::Envelope)->color('gray')
                ->visible(fn ($record) => ! $record->confirmed_at && ! $record->unsubscribed_at && auth()->user()->can('update', $record))
                ->action(function (Subscriber $record) {
                    try {
                        Mail::to($record->email)->send(new SubscribeConfirmation($record));
                        Notification::make()->success()->title('Confirmation email sent to '.$record->email)->body(MailCheck::describe())->send();
                    } catch (\Throwable $e) {
                        Notification::make()->danger()->title('Could not send the email')->body($e->getMessage())->persistent()->send();
                    }
                }),
            Action::make('confirm')->label('Mark as confirmed')->icon(Heroicon::CheckCircle)->color('success')->requiresConfirmation()
                ->modalDescription('Only do this when the person asked you directly to be subscribed.')
                ->visible(fn ($record) => ! $record->isActive() && auth()->user()->can('update', $record))
                ->action(fn (Subscriber $record) => $record->update(['confirmed_at' => now(), 'unsubscribed_at' => null])),
            Action::make('unsubscribe')->icon(Heroicon::NoSymbol)->color('danger')->requiresConfirmation()
                ->visible(fn ($record) => ! $record->unsubscribed_at && auth()->user()->can('update', $record))
                ->action(fn (Subscriber $record) => $record->update(['unsubscribed_at' => now()])),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('created_at', 'desc')->columns([
            TextColumn::make('email')->searchable()->copyable(),
            TextColumn::make('name')->searchable()->placeholder('—'),
            TextColumn::make('status')->state(fn ($record) => static::status($record))->badge()
                ->color(fn ($state) => match ($state) {
                    'Subscribed' => 'success', 'Unsubscribed' => 'gray', default => 'warning'
                }),
            TextColumn::make('created_at')->label('Signed up')->dateTime('d M Y H:i')->sortable(),
            TextColumn::make('confirmed_at')->label('Subscribed since')->dateTime('d M Y H:i')->placeholder('—')->toggleable(),
            TextColumn::make('welcome_sent_at')->label('Welcome email sent')->dateTime('d M Y H:i')->placeholder('Not sent')->toggleable(),
            TextColumn::make('welcome_error')->label('Email delivery issue')->wrap()->placeholder('None')->toggleable(isToggledHiddenByDefault: true),
            TextColumn::make('unsubscribed_at')->label('Unsubscribed')->dateTime('d M Y H:i')->placeholder('—')->toggleable(),
        ])->recordUrl(fn ($record) => static::getUrl('view', ['record' => $record]))->filters([
            SelectFilter::make('state')->label('Status')->options(['active' => 'Subscribed', 'pending' => 'Waiting for confirmation', 'unsubscribed' => 'Unsubscribed'])
                ->query(fn (Builder $query, array $data) => match ($data['value'] ?? null) {
                    'active' => $query->active(),
                    'pending' => $query->whereNull('confirmed_at')->whereNull('unsubscribed_at'),
                    'unsubscribed' => $query->whereNotNull('unsubscribed_at'),
                    default => $query,
                }),
        ])->headerActions([
            Action::make('export')->label('Export CSV')->icon(Heroicon::ArrowDownTray)->color('gray')
                ->action(fn ($livewire) => static::export($livewire->getFilteredSortedTableQuery()->get())),
        ])->recordActions([
            ViewAction::make(),
            Action::make('unsubscribe')->icon(Heroicon::NoSymbol)->color('danger')->requiresConfirmation()
                ->visible(fn ($record) => ! $record->unsubscribed_at && auth()->user()->can('update', $record))
                ->action(fn (Subscriber $record) => $record->update(['unsubscribed_at' => now()])),
        ])->toolbarActions([BulkActionGroup::make([
            BulkAction::make('exportSelected')->label('Export selected (CSV)')->icon(Heroicon::ArrowDownTray)->action(fn (Collection $records) => static::export($records)),
            BulkAction::make('unsubscribe')->label('Unsubscribe')->icon(Heroicon::NoSymbol)->requiresConfirmation()
                ->authorize(fn () => auth()->user()->can('update', Subscriber::class))
                ->action(fn (Collection $records) => $records->each->update(['unsubscribed_at' => now()])),
            DeleteBulkAction::make(),
        ])]);
    }

    public static function export(Collection $rows)
    {
        return Csv::download('subscribers-'.now()->format('Y-m-d').'.csv', ['email', 'name', 'status', 'signed_up', 'confirmed'],
            $rows->map(fn (Subscriber $s) => ['email' => $s->email, 'name' => $s->name, 'status' => static::status($s),
                'signed_up' => $s->created_at?->format('Y-m-d'), 'confirmed' => $s->confirmed_at?->format('Y-m-d')]));
    }

    public static function getPages(): array
    {
        return [
            'index' => SubscriberResource\Pages\ListSubscriber::route('/'),
            'view' => SubscriberResource\Pages\ViewSubscriber::route('/{record}'),
        ];
    }
}
