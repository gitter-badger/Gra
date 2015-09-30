<?php

namespace HempEmpire\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;
use HempEmpire\Debug;
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

    protected $transaction = true;



    public function delay($time)
    {
        return parent::delay($time - 1);
    }

    protected final function log($string)
    {
        Debug::log($string);
    }

    public final function handle()
    {
        try
        {
            $this->before();

            if($this->transaction)
            {
                DB::transaction(function()
                {
                    return $this->process();
                });
            }
            else
            {
                $this->process();
            }
            $this->after();
        }
        catch(Exception $e)
        {
            $this->log('Error: ' . $e->getMessage());
            $this->log($e->getTraceAsString());
        }
    }

    protected function before()
    {
        Debug::set(true);
        $class = get_called_class();

        $this->log('Starting: ' . $class);
    }

    protected function after()
    {
        $class = get_called_class();

        $this->log('Done: ' . $class);

        //Debug::set(false);
    }

    protected abstract function process();
}
