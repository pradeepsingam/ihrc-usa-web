<?php

namespace App\Providers;

use App\Http\Controllers\Api\ContentController;
use App\Models;
use App\Models\ActivityLog;
use App\Policies;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /** Which role rules apply to which records (requirements 4.1). */
    public const POLICIES = [
        Policies\ContentPolicy::class => [Models\News::class, Models\Event::class, Models\Project::class, Models\Publication::class,
            Models\Supporter::class, Models\Partner::class, Models\Branch::class, Models\AwardCategory::class,
            Models\ProgramDetail::class, Models\Page::class],
        Policies\MemberPolicy::class => [Models\Member::class],
        Policies\SubmissionPolicy::class => [Models\FormSubmission::class],
        Policies\SubscriberPolicy::class => [Models\Subscriber::class, Models\Newsletter::class],
        Policies\AdminOnlyPolicy::class => [Models\Setting::class, Models\User::class, Models\FormDefinition::class],
        Policies\ActivityLogPolicy::class => [Models\ActivityLog::class],
    ];

    /** Changes to these models are not written to the activity log. */
    protected const NOT_LOGGED = [ActivityLog::class];

    /** Fields never written to the activity log. */
    protected const HIDDEN_FIELDS = ['password', 'remember_token', 'app_authentication_secret', 'app_authentication_recovery_codes', 'updated_at', 'created_at', 'token'];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        foreach (self::POLICIES as $policy => $models) {
            foreach ($models as $model) {
                Gate::policy($model, $policy);
            }
        }

        // Super Admin may do everything, except change the activity log.
        Gate::before(function ($user, string $ability, array $args) {
            $target = $args[0] ?? null;
            $isLog = $target instanceof ActivityLog || $target === ActivityLog::class;

            return $user->isSuperAdmin() && ! $isLog ? true : null;
        });

        Event::listen(['eloquent.created: App\Models\*', 'eloquent.updated: App\Models\*', 'eloquent.deleted: App\Models\*'], function (string $event, array $payload) {
            /** @var Model $model */
            $model = $payload[0];

            // Any change to website content clears the cached /api/content response.
            if (! $model instanceof Models\FormSubmission && ! $model instanceof Models\User && ! $model instanceof ActivityLog && ! $model instanceof Models\Subscriber) {
                Cache::forget(ContentController::CACHE_KEY);
            }

            // Activity log: who changed what and when (only changes made by a logged-in admin).
            if (! auth()->check() || in_array($model::class, self::NOT_LOGGED, true)) {
                return;
            }
            $action = str($event)->after('eloquent.')->before(':')->toString();
            $changes = null;
            if ($action === 'updated') {
                $changes = collect($model->getChanges())->except(self::HIDDEN_FIELDS)
                    ->map(fn ($new, $field) => ['from' => self::short($model->getOriginal($field)), 'to' => self::short($new)])->all();
                if (! $changes) {
                    return;
                }
            }
            ActivityLog::record($action, $model, $changes);
        });
    }

    protected static function short($value): mixed
    {
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i');
        }
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value, JSON_UNESCAPED_UNICODE);
        }

        return is_string($value) && mb_strlen($value) > 300 ? mb_substr($value, 0, 300).'…' : $value;
    }
}
