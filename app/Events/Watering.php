<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\PlantationSlot;


class Watering extends Event
{
    use SerializesModels;
    public $player;
    public $slot;


    public function __construct(Player $player, PlantationSlot $slot)
    {
    	$this->player = $player;
        $this->slot = $slot;
    }
}
