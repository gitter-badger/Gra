<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;


class Deal extends Event
{
    use SerializesModels;
    public $player;
    public $count;
    public $money;


    public function __construct(Player $player, $count, $money)
    {
    	$this->player = $player;
    	$this->count = $count;
    	$this->money = $money;
    }
}
