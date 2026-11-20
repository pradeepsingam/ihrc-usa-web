<?php

namespace App\Filament\Resources;

use App\Models\ActivityLog;
use App\Models\FormSubmission;
use App\Models\User;
use App\Services\MemberFromSubmission;
use App\Support\Mailboxes;
use App\Support\SubmissionExport;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use UnitEnum;

class FormSubmissionResource extends Resource
{
    protected static ?string $model = FormSubmission::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInboxArrowDown;

    protected static string|UnitEnum|null $navigationGroup = 'Inbox';

    protected static ?string $navigationLabel = 'Submissions';

    protected static ?string $modelLabel = 'submission';

    protected static ?int $navigationSort = 1;

    /** Forms a Membership Officer works with. */
    public const MEMBERSHIP_FORMS = ['Membership%', 'Volunteer%', 'Research%'];

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        $q = parent::getEloquentQuery();
        if (auth()->user()?->hasRole(User::MEMBERSHIP_OFFICER)) {
            $q->where(fn ($w) => collect(self::MEMBERSHIP_FORMS)->each(fn ($f) => $w->orWhere('form', 'like', $f)));
        }

        return $q;
    }

    public static function getNavigationBadge(): ?string
    {
        $n = static::getEloquentQuery()->where('status', 'New')->count();

        return $n ? (string) $n : null;
    }

    public static function statusColor(?string $state): string
    {
        return match ($state) {
            'New' => 'info', 'In review' => 'warning', 'Approved' => 'success', 'Rejected' => 'danger', default => 'gray',
        };
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->columns(3)->columnSpanFull()->schema([
                TextEntry::make('reference')->copyable()->weight('bold'),
                TextEntry::make('status')->badge()->color(fn ($state) => static::statusColor($state)),
                TextEntry::make('submitted_at')->label('Received')->dateTime(),
                TextEntry::make('form'),
                TextEntry::make('applicant_email')->label('Applicant email')->placeholder('—')->copyable(),
                TextEntry::make('mailbox')->formatStateUsing(fn ($state) => Mailboxes::BOXES[$state] ?? $state)
                    ->suffix(fn ($record) => $record->mailed_at ? ' · emailed' : ' · not emailed (mailbox not set)'),
                TextEntry::make('subject')->columnSpan(2)->placeholder('—'),
                TextEntry::make('confirmation_sent_at')->label('Confirmation to applicant')->dateTime()->placeholder('not sent'),
                TextEntry::make('event.title')->label('Event')->visible(fn ($record) => $record->event_id),
                TextEntry::make('member.member_id')->label('Member created')->visible(fn ($record) => $record->member_id)
                    ->url(fn ($record) => $record->member_id ? MemberResource::getUrl('edit', ['record' => $record->member_id]) : null),
            ]),
            Section::make('Answers')->columnSpanFull()->schema([
                KeyValueEntry::make('data')->hiddenLabel()->keyLabel('Question')->valueLabel('Answer'),
            ]),
            Section::make('Uploaded files')->columnSpanFull()->visible(fn ($record) => ! empty($record->files))->schema([
                TextEntry::make('files')->hiddenLabel()->html()
                    ->state(fn ($record) => collect($record->files)->map(fn ($f, $key) => '<a class="underline text-primary-600" target="_blank" href="'.route('admin.submission-file', [$record, $key]).'">'.e($key.': '.$f['name']).'</a>'
                        .(isset($f['scan']) && $f['scan'] !== 'clean' ? ' <span class="text-xs text-gray-500">('.e($f['scan']).')</span>' : ''))->implode('<br>')),
            ]),
            Section::make('Notes')->columnSpanFull()->schema([
                TextEntry::make('notes')->hiddenLabel()->placeholder('No notes yet.')->extraAttributes(['style' => 'white-space:pre-line']),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('submitted_at', 'desc')
            ->columns([
                IconColumn::make('read_at')->label('')->icon(fn ($state) => $state ? null : Heroicon::Envelope)->color('primary'),
                TextColumn::make('reference')->searchable()->copyable()->toggleable(),
                TextColumn::make('form')->badge()->searchable()->wrap(),
                TextColumn::make('subject')->searchable()->wrap()->weight(fn ($record) => $record->read_at ? null : 'bold'),
                TextColumn::make('status')->badge()->color(fn ($state) => static::statusColor($state))->sortable(),
                TextColumn::make('submitted_at')->label('Received')->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('form')->options(fn () => static::getEloquentQuery()->distinct()->orderBy('form')->pluck('form', 'form')->all())->searchable(),
                SelectFilter::make('status')->options(FormSubmission::STATUSES),
                Filter::make('received')->schema([
                    DatePicker::make('from')->label('Received from'),
                    DatePicker::make('until')->label('Received until'),
                ])->query(fn (Builder $q, array $data) => $q
                    ->when($data['from'] ?? null, fn ($q, $d) => $q->whereDate('submitted_at', '>=', $d))
                    ->when($data['until'] ?? null, fn ($q, $d) => $q->whereDate('submitted_at', '<=', $d)))
                    ->indicateUsing(fn (array $data) => array_filter([
                        ($data['from'] ?? null) ? 'From '.$data['from'] : null,
                        ($data['until'] ?? null) ? 'Until '.$data['until'] : null,
                    ])),
            ])
            ->headerActions([
                Action::make('exportCsv')->label('Export CSV')->icon(Heroicon::ArrowDownTray)->color('gray')
                    ->action(fn ($livewire) => SubmissionExport::csv($livewire->getFilteredSortedTableQuery()->get())),
            ])
            ->recordActions([ViewAction::make(), static::pdfAction()])
            ->toolbarActions([BulkActionGroup::make([
                BulkAction::make('exportSelected')->label('Export selected (CSV)')->icon(Heroicon::ArrowDownTray)
                    ->action(fn (Collection $records) => SubmissionExport::csv($records)),
                BulkAction::make('setStatus')->label('Change status')->icon(Heroicon::Flag)
                    ->authorize(fn () => auth()->user()->can('update', FormSubmission::class))
                    ->schema([Select::make('status')->options(FormSubmission::STATUSES)->required()])
                    ->action(function (Collection $records, array $data) {
                        $records->each(fn ($r) => $r->update(['status' => $data['status']]));
                    })->deselectRecordsAfterCompletion(),
                DeleteBulkAction::make(),
            ])]);
    }

    public static function pdfAction(): Action
    {
        return Action::make('pdf')->label('PDF')->icon(Heroicon::DocumentArrowDown)->color('gray')
            ->action(fn (FormSubmission $record) => SubmissionExport::pdf($record));
    }

    /** Buttons on the submission page. */
    public static function reviewActions(): array
    {
        $canUpdate = fn (FormSubmission $record) => auth()->user()->can('update', $record);

        return [
            Action::make('approve')->label(fn ($record) => $record->createsMember() ? 'Approve & create member' : 'Approve')
                ->icon(Heroicon::CheckCircle)->color('success')
                ->visible(fn ($record) => $canUpdate($record) && $record->status !== 'Approved')
                ->requiresConfirmation()
                ->modalDescription(fn ($record) => $record->createsMember() ? 'A member will be added to the register (status Active, expires in one year) using the answers and files from this application.' : null)
                ->schema([Textarea::make('note')->label('Note (optional)')])
                ->action(function (FormSubmission $record, array $data) {
                    if ($record->createsMember()) {
                        $m = app(MemberFromSubmission::class)->approve($record, $data['note'] ?? null);
                        Notification::make()->success()->title('Approved – member '.$m->member_id.' created')->send();
                    } else {
                        $record->update(['status' => 'Approved']);
                        $record->addNote('Approved.'.(($data['note'] ?? '') ? ' '.$data['note'] : ''));
                        ActivityLog::record('approved', $record);
                        Notification::make()->success()->title('Approved')->send();
                    }
                }),
            Action::make('reject')->icon(Heroicon::XCircle)->color('danger')
                ->visible(fn ($record) => $canUpdate($record) && $record->status !== 'Rejected')
                ->schema([Textarea::make('note')->label('Reason')->required()])
                ->action(function (FormSubmission $record, array $data) {
                    $record->update(['status' => 'Rejected']);
                    $record->addNote('Rejected: '.$data['note']);
                    ActivityLog::record('rejected', $record);
                    Notification::make()->title('Rejected')->send();
                }),
            Action::make('status')->label('Change status')->icon(Heroicon::Flag)->color('gray')->visible($canUpdate)
                ->fillForm(fn ($record) => ['status' => $record->status])
                ->schema([Select::make('status')->options(FormSubmission::STATUSES)->required(), Textarea::make('note')])
                ->action(function (FormSubmission $record, array $data) {
                    $record->update(['status' => $data['status']]);
                    if (filled($data['note'] ?? null)) {
                        $record->addNote($data['note']);
                    }
                }),
            Action::make('note')->label('Add note')->icon(Heroicon::ChatBubbleLeftEllipsis)->color('gray')->visible($canUpdate)
                ->schema([Textarea::make('note')->required()->rows(4)])
                ->action(fn (FormSubmission $record, array $data) => $record->addNote($data['note'])),
            static::pdfAction(),
            DeleteAction::make(),
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => FormSubmissionResource\Pages\ListFormSubmission::route('/'),
            'view' => FormSubmissionResource\Pages\ViewFormSubmission::route('/{record}'),
        ];
    }
}
