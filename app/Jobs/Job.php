<?php

namespace HempEmpire\Jobs;

use Illuminate\Bus\Queueable;


abstract class QueueableJob
{
    use Queueable;
}


abstract class Job extends QueueableJob
{
    /*
    |--------------------------------------------------------------------------
    | Queueable Jobs
    |--------------------------------------------------------------------------
    |
    | This job base class provides a central location to place any logic that
    | is shared across all of your jobs. The trait included with the class
    | provides access to the "queueOn" and "delay" queue helper methods.
    |
    */



    public function delay($time)
    {
        return parent::delay($time - 1);
    }
}
