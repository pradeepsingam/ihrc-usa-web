<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestActivity extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Latest activity';

    public static function canView(): bool
    {
        return auth()->user()->can('viewAny', ActivityLog::class);
    }

    public function table(Table $table): Table
    {
        return $table->query(ActivityLog::with('user')->latest('id')->limit(8))->paginated(false)
            ->columns(ActivityLogResource::columns());
    }
}
