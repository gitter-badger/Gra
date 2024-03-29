<?php

namespace HempEmpire\Costs;
use HempEmpire\Contracts\Cost;
use HempEmpire\Player;


class Money implements Cost
{
	private $money;


	public function __construct($money)
	{
		$this->money = $money;
	}


	public function canTake(Player $player)
	{
		return $player->money >= $this->money;
	}

	public function take(Player $player)
	{
		$player->money -= $this->money;
	}

	public function getText()
	{
		return trans('cost.money', ['value' => $this->money]);
	}

}

