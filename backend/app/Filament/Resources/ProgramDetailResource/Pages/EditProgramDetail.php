<?php

namespace App\Filament\Resources\ProgramDetailResource\Pages;

use App\Filament\Resources\ProgramDetailResource;
use Filament\Resources\Pages\EditRecord;

class EditProgramDetail extends EditRecord
{
    protected static string $resource = ProgramDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\DeleteAction::make()];
    }
}
