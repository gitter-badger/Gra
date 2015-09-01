<?php

namespace HempEmpire\Listeners;

use HempEmpire\Events\DailyReset;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use HempEmpire\Quest;
use HempEmpire\Rewards;
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

    protected function getRewards($combo)
    {
        $rewards = Config::get('player.daily.rewards');
        krsort($rewards);

        foreach($rewards as $key => $value)
        {
            if($key > 0 && $combo % $key == 0)
            {
                return new Rewards($value);
            }
        }

        return null;
    }


    /**
     * Handle the event.
     *
     * @param  DailyReset  $event
     * @return void
     */
    public function handle(DailyReset $event)
    {
        $dailyQuests = Config::get('player.daily.quests');



        $current = $event->player->quests()->whereHas('quest', function($query)
        {
            $query->where('daily', '=', true);

        })->get();


        $counter = 0;
        foreach($current as $quest)
        {
            if($quest->active && $quest->check())
            {
                $counter++;
            }
            $quest->active = false;
            $quest->states = null;
            $quest->save();
        }

        if($counter >= $dailyQuests)
        {
            $event->player->dailyCombo++;
        }
        else
        {
            $event->player->dailyCombo = 0;
        }

        $rewards = $this->getRewards($event->player->dailyCombo);

        if(!is_null($rewards))
        {
            $rewards->give($event->player);
        }

        $event->player->dailyCombo = $event->player->dailyCombo % Config::get('player.daily.reset');

        $event->player->save();







        $quests = Quest::where('daily', '=', true)->get();

        $counter = 0;
        while(count($quests))
        {
            $index = mt_rand(0, count($quests) - 1);
            $quest = $quests[$index];
            $quests->pull($index);
            $quests = $quests->values();

            $event->player->startQuest($quest->name);

            $counter++;

            if($counter >= $dailyQuests)
                break;
        }

    }
}
