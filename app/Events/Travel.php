<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\Location;


class Travel extends Event
{
    use SerializesModels;
    public $player;
    public $from;
    public $to;
    protected $time;
    protected $cost;



    public function __construct(Player $player, Location $from, Location $to, $time, $cost)
    {
    	$this->player = $player;
    	$this->from = $from;
    	$this->to = $to;

    	$this->time = $time;
    	$this->cost = $cost;
    }


    public function getDistance()
    {
    	return $this->from->getDistanceTo($this->to);
    }


    public function getCost()
    {
    	return $this->getDistance() * $this->cost;
    }

    public function getTime()
    {
    	return $this->getDistance() * $this->time;
    }





}
