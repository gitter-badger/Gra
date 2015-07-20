<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;

use HempEmpire\Battleground;
use HempEmpire\Player;
use HempEmpire\OpponentGenerator;



class Battle extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;
    use DispatchesJobs;

    private $battleground;
    private $red;
    private $blue;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->battleground = new Battleground;
        $this->red = [];
        $this->blue = [];
    }

    protected function insertRed($character)
    {
        $this->battleground->joinRed($character);
        $this->red[] = $character;
    }

    protected function insertBlue($character)
    {
        $this->battleground->joinBlue($character);
        $this->blue[] = $character;
    }


    public function joinRed($character)
    {
        if(is_array($character))
        {
            foreach($character as $ch)
            {
                $this->insertRed($ch);
            }
        }
        else
        {
            $this->insertRed($character);
        }
    }


    public function joinBlue($character)
    {
        if(is_array($character))
        {
            foreach($character as $ch)
            {
                $this->insertBlue($ch);
            }
        }
        else
        {
            $this->insertBlue($character);
        }
    }

    public function generateRed($level)
    {
        $generator = new OpponentGenerator;
        $this->insertRed($generator->generate($level));
    }

    public function generateBlue($level)
    {
        $generator = new OpponentGenerator;
        $this->insertBlue($generator->generate($level));
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        echo __METHOD__ . PHP_EOL;


        $now = time();
        $redExp = 0;
        $blueExp = 0;


        foreach($this->red as $character)
        {
            if($character instanceof Player)
            {
                $character->healthLock = true;
                $blueExp += $character->level * $character->health;
            }
        }

        foreach($this->blue as $character)
        {
            if($character instanceof Player)
            {
                $character->healthLock = true;
                $redExp += $character->level * $character->health;
            }
        }


        $this->battleground->battle();
        $winner = $this->battleground->winner();
        $report = $this->battleground->report();

        foreach($this->red as $character)
        {
            if($character instanceof Player)
            {
                $character->newReport('battle-' . ($winner == 'red' ? 'win' : 'lose'))
                    ->param('log', $report)
                    ->send();

                if($winner != 'red')
                {
                    $character->experience += floor($redExp / 5);
                    $character->reload = true;
                    $character->jobEnd = $now;
                }
                else
                {
                    $character->experience += $redExp;
                }

                $character->healthLock = false;
                $character->save();
            }
        }

        foreach($this->blue as $character)
        {
            if($character instanceof Player)
            {
                $character->newReport('battle-' . ($winner == 'blue' ? 'win' : 'lose'))
                    ->param('log', $report)
                    ->send();

                if($winner != 'blue')
                {
                    $character->experience += floor($blueExp / 5);
                    $character->reload = true;
                    $character->jobEnd = $now;
                }
                else
                {
                    $character->experience += $blueExp;
                }

                $character->healthLock = false;
                $character->save();
            }
        }
    }
}
