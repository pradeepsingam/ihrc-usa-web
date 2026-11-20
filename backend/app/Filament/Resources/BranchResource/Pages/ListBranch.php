<?php

namespace App\Filament\Resources\BranchResource\Pages;

use App\Filament\Resources\BranchResource;
use Filament\Resources\Pages\ListRecords;

class ListBranch extends ListRecords
{
    protected static string $resource = BranchResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }
}
