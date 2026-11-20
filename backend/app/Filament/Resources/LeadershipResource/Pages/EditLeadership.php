<?php

namespace App\Filament\Resources\LeadershipResource\Pages;

use App\Filament\Resources\LeadershipResource;
use Filament\Resources\Pages\EditRecord;

class EditLeadership extends EditRecord
{
    protected static string $resource = LeadershipResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\DeleteAction::make()];
    }
}
