<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\Player;
use HempEmpire\Location;


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
        $this->player->location()->associate($this->location);
        $this->player->location_place_id = null;
        $this->player->wanted--;


        $this->player->save();
    }
}
