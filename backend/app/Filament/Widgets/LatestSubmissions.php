<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\FormSubmissionResource;
use App\Models\FormSubmission;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestSubmissions extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Latest submissions';

    public static function canView(): bool
    {
        return auth()->user()->can('viewAny', FormSubmission::class);
    }

    public function table(Table $table): Table
    {
        return $table->query(FormSubmissionResource::getEloquentQuery()->latest('submitted_at')->limit(8))->paginated(false)
            ->columns([
                TextColumn::make('reference'),
                TextColumn::make('form')->badge(),
                TextColumn::make('subject')->wrap(),
                TextColumn::make('status')->badge()->color(fn ($state) => FormSubmissionResource::statusColor($state)),
                TextColumn::make('submitted_at')->label('Received')->since(),
            ])->recordUrl(fn ($record) => FormSubmissionResource::getUrl('view', ['record' => $record]));
    }
}
