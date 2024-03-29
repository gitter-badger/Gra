<?php

namespace HempEmpire\Providers;

use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;



class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'HempEmpire\Events\PlaceLeave' => [
            'HempEmpire\Listeners\Search',
            'HempEmpire\Listeners\Beat',
        ],

        'HempEmpire\Events\PlaceEnter' => [
            'HempEmpire\Listeners\DangerousPlace',
        ],

        'HempEmpire\Events\DailyReset' => [
            'HempEmpire\Listeners\DailyPointsReset',
            'HempEmpire\Listeners\DailyQuests',
        ],
    ];

    /**
     * Register any other events for your application.
     *
     * @param  \Illuminate\Contracts\Events\Dispatcher  $events
     * @return void
     */
    public function boot(DispatcherContract $events)
    {
        parent::boot($events);
    }
}
