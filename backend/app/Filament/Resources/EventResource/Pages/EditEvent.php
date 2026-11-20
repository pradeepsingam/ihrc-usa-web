<?php

namespace App\Filament\Resources\EventResource\Pages;

use App\Filament\Resources\EventResource;
use Filament\Resources\Pages\EditRecord;

class EditEvent extends EditRecord
{
    use \App\Filament\Concerns\PreparesRichText;

    protected static string $resource = EventResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\DeleteAction::make()];
    }
}
