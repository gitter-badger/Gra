<?php

namespace HempEmpire\Jobs;

use HempEmpire\Jobs\PlayerJob;
use HempEmpire\Events\Deal as DealEvent;
use Event;

use HempEmpire\Player;
use DB;
use Formatter;
use TransText;
use TextArray;


class Deal extends PlayerJob
{

    protected $stuffs;
    protected $minInterval;
    protected $maxInterval;
    protected $minPrice;
    protected $maxPrice;
    protected $burnChance;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Player $player, $minInterval, $maxInterval, $minPrice, $maxPrice, $burnChance)
    {
        parent::__construct($player);
        $this->stuffs = [];
        $this->minInterval = $minInterval;
        $this->maxInterval = $maxInterval;
        $this->minPrice = $minPrice;
        $this->maxPrice = $maxPrice;
        $this->burnChance = $burnChance;
    }


    public function add($stack, $price, $count)
    {
        $this->stuffs[] = [

            'stack' => $stack,
            'price' => $price,
            'count' => $count,
        ];
    }

    protected function remove($stack, $count)
    {
        for($i = 0; $i < count($this->stuffs); ++$i)
        {
            if($this->stuffs[$i]['stack'] == $stack)
            {
                $this->stuffs[$i]['count'] -= $count;

                if($this->stuffs[$i]['count'] <= 0)
                    unset($this->stuffs[$i]);

                return;
            }
        }
    }

    protected function pass(Deal $deal)
    {
        foreach($this->stuffs as $stuff)
        {
            if($stuff['count'] > 0)
            {
                $deal->add($stuff['stack'], $stuff['price'], $stuff['count']);
            }
        }
    }

    protected function getNextInterval()
    {
        return mt_rand($this->minInterval, $this->maxInterval);
    }

    protected function getNextCustomer()
    {
        return $this->player->roll($this->player->dealerLevel, round($this->player->dealerLevel * 1.5));
    }

    private $_stuffs;
    protected function loadStuffs()
    {
        if(!isset($this->_stuffs))
        {
            $ids = array_pluck($this->stuffs, 'stack');
            $this->_stuffs = $this->player->stuffs()->whereIn('id', $ids)->get();
        }
        return $this->_stuffs;
    }

    protected function loadStuff($stack)
    {
        $stuffs = $this->loadStuffs();

        foreach($stuffs as $stuff)
        {
            if($stuff->id == $stack)
                return $stuff;
        }
        return null;
    }

    protected function getRecord($count)
    {
        $record = null;
        $max = null;


        foreach($this->stuffs as $stuff)
        {
            if(is_null($max) || ($stuff['count'] < $count && $stuff['count'] > $max))
            {
                $record = $stuff;
                $max = $stuff['count'];
            }
        }

        return $record;
    }



    protected function beat($originalPrice, $price, $quality)
    {
        $minPrice = floor($originalPrice * $this->minPrice);
        $maxPrice = ceil($originalPrice * $this->maxPrice);

        $qualityThreshold = ($price - $minPrice) / ($maxPrice - $minPrice) * 5;
        return $quality < $qualityThreshold;
    }

    protected function burn()
    {
        return mt_rand(0, 100) < $this->burnChance;
    }





    /**
     * Execute the job.
     *
     * @return void
     */
    protected function process()
    {
        if($this->player->jobName == 'dealing' && $this->player->jobEnd > time())
        {
            $count = $this->getNextCustomer();
            $record = $this->getRecord($count);
            $interval = $this->getNextInterval();
            $deal = new Deal($this->player, $this->minInterval, $this->maxInterval, $this->minPrice, $this->maxPrice, $this->burnChance + 1);

            $this->log('Client want ' . $count . ' from ' . $this->player->name);

            if(is_null($record))
            {
                $this->log('Player ' . $this->player->name . ' not have enought stuff (' . $count . ')'); 
            }
            else
            {
                $stuff = $this->loadStuff($record['stack']);
                $count = min($count, $record['count'], $stuff->getCount());

                $stuff->count -= $count;
                $this->remove($record['stack'], $count);

                $sold = $count;
                $earn = $count * $record['price'];
                $exp = $count;

                $this->player->money += $earn;
                $this->player->dealerExperience += $exp;


                if($this->burn())
                {
                    $this->player->wantedUpdate = time();
                    $this->player->wanted++;

                    $this->player->newReport('burn')
                        ->send();

                    $this->log('Player ' . $this->player->name . ' burned');
                }

                if($this->beat($stuff->getPrice(), $record['price'], $stuff->getQuality()))
                {
                    $job = new Battle();
                    $job->joinBlue($this->player);
                    $job->reason('blue', new TransText('dealing.beat'));
                    $job->generateRed($this->player->level);
                    $this->dispatch($job);
                    $this->log('Player ' . $this->player->name . ' beated');
                }



                if($sold > 0)
                {
                    if($this->player->hasTalent('dealer-points'))
                        $this->player->givePremiumPoint();

                    $this->player->newReport('deal')
                        ->param('name', new TransText('item.' . $stuff->getName() . '.name'))
                        ->param('sell', $sold)
                        ->param('price', $earn)
                        ->send();

                    Event::fire(new DealEvent($this->player, $sold, $earn));
                }


                $this->player->save();
                $stuff->save();

                $this->log('Player ' . $this->player->name . ' sold ' . $sold . ' earned $' . $earn . ' and ' . $exp . 'exp'); 
            }


            $this->log('Next client in ' . Formatter::time($interval));
            $deal->delay($interval);
            $this->pass($deal);
            $this->dispatch($deal);
        }
        else 
        {
            $this->log('Player ' . $this->player->name . ' doesnt selling stuff');
        }
    }
}
