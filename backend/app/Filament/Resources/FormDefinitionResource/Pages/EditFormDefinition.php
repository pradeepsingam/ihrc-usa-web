<?php

namespace App\Filament\Resources\FormDefinitionResource\Pages;

use App\Filament\Resources\FormDefinitionResource;
use Filament\Resources\Pages\EditRecord;

class EditFormDefinition extends EditRecord
{
    protected static string $resource = FormDefinitionResource::class;

    protected function getHeaderActions(): array
    {
        return [\App\Filament\Support\Preview::action(), \Filament\Actions\DeleteAction::make()];
    }
}
