<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\PlantationSlot;


class Harvest extends Event
{
    use SerializesModels;
    public $player;
    public $species;
    public $count;


    public function __construct(Player $player, $species, $count)
    {
    	$this->player = $player;
    	$this->species = $species;
    	$this->count = $count;
    }
}
