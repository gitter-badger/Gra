<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Plantator implements Requirement
{
	private $level;


	public function __construct($level)
	{
		$this->level = $level;
	}


	public function check(Player $player)
	{
		return $player->plantatorLevel >= $this->level;
	}

	public function getText()
	{
		return trans('requirement.plantator', ['value' => $this->level]);
	}
}