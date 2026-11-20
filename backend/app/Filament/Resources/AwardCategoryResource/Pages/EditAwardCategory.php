<?php

namespace App\Filament\Resources\AwardCategoryResource\Pages;

use App\Filament\Resources\AwardCategoryResource;
use Filament\Resources\Pages\EditRecord;

class EditAwardCategory extends EditRecord
{
    protected static string $resource = AwardCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\DeleteAction::make()];
    }
}
