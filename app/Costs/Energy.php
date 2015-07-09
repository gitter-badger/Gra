<?php

namespace HempEmpire\Costs;
use HempEmpire\Contracts\Cost;
use HempEmpire\Player;


class Energy implements Cost
{
	private $energy;


	public function __construct($energy)
	{
		$this->energy = $energy;
	}


	public function canTake(Player $player)
	{
		return $player->energy >= $this->energy;
	}

	public function take(Player $player)
	{
		$player->energy -= $this->energy;
	}

	public function getText()
	{
		return trans('cost.energy', ['value' => $this->energy]);
	}

}

