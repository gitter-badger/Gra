<?php

namespace HempEmpire\Events;
use Illuminate\Queue\SerializesModels;
use HempEmpire\Player;
use HempEmpire\PlantationSlot;


class Fight extends Event
{
    use SerializesModels;
    public $player;
    public $win;
    public $money;
    public $respect;
    public $experience;


    public function __construct(Player $player, $win, $money = 0, $respect = 0, $experience = 0)
    {
    	$this->player = $player;
    	$this->win = $win;
    	$this->money = $money;
    	$this->respect = $respect;
    	$this->experience = $experience;
    }
}
