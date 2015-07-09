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


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, $minInterval, $maxInterval, $minStuff, $maxStuff)
    {
        $this->player = $player;
        $this->minInterval = $minInterval;
        $this->maxInterval = $maxInterval;
        $this->minStuff = $minStuff;
        $this->maxStuff = $maxStuff;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        DB::transaction(function() use(&$haveStuff)
        {
            $haveStuff = $this->player->getStuffsCount();


            $dealIncrease = (100 + $this->player->dealerLevel * 5) / 100;

            $maxStuff = min($haveStuff, $this->maxStuff * $dealIncrease);
            $minStuff = min($this->minStuff * $dealIncrease, $maxStuff);


            $sell = $this->player->roll($minStuff, $maxStuff);
            $stuffs = $this->player->getStuffs();


            echo "$minStuff / $sell / $maxStuff" . PHP_EOL;

            $array = new TextArray;
            $array->separator('<br/>');

            $totalSell = 0;
            $totalPrice = 0;

            foreach($stuffs as $stuff)
            {
                $count = min($stuff->count, $sell);
                $haveStuff -= $count;
                $sell -= $count;
                $totalSell += $count;

                $price = round($stuff->getPrice() * $count);
                $totalPrice += $price;

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




            if($this->player->roll(0, 100) < 25)
            {
                $this->player->sendReport('burn');
                $this->player->wanted++;
            }





            $now = time();

            $minInterval = $now + $this->minInterval;
            $maxInterval = $now + $this->maxInterval;

            $nextCustomer = $this->player->jobName == 'dealing' && $this->player->jobEnd >= $maxInterval && $haveStuff > 0;

            

            if($nextCustomer)
            {
                $interval = mt_rand($this->minInterval, $this->maxInterval);

                $job = new Deal($this->player, $this->minInterval, $this->maxInterval, $this->minStuff, $this->maxStuff);
                $job->delay($interval);

                $this->player->nextUpdate = min($this->player->nextUpdate, $now + $interval);

                $this->dispatch($job);
            }

            $this->player->completeQuest('first-deal');

            return $this->player->newReport('deal')->param('text', $array)->param('sell', $totalSell)->param('price', $totalPrice)->send() && $this->player->save();
        });

    }
}
