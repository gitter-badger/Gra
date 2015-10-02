<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\Contracts\Item;


class Equip extends Event
{
    use SerializesModels;
    public $player;
    public $item;


    public function __construct(Player $player, Item $item)
    {
    	$this->player = $player;
    	$this->item = $item;
    	$this->count = $count;
    }
}
