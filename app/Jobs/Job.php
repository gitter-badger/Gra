<?php

namespace HempEmpire\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;
use DB;
use Exception;


abstract class QueueableJob implements SelfHandling, ShouldQueue
{
    use Queueable;
}


abstract class Job extends QueueableJob
{
    use InteractsWithQueue, SerializesModels;
    use DispatchesJobs;



    public function delay($time)
    {
        return parent::delay($time - 1);
    }

    public final function handle()
    {
        try
        {
            $this->before();
            DB::transaction(function()
            {
                return $this->process();
            });
            $this->after();
        }
        catch(Exception $e)
        {
            echo 'Error: ' . $e->getMessage() . PHP_EOL;
            echo $e->getTraceAsString() . PHP_EOL;
        }
    }

    protected function before()
    {
        $class = get_called_class();

        echo 'Starting: ' . $class . PHP_EOL;
    }

    protected function after()
    {
        $class = get_called_class();

        echo 'Done: ' . $class . PHP_EOL;
    }

    protected abstract function process();
}
