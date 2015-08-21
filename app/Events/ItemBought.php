<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\Contracts\Item;


class ItemBought extends Event
{
    use SerializesModels;
    public $player;
    public $item;
    public $count;


    public function __construct(Player $player, Item $item, $count = 1)
    {
    	$this->player = $player;
    	$this->item = $item;
    	$this->count = $count;
    }
}
