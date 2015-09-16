<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;


use HempEmpire\Player;
use HempEmpire\WorkState;
use DB;


use Event;
use HempEmpire\Events\WorkEnd;







class WorkEnds extends PlayerJob
{
    private $work;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, WorkState $work)
    {
        parent::__construct($player);
        $this->work = $work;
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
            if($this->player->jobName == 'working')
            {
                $rewards = $this->work->work->getRewards();

                $this->work->done = true;
                $this->work->counter++;

                if($this->player->hasTalent('work-points'))
                {
                    $this->player->givePremiumPoint();
                }


                return $this->work->save() &&
                    $rewards->give($this->player);
            }
            else
            {
                return false;
            }
        });

        if($success)
        {
            Event::fire(new WorkEnd($this->player, $this->work));
        }

        return $success;
        
    }
}
