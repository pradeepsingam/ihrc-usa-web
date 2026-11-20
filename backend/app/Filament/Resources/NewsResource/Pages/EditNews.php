<?php

namespace App\Filament\Resources\NewsResource\Pages;

use App\Filament\Resources\NewsResource;
use Filament\Resources\Pages\EditRecord;

class EditNews extends EditRecord
{
    use \App\Filament\Concerns\PreparesRichText;

    protected static string $resource = NewsResource::class;

    protected function getHeaderActions(): array
    {
        return [\App\Filament\Support\Preview::action(), \Filament\Actions\DeleteAction::make()];
    }
}
