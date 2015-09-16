<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;


use HempEmpire\Player;
use HempEmpire\Location;
use DB;
use Event;
use HempEmpire\Events\LocationEnter;
use HempEmpire\Events\Travel;


class TravelEnds extends PlayerJob
{
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
        parent::__construct($player);
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
    public function process()
    {
        $success = DB::transaction(function()
        {
            if($this->player->jobName == 'traveling')
            {
                $count = $this->player->getStuffsCount();

                $this->player->smugglerExperience += round($count / 2);
                $this->player->wanted = max($this->player->wanted - 1, 0);
                $this->player->wantedUpdate = time();

                if($count > 0)
                {
                    if($this->player->hasTalent('smuggler-points'))
                        $this->player->givePremiumPoint();
                }


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

        return $success;
    }
}
