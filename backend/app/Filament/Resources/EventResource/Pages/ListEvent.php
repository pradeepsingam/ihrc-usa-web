<?php

namespace App\Filament\Resources\EventResource\Pages;

use App\Filament\Resources\EventResource;
use Filament\Resources\Pages\ListRecords;

class ListEvent extends ListRecords
{
    protected static string $resource = EventResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }
}
