<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;


use HempEmpire\Player;
use HempEmpire\Rewards;


class Reward extends PlayerJob
{
    private $rewards;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, Rewards $rewards)
    {
        parent::__construct($player);
        $this->rewards = $rewards;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    protected function process()
    {
        $this->rewards->give($this->player);
    }
}
