<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\Player;
use HempEmpire\Rewards;


class Reward extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    private $player;
    private $rewards;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, Rewards $rewards)
    {
        $this->player = $player;
        $this->rewards = $rewards;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        echo __METHOD__ . PHP_EOL;
        return $this->rewards->give($this->player);
    }
}
