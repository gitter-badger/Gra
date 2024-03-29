<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Level implements Requirement
{
	private $level;


	public function __construct($level)
	{
		$this->level = $level;
	}


	public function check(Player $player)
	{
		return $player->level >= $this->level;
	}

	public function getText()
	{
		return trans('requirement.level', ['value' => $this->level]);
	}
}