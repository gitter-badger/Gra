<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Dealer implements Requirement
{
	private $level;


	public function __construct($level)
	{
		$this->level = $level;
	}


	public function check(Player $player)
	{
		return $player->dealerLevel >= $this->level;
	}

	public function getText()
	{
		return trans('requirement.dealer', ['value' => $this->level]);
	}
}