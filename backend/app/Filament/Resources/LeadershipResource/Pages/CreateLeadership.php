<?php

namespace App\Filament\Resources\LeadershipResource\Pages;

use App\Filament\Resources\LeadershipResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLeadership extends CreateRecord
{
    protected static string $resource = LeadershipResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $data + ['show_on_site' => true, 'joined_at' => now()];
    }
}
