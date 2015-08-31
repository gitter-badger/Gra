<?php

namespace HempEmpire\Listeners;

use HempEmpire\Events\DailyReset;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class DailyPointsReset
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  DailyReset  $event
     * @return void
     */
    public function handle(DailyReset $event)
    {
        $event->player->todayPoints = 0;
    }
}
