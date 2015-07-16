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


class TravelEnds extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    private $player;
    private $location;



    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, Location $location)
    {
        $this->player = $player;
        $this->location = $location;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        echo __METHOD__ . PHP_EOL;
        $success = DB::transaction(function()
        {
            if($this->player->jobName == 'traveling')
            {
                $count = $this->player->getStuffsCount();

                $this->player->experience += ceil($count / 10);
                $this->player->smugglerExperience += $count;
                $this->player->wanted--;
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
            Event::fire(new LocationEnter($this->player, $this->location));
            $this->player->completeQuest('first-travel');
        }

        return $success;
    }
}
