<?php

namespace HempEmpire\Providers;

use Illuminate\Support\ServiceProvider;

class ComponentServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('component.shop', function($app)
        {
            return new \HempEmpire\Components\Shop;
        });

        $this->app->bind('component.store', function($app)
        {
            return new \HempEmpire\Components\Store;
        });

        $this->app->bind('component.rent', function($app)
        {
            return new \HempEmpire\Components\Rent;
        });

        $this->app->bind('component.travel', function($app)
        {
            return new \HempEmpire\Components\Travel;
        });

        $this->app->bind('component.work', function($app)
        {
            return new \HempEmpire\Components\Work;
        });

        $this->app->bind('component.plantation', function($app)
        {
            return new \HempEmpire\Components\Plantation;
        });

        $this->app->bind('component.dealing', function($app)
        {
            return new \HempEmpire\Components\Dealing;
        });

        $this->app->bind('component.market', function($app)
        {
            return new \HempEmpire\Components\Market;
        });

        $this->app->bind('component.vehicleTravel', function($app)
        {
            return new \HempEmpire\Components\VehicleTravel;
        });

        $this->app->bind('component.arrest', function($app)
        {
            return new \HempEmpire\Components\Arrest;
        });

        $this->app->bind('component.investment', function($app)
        {
            return new \HempEmpire\Components\Investment;
        });

        $this->app->bind('component.gambling', function($app)
        {
            return new \HempEmpire\Components\Gambling;
        });

        $this->app->bind('component.bank', function($app)
        {
            return new \HempEmpire\Components\Bank;
        });

        $this->app->bind('component.church', function($app)
        {
            return new \HempEmpire\Components\Church;
        });

        $this->app->bind('component.hospital', function($app)
        {
            return new \HempEmpire\Components\Hospital;
        });

        $this->app->bind('component.attack', function($app)
        {
            return new \HempEmpire\Components\Attack;
        });

        $this->app->bind('component.gang', function($app)
        {
            return new \HempEmpire\Components\Gang;
        });

        $this->app->bind('component.gang-bank', function($app)
        {
            return new \HempEmpire\Components\GangBank;
        });

        $this->app->bind('component.gang-store', function($app)
        {
            return new \HempEmpire\Components\GangStore;
        });

        $this->app->bind('component.transport', function($app)
        {
            return new \HempEmpire\Components\Transport;
        });

        $this->app->bind('component.npc', function($app)
        {
            return new \HempEmpire\Components\Npc;
        });
    }
}
