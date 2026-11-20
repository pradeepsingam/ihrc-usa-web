<?php

namespace App\Filament\Resources\NewsletterResource\Pages;

use App\Filament\Resources\NewsletterResource;
use Filament\Resources\Pages\EditRecord;

class EditNewsletter extends EditRecord
{
    protected static string $resource = NewsletterResource::class;

    protected function getHeaderActions(): array
    {
        return [NewsletterResource::testAction(), NewsletterResource::sendAction(), \Filament\Actions\DeleteAction::make()->visible(fn ($record) => ! $record->sent_at)];
    }
}
