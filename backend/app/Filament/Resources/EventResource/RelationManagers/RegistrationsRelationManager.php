<?php

namespace App\Filament\Resources\EventResource\RelationManagers;

use App\Filament\Resources\FormSubmissionResource;
use App\Support\SubmissionExport;
use Filament\Actions\Action;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

/** Registrations sent with the event's registration form. */
class RegistrationsRelationManager extends RelationManager
{
    protected static string $relationship = 'registrations';

    protected static ?string $title = 'Registrations';

    public function isReadOnly(): bool
    {
        return true;
    }

    public function table(Table $table): Table
    {
        return $table->defaultSort('submitted_at', 'desc')->columns([
            TextColumn::make('reference'),
            TextColumn::make('name')->label('Name')->state(fn ($record) => $record->data['Full name'] ?? $record->data['Name'] ?? '—'),
            TextColumn::make('applicant_email')->label('Email'),
            TextColumn::make('guests')->label('Attendees')->state(fn ($record) => $record->data['Number of attendees'] ?? '—'),
            TextColumn::make('status')->badge()->color(fn ($state) => FormSubmissionResource::statusColor($state)),
            TextColumn::make('submitted_at')->label('Received')->dateTime('d M Y H:i'),
        ])->headerActions([
            Action::make('export')->label('Export CSV')->icon(Heroicon::ArrowDownTray)->color('gray')
                ->action(fn () => SubmissionExport::csv($this->getOwnerRecord()->registrations()->get())),
        ])->recordActions([
            Action::make('open')->icon(Heroicon::Eye)->url(fn ($record) => FormSubmissionResource::getUrl('view', ['record' => $record])),
        ]);
    }
}
