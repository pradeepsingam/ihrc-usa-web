<?php

namespace App\Filament\Resources\FormSubmissionResource\Pages;

use App\Filament\Resources\FormSubmissionResource;
use Filament\Resources\Pages\ListRecords;

class ListSetting extends ListRecords
{
    protected static string $resource = FormSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return $this->getResource()::canCreate() ? [\Filament\Actions\CreateAction::make()] : [];
    }
}
