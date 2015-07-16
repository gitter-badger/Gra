<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\Player;
use HempEmpire\CurrentWork;
use DB;

class WorkEnds extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    private $player;
    private $work;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, CurrentWork $work)
    {
        $this->player = $player;
        $this->work = $work;
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
            if($this->player->jobName == 'working')
            {
                $rewards = $this->work->work->getRewards();

                $this->work->done = true;


                return $this->work->save() &&
                    $rewards->give($this->player);
            }
            else
            {
                return false;
            }
        });

        if($success)
            $this->player->completeQuest('first-work');

        return $success;
    }
}
