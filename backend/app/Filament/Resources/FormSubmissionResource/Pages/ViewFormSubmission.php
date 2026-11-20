<?php

namespace App\Filament\Resources\FormSubmissionResource\Pages;

use App\Filament\Resources\FormSubmissionResource;
use Filament\Resources\Pages\ViewRecord;

class ViewFormSubmission extends ViewRecord
{
    protected static string $resource = FormSubmissionResource::class;

    public function mount(int|string $record): void
    {
        parent::mount($record);

        if (! $this->record->read_at) {
            $this->record->forceFill(['read_at' => now()])->saveQuietly();
        }
    }

    public function getTitle(): string
    {
        return $this->record->reference ?: 'Submission';
    }

    protected function getHeaderActions(): array
    {
        return FormSubmissionResource::reviewActions();
    }
}
