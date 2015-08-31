<?php

namespace HempEmpire\Listeners;

use HempEmpire\Events\DailyReset;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Config;

class DailyQuests
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
        $dailies = Config::get('daily');

        $index = mt_rand(0, count($dailies) - 1);
        $daily = $dailies[$index];

        $event->player->startQuest($daily);
    }
}
