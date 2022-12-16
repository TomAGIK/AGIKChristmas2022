<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\Laravel\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        Sanctum::ignoreMigrations();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        Schema::defaultStringLength(191);
    }
}
