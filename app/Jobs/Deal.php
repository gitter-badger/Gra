<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;


use HempEmpire\Player;
use DB;
use TransText;
use TextArray;


class Deal extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;
    use DispatchesJobs;


    protected $player;
    protected $maxInterval;
    protected $minInterval;
    protected $minStuff;
    protected $maxStuff;
    protected $price;
    protected $burnChance;
    protected $beatChance;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, $minInterval, $maxInterval, $minStuff, $maxStuff, $price, $burnChance, $beatChance)
    {
        $this->player = $player;
        $this->minInterval = $minInterval;
        $this->maxInterval = $maxInterval;
        $this->minStuff = $minStuff;
        $this->maxStuff = $maxStuff;
        $this->price = $price;
        $this->burnChance = $burnChance;
        $this->beatChance = $beatChance;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        echo __METHOD__ . PHP_EOL;

        if($this->player->jobName == 'dealing' && $this->player->jobEnd > time())
        {
            DB::transaction(function()
            {
                $haveStuff = $this->player->getStuffsCount();



                $maxStuff = min($haveStuff, $this->maxStuff * $this->player->dealerLevel);
                $minStuff = min($this->minStuff * $this->player->dealerLevel, $maxStuff);


                $sell = $this->player->roll($minStuff, $maxStuff);
                $stuffs = $this->player->getStuffs();


                $array = new TextArray;
                $array->separator('<br/>');

                $totalSell = 0;
                $totalPrice = 0;
                $avgQuality = 0;

                foreach($stuffs as $stuff)
                {
                    $count = min($stuff->count, $sell);
                    $haveStuff -= $count;
                    $sell -= $count;
                    $totalSell += $count;

                    $price = round($stuff->getPrice() * $count);
                    $totalPrice += $price;
                    $avgQuality += $stuff->quality * $count;

                    $this->player->dealerExperience += $count;

                    $this->player->money += $price;
                    if(!$this->player->takeItem($stuff, $count))
                        return false;


                    $text = new TransText('dealing.deal');
                    $text->with('name', new TransText($stuff->getTitle()))
                        ->with('count', $count)
                        ->with('price', $price);

                    $array->push($text);



                    if($sell <= 0)
                        break;
                }
                $avgQuality /= $totalSell;
                $this->player->experience += ceil($totalSell / 10);


                $now = time();

                if($this->player->roll(0, 100) < $this->burnChance)
                {
                    $text = new TransText('dealing.burn');
                    $array->push($text);
                    $this->player->wantedUpdate = $now;
                    $this->player->wanted++;
                }

                if($this->player->roll(floor($avgQuality) * 10, 100) < $this->beatChance)
                {
                    $job = new Battle();
                    $job->joinBlue($this->player);
                    $job->generateRed($this->player->level);

                    if($this->player->level % 20 >= 10)
                        $job->generateRed($this->player->level);

                    $this->dispatch($job);
                }






                $minInterval = $now + $this->minInterval;
                $maxInterval = $now + $this->maxInterval;

                $nextCustomer = $this->player->jobName == 'dealing' && $this->player->jobEnd >= $maxInterval && $haveStuff > 0;

                

                if($nextCustomer)
                {
                    $interval = mt_rand($this->minInterval, $this->maxInterval);

                    $job = new Deal($this->player, $this->minInterval, $this->maxInterval, $this->minStuff, $this->maxStuff, $this->price, $this->burnChance, $this->beatChance);
                    $job->delay($interval);

                    $this->player->nextUpdate = min($this->player->nextUpdate, $now + $interval);

                    $this->dispatch($job);

                }
                elseif($haveStuff == 0)
                {
                    $this->player->reload = true;
                    $this->player->jobEnd = $now;
                }

                $success = DB::transaction(function() use($array, $totalSell, $totalPrice)
                {
                    if($this->player->jobName == 'dealing')
                    {
                        return $this->player->newReport('deal')->param('text', $array)->param('sell', $totalSell)->param('price', $totalPrice)->send()
                            && $this->player->save();
                    }
                    else
                    {
                        return false;
                    }
                });

                if($success)
                    $this->player->completeQuest('first-deal');

                return $success;
            });

        }


    }
}
