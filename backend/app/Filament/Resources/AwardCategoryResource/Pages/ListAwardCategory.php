<?php

namespace App\Filament\Resources\AwardCategoryResource\Pages;

use App\Filament\Resources\AwardCategoryResource;
use Filament\Resources\Pages\ListRecords;

class ListAwardCategory extends ListRecords
{
    protected static string $resource = AwardCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }
}
