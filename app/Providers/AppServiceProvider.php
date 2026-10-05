<?php

namespace App\Providers;

use App\Services\Copilot\Tools\ApplicationsSummaryTool;
use App\Services\Copilot\Tools\AssignRecruiterTool;
use App\Services\Copilot\Tools\GetCandidateDossierTool;
use App\Services\Copilot\Tools\GetRecordTool;
use App\Services\Copilot\Tools\ListApplicationsTool;
use App\Services\Copilot\Tools\ListRecordsTool;
use App\Services\Copilot\Tools\SearchCandidatesTool;
use App\Services\Copilot\Tools\SearchPolicyDocsTool;
use App\Services\Copilot\Tools\SendCandidateMessageTool;
use App\Services\Copilot\Tools\SendTemplatedCandidateMessageTool;
use App\Services\Copilot\Tools\TransitionApplicationStatusTool;
use App\Services\Copilot\Tools\UpdateRecordTool;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->tag([
            SearchCandidatesTool::class,
            GetCandidateDossierTool::class,
            ListApplicationsTool::class,
            TransitionApplicationStatusTool::class,
            AssignRecruiterTool::class,
            SendCandidateMessageTool::class,
            SearchPolicyDocsTool::class,
            ListRecordsTool::class,
            GetRecordTool::class,
            UpdateRecordTool::class,
            ApplicationsSummaryTool::class,
            SendTemplatedCandidateMessageTool::class,
        ], 'copilot.tools');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
