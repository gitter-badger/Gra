<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;

use HempEmpire\Battleground;
use HempEmpire\Player;
use HempEmpire\OpponentGenerator;
use HempEmpire\ReportDialog;
use HempEmpire\Events\Fight;
use TransText;
use TextArray;
use Event;


class GangBattle extends Job
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
        $this->red = null;
        $this->blue = null;
        $this->reasonRed = null;
        $this->reasonBlue = null;
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

    public function joinRed($gang)
    {
    	$this->red = $gang;
    }

    public function joinBlue($gang)
    {
    	$this->blue = $gang;
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    protected function process()
    {

        $now = time();
        $redCount = 0;
        $blueCount = 0;
        $redExp = 0;
        $blueExp = 0;

        foreach($this->red->members as $member)
        {
        	$character = $member->player;

            if(!$character->isBusy && $member->joins)
            {
                $character->healthLock = true;
                $redCount++;

                $blueExp += round($character->level * $character->health / 2);

                $this->battleground->joinRed($character);


                foreach($character->quests as $quest)
                    $quest->init();
            }
        }

        foreach($this->blue->members as $member)
        {
        	$character = $member->player;

            if(!$character->isBusy && $member->joins)
            {
                $character->healthLock = true;
                $blueCount++;

                $redExp += round($character->level * $character->health / 3);

                $this->battleground->joinBlue($character);


                foreach($character->quests as $quest)
                    $quest->init();
            }
        }

        $this->battleground->battle();
        $winner = $this->battleground->winner();

        $redGangRespect = 0;
        $blueGangRespect = 0;
        $money = 0;


        if($winner == 'red')
        {
            $redGangRespect = max(round($this->blue->respect / 10), 100);
            $blueGangRespect = 0;
            $money = round($this->blue->money / 10);

            if($blueCount > 0)
            {
                $blueGangRespect = round($this->red->respect / 20);
            }
            else
            {
                $blueGangRespect = round($this->blue->respect / 4);
            }

            $this->red->newLog('attackWin')
                ->param('respect', $redGangRespect)
                ->param('money', $money)
                ->save();

            $this->blue->newLog('defenseLose')
                ->param('respect', $blueGangRespect)
                ->param('money', $money)
                ->save();

            $this->red->respect += $redGangRespect;
            $this->red->money += $money;

            $this->blue->respect -= $blueGangRespect;
            $this->blue->money -= $money;
        }
        else
        {
            $redGangRespect = 0;
            $blueGangRespect = max(round($this->red->respect / 5), 100);
            $money = round($this->blue->money / 15);


            if($redCount > 0)
            {
                $redGangRespect = round($this->blue->respect / 10);
            }
            else
            {
                $redGangRespect = round($this->red->respect / 4);
            }

            $this->red->newLog('attackLose')
                ->param('respect', $redGangRespect)
                ->param('money', $money)
                ->save();

            $this->blue->newLog('defenseWin')
                ->param('respect', $blueGangRespect)
                ->param('money', $money)
                ->save();

            $this->red->respect -= $redGangRespect;
            $this->red->money -= $money;

            $this->blue->respect += $blueGangRespect;
            $this->blue->money += $money;
        }

        $this->red->save();
        $this->blue->save();


        foreach($this->red->members as $member)
        {
            $character = $member->player;
            if($character instanceof Player)
            {
                $report = $this->battleground->report($character);
                $type = 'gang-battle-' . ($winner == 'red' ? 'win' : 'lose');

                $rewards = new TextArray;
                $rewards->separator('</br>');


                if($winner != 'red')
                {

                    $character->reload = true;
                    $character->jobEnd = $now;

                    if($redGangRespect > 0)
                    {
                        $text = new TransText('battle.lose.gangRespect');
                        $text->with('value', $redGangRespect);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.lose.gangMoney');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }

                    Event::fire(new Fight($character, false));

                }
                else
                {
                    $experience = 0;

                    if($member->joins)
                    {
                        $experience = round($redExp / count($this->red));
                        $character->experience += $experience;
                    }


                    if($redGangRespect > 0)
                    {
                        $text = new TransText('battle.win.gangRespect');
                        $text->with('value', $redGangRespect);

                        $rewards->push($text);
                    }

                    if($experience > 0)
                    {
                        $text = new TransText('battle.win.experience');
                        $text->with('value', $experience);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.win.gangMoney');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }

                    Event::fire(new Fight($character, true, 0, 0, $experience));
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

        foreach($this->blue->members as $member)
        {
            $character = $member->player;
            if($character instanceof Player)
            {
                $report = $this->battleground->report($character);
                $type = 'gang-battle-' . ($winner == 'blue' ? 'win' : 'lose');

                $rewards = new TextArray;
                $rewards->separator('</br>');


                if($winner != 'blue')
                {
                    $character->reload = true;
                    $character->jobEnd = $now;


                    if($blueGangRespect > 0)
                    {
                        $text = new TransText('battle.lose.gangRespect');
                        $text->with('value', $blueGangRespect);

                        $rewards->push($text);
                    }

                    if($money > 0)
                    {
                        $text = new TransText('battle.lose.gangMoney');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }

                    Event::fire(new Fight($character, false));

                }
                else
                {
                    $experience = 0;

                    if($member->joins)
                    {
                        $experience = round($blueExp / count($this->blue));
                        $character->experience += $experience;
                    }


                    if($blueGangRespect > 0)
                    {
                        $text = new TransText('battle.win.gangRespect');
                        $text->with('value', $blueGangRespect);

                        $rewards->push($text);
                    }

                    if($experience > 0)
                    {
                        $text = new TransText('battle.win.experience');
                        $text->with('value', $experience);

                        $rewards->push($text);
                    }
                    if($money > 0)
                    {
                        $text = new TransText('battle.win.gangMoney');
                        $text->with('value', $money);

                        $rewards->push($text);
                    }
                    
                    Event::fire(new Fight($character, true, 0, 0, $experience));
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
