<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\FormSubmissionResource;
use App\Filament\Resources\MemberResource;
use App\Filament\Resources\SubscriberResource;
use App\Models\FormSubmission;
use App\Models\Member;
use App\Models\Subscriber;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $user = auth()->user();
        $stats = [];
        if ($user->can('viewAny', FormSubmission::class)) {
            $q = FormSubmissionResource::getEloquentQuery();
            $stats[] = Stat::make('New submissions', (clone $q)->where('status', 'New')->count())
                ->description((clone $q)->where('submitted_at', '>=', now()->subDays(7))->count().' received in the last 7 days')
                ->color('info')->url(FormSubmissionResource::getUrl('index', ['tableFilters' => ['status' => ['value' => 'New']]]));
            $stats[] = Stat::make('In review', (clone $q)->where('status', 'In review')->count())->color('warning');
        }
        if ($user->can('viewAny', Member::class)) {
            $stats[] = Stat::make('Active members', Member::where('status', 'Active')->count())
                ->description(Member::where('status', 'Pending')->count().' pending · '.Member::where('status', 'Active')->whereDate('expires_at', '<', now()->addDays(30))->count().' expire within 30 days')
                ->color('success')->url(MemberResource::getUrl());
        }
        if ($user->can('viewAny', Subscriber::class)) {
            $stats[] = Stat::make('Subscribers', Subscriber::active()->count())
                ->description(Subscriber::whereNull('confirmed_at')->whereNull('unsubscribed_at')->count().' waiting for confirmation')
                ->url(SubscriberResource::getUrl());
        }

        return $stats;
    }
}
