<?php

namespace App\Filament\Resources\FormDefinitionResource\Pages;

use App\Filament\Resources\FormDefinitionResource;
use Filament\Resources\Pages\ListRecords;

class ListFormDefinition extends ListRecords
{
    protected static string $resource = FormDefinitionResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }
}
