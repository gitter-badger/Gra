<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;


use HempEmpire\Events\Deal as DealEvent;
use Event;

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
    protected $priceFactor;
    protected $burnChance;
    protected $beatChance;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, $minInterval, $maxInterval, $minStuff, $maxStuff, $price, $priceFactor, $burnChance, $beatChance)
    {
        $this->player = $player;
        $this->minInterval = $minInterval;
        $this->maxInterval = $maxInterval;
        $this->minStuff = $minStuff;
        $this->maxStuff = $maxStuff;
        $this->price = $price;
        $this->priceFactor = $priceFactor;
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
        try{
        echo __METHOD__ . PHP_EOL;


        foreach($this->player->quests as $quest)
            $quest->init();

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

                    $price = $this->price * $count;
                    $totalPrice += $price;
                    $avgQuality += $stuff->quality * $count;

                    $this->player->dealerExperience += round($count * ($stuff->quality / 5));

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

                $now = time();

                if($totalSell > 0)
                {
                    if($this->player->hasTalent('dealer-points'))
                        $this->player->givePremiumPoint();

                    $avgQuality /= $totalSell;

                    $roll = mt_rand(0, 100);    
                    if($roll < $this->burnChance)
                    {
                        $text = new TransText('dealing.burn');
                        $array->push($text);
                        $this->player->wantedUpdate = $now;
                        $this->player->wanted++;
                    }
                    echo 'Burn' . PHP_EOL;
                    echo 'rand(0, ' . 100 . ') = ' . $roll . PHP_EOL;
                    echo $roll . ' < ' . $this->burnChance . PHP_EOL;


                    $roll = mt_rand(0, 100) + floor($avgQuality) * 7;
                    if($roll < round($this->beatChance / $this->priceFactor))
                    {
                        $job = new Battle();
                        $job->joinBlue($this->player);
                        $job->reason('blue', new TransText('dealing.beat'));
                        $job->generateRed($this->player->level);

                        $this->dispatch($job);
                    }
                    echo 'Beat' . PHP_EOL;
                    echo 'rand(0, ' . 100 . ') = ' . $roll . PHP_EOL;
                    echo $roll . ' < ' . round($this->beatChance / $this->priceFactor) . PHP_EOL;
                }
                else
                {
                    echo 'Sold nothing' . PHP_EOL;
                }


                $minInterval = $now + round($this->minInterval / $this->priceFactor);
                $maxInterval = $now + round($this->maxInterval / $this->priceFactor);

                $nextCustomer = $this->player->jobName == 'dealing' && $this->player->jobEnd >= $maxInterval && $haveStuff > 0;

                if($nextCustomer)
                {
                    $interval = mt_rand($this->minInterval, $this->maxInterval);

                    $job = new Deal($this->player, $this->minInterval, $this->maxInterval, $this->minStuff, $this->maxStuff,
                        $this->price, $this->priceFactor, $this->burnChance, $this->beatChance);
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
                {
                    Event::fire(new DealEvent($this->player, $totalSell, $totalPrice));
                }

                return $success;
            });

        }

        foreach($this->player->quests as $quest)
            $quest->finit();

        } catch(\ErrorException $e)
        {
            echo '(' . $e->getLine() . ')' . $e->getMessage() . PHP_EOL;
        }
    }
}
