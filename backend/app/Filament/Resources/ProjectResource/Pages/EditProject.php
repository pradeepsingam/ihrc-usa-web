<?php

namespace App\Filament\Resources\ProjectResource\Pages;

use App\Filament\Resources\ProjectResource;
use Filament\Resources\Pages\EditRecord;

class EditProject extends EditRecord
{
    use \App\Filament\Concerns\PreparesRichText;

    protected static string $resource = ProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [\App\Filament\Support\Preview::action(), \Filament\Actions\DeleteAction::make()];
    }
}
