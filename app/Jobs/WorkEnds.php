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



// Only let PHP report errors in dev
error_reporting(E_ALL);

$error_handler = function()
{
    // Check for unhandled errors (fatal shutdown)
    $e = error_get_last();

    // If none, check function args (error handler)
    if($e === null)
        $e = func_get_args();

    // Return if no error
    if(empty($e))
        return;

    // "Normalize" exceptions (exception handler)
    if($e[0] instanceof Exception)
    {
        call_user_func_array(__FUNCTION__, array(
            $e[0]->getCode(),
            $e[0]->getMessage(),
            $e[0]->getFile(),
            $e[0]->getLine(),
            $e[0]));
        return;
    }

    // Create with consistent array keys
    $e = array_combine(array('number', 'message', 'file', 'line', 'context'), 
                       array_pad($e, 5, null));

    // Output error page
    var_dump($e);
    exit;
};

// Register handler
set_error_handler($error_handler);
set_exception_handler($error_handler);
register_shutdown_function($error_handler);






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

        foreach($this->player->quests as $quest)
            $quest->finit();

        return $success;
        
    }
}
