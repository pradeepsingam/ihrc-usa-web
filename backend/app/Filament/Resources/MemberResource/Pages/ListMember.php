<?php

namespace App\Filament\Resources\MemberResource\Pages;

use App\Filament\Resources\MemberResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListMember extends ListRecords
{
    protected static string $resource = MemberResource::class;

    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }

    /** One list for all members; "Shown on website" = Leadership & People. */
    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All members'),
            'website' => Tab::make('Shown on website')->modifyQueryUsing(fn (Builder $query) => $query->where('show_on_site', true)),
            'pending' => Tab::make('Pending')->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'Pending')),
            'active' => Tab::make('Active')->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'Active')),
            'expired' => Tab::make('Expired / suspended')->modifyQueryUsing(fn (Builder $query) => $query->whereIn('status', ['Expired', 'Suspended'])),
        ];
    }
}
