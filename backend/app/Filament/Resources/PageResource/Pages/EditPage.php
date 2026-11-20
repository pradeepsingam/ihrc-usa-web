<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use Filament\Resources\Pages\EditRecord;

class EditPage extends EditRecord
{
    use \App\Filament\Concerns\PreparesRichText;

    protected static string $resource = PageResource::class;
}
