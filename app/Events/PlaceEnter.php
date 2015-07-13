<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\LocationPlace as Place;



class PlaceEnter extends Event
{
    use SerializesModels;
    public $player;
    public $place;


    public function __construct(Player $player, Place $place)
    {
    	$this->player = $player;
    	$this->place = $place;
    }
}
