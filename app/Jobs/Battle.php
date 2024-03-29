<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;

use HempEmpire\Battleground;
use HempEmpire\Player;
use HempEmpire\OpponentGenerator;
use HempEmpire\ReportDialog;
use HempEmpire\Events\Fight;
use TextArray;
use TransText;
use Event;


class Battle extends Job
{
    protected $battleground;
    protected $red;
    protected $blue;
    protected $reasonRed;
    protected $reasonBlue;


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
        $this->reasonRed = null;
        $this->reasonBlue = null;
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

    public function reason($team, $reason)
    {
        if($team == 'red')
        {
            $this->reasonRed = $reason;
        }
        elseif($team == 'blue')
        {
            $this->reasonBlue = $reason;
        }
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    protected function process()
    {
        $now = time();
        $redExp = 0;
        $blueExp = 0;
        $redRespect = 0;
        $blueRespect = 0;
        $redMoney = 0;
        $blueMoney = 0;


        foreach($this->red as $character)
        {
            if($character instanceof Player)
            {
                $character->healthLock = true;

                foreach($character->quests as $quest)
                    $quest->init();
            }

            $blueExp += round($character->level * $character->health / 2);
            $blueRespect += max($character->respect / 10, 10);
            $blueMoney += round($character->money / 10);
        }

        foreach($this->blue as $character)
        {
            if($character instanceof Player)
            {
                $character->healthLock = true;

                foreach($character->quests as $quest)
                    $quest->init();
            }

            $redExp += round($character->level * $character->health / 3);
            $redRespect += max($character->respect / 20, 10);
            $redMoney += round($character->money / 15);
        }


        $this->battleground->battle();
        $winner = $this->battleground->winner();

        foreach($this->red as $character)
        {
            if($character instanceof Player)
            {
                $report = $this->battleground->report($character);
                $type = 'battle-' . ($winner == 'red' ? 'win' : 'lose');

                $rewards = new TextArray;
                $rewards->separator('</br>');


                if($winner != 'red')
                {
                    $respect = round($redRespect / count($this->red));
                    $money = round($character->money / 10);

                    $character->reload = true;
                    $character->jobEnd = $now;
                    $character->respect -= $respect;
                    $character->money -= $money;

                    if($respect > 0)
                    {
                        $text = new TransText('battle.lose.respect');
                        $text->with('value', $respect);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.lose.money');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }

                    Event::fire(new Fight($character, false, $money, $respect));

                }
                else
                {
                    $experience = round($redExp / count($this->red));
                    $respect = round($redRespect / count($this->red));
                    $money = round($redMoney / count($this->red));


                    $character->experience += $experience;
                    $character->respect += $respect;
                    $character->money += $money;


                    if($experience > 0)
                    {
                        $text = new TransText('battle.win.experience');
                        $text->with('value', $experience);

                        $rewards->push($text);
                    }

                    if($respect > 0)
                    {
                        $text = new TransText('battle.win.respect');
                        $text->with('value', $respect);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.win.money');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }

                    Event::fire(new Fight($character, true, $money, $respect, $experience));
                }

                foreach($character->quests as $quest)
                    $quest->finit();





                $character->newReport($type)
                    ->param('reason', $this->reasonRed)
                    ->param('log', $report)
                    ->param('rewards', $rewards)
                    ->send();

                $dialog = new ReportDialog($type);
                $dialog->with('reason', $this->reasonRed)
                    ->with('rewards', $rewards)
                    ->with('log', $report);

                $character->pushEvent($dialog);




                $character->healthLock = false;
                $character->save();
            }
        }

        foreach($this->blue as $character)
        {
            if($character instanceof Player)
            {
                $report = $this->battleground->report($character);
                $type = 'battle-' . ($winner == 'blue' ? 'win' : 'lose');

                $rewards = new TextArray;
                $rewards->separator('</br>');


                if($winner != 'blue')
                {
                    $respect = round($blueRespect / count($this->blue));
                    $money = round($character->money / 15);

                    $character->reload = true;
                    $character->jobEnd = $now;
                    $character->respect -= $respect;
                    $character->money -= $money;

                    if($respect > 0)
                    {
                        $text = new TransText('battle.lose.respect');
                        $text->with('value', $respect);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.lose.money');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }

                    Event::fire(new Fight($character, false, $money, $respect));

                }
                else
                {
                    $experience = round($blueExp / count($this->blue));
                    $respect = round($blueRespect / count($this->blue));
                    $money = round($blueMoney / count($this->blue));


                    $character->experience += $experience;
                    $character->respect += $respect;
                    $character->money += $money;


                    if($experience > 0)
                    {
                        $text = new TransText('battle.win.experience');
                        $text->with('value', $experience);

                        $rewards->push($text);
                    }

                    if($respect > 0)
                    {
                        $text = new TransText('battle.win.respect');
                        $text->with('value', $respect);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.win.money');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }
                    
                    Event::fire(new Fight($character, true, $money, $respect, $experience));
                }

                foreach($character->quests as $quest)
                    $quest->finit();



                $character->newReport($type)
                    ->param('reason', $this->reasonBlue)
                    ->param('log', $report)
                    ->param('rewards', $rewards)
                    ->send();

                $dialog = new ReportDialog($type);
                $dialog->with('reason', $this->reasonBlue)
                    ->with('rewards', $rewards)
                    ->with('log', $report);

                $character->pushEvent($dialog);

                $character->healthLock = false;
                $character->save();
            }
        }
    }
}
