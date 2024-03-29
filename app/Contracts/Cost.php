<?php

namespace HempEmpire\Contracts;
use HempEmpire\Player;


interface Cost
{
	public function canTake(Player $player);
	public function take(Player $player);
	public function getText();
}