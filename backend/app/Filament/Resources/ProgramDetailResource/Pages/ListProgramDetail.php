<?php

namespace App\Filament\Resources\ProgramDetailResource\Pages;

use App\Filament\Resources\ProgramDetailResource;
use Filament\Resources\Pages\ListRecords;

class ListProgramDetail extends ListRecords
{
    protected static string $resource = ProgramDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }
}
