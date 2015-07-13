<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\Location;


class LocationEnter extends Event
{
    use SerializesModels;
    public $player;
    public $location;


    public function __construct(Player $player, Location $location)
    {
    	$this->player = $player;
    	$this->location = $location;
    }
}
