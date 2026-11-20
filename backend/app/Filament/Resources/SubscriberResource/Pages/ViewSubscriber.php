<?php

namespace App\Filament\Resources\SubscriberResource\Pages;

use App\Filament\Resources\SubscriberResource;
use Filament\Resources\Pages\ViewRecord;

class ViewSubscriber extends ViewRecord
{
    protected static string $resource = SubscriberResource::class;

    public function getTitle(): string
    {
        return $this->record->email;
    }

    protected function getHeaderActions(): array
    {
        return SubscriberResource::subscriberActions();
    }
}
