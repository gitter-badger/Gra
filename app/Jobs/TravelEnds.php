<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\Player;
use HempEmpire\Location;
use DB;
use Event;
use HempEmpire\Events\LocationEnter;
use HempEmpire\Events\Travel;


class TravelEnds extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    private $player;
    private $from;
    private $to;
    private $time;
    private $cost;



    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, Location $from, Location $to, $time, $cost)
    {
        $this->player = $player;
        $this->from = $from;
        $this->to = $to;
        $this->time = $time;
        $this->cost = $cost;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach($this->player->quests as $quest)
            $quest->init();

        echo __METHOD__ . PHP_EOL;
        $success = DB::transaction(function()
        {
            if($this->player->jobName == 'traveling')
            {
                $count = $this->player->getStuffsCount();

                $this->player->smugglerExperience += round($count / 2);
                $this->player->wanted = max($this->player->wanted - 1, 0);
                $this->player->wantedUpdate = time();


                return $this->player->save();
            }
            else
            {
                return false;
            }
        });

        if($success)
        {
            Event::fire(new Travel($this->player, $this->from, $this->to, $this->time, $this->cost));
            Event::fire(new LocationEnter($this->player, $this->to));
        }

        foreach($this->player->quests as $quest)
            $quest->finit();

        return $success;
    }
}
