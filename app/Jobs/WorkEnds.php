<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;


use HempEmpire\Player;
use HempEmpire\WorkState;
use DB;


use Event;
use HempEmpire\Events\WorkEnd;

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
    public function __construct(Player $player, WorkState $work)
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
        foreach($this->player->quests as $quest)
            $quest->init();

        echo __METHOD__ . PHP_EOL;
        $success = DB::transaction(function()
        {
            if($this->player->jobName == 'working')
            {
                $rewards = $this->work->work->getRewards();

                $this->work->done = true;
                $this->work->counter++;


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

        foreach($this->player->quests as $quest)
            $quest->finit();

        return $success;
    }
}
