<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class OtherPlantator implements Requirement
{
	private $level;


	public function __construct($level)
	{
		$this->level = $level;
	}


	public function check(Player $player)
	{
		return $player->smugglerLevel >= $this->level ||
			$player->dealerLevel >= $this->level;
	}

	public function getText()
	{
		return trans('requirement.otherPlantator', ['value' => $this->level]);
	}
}