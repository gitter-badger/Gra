<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Endurance implements Requirement
{
	private $endurance;


	public function __construct($endurance)
	{
		$this->endurance = $endurance;
	}


	public function check(Player $player)
	{
		return $player->endurance >= $this->endurance;
	}

	public function getText()
	{
		return trans('requirement.endurance', ['value' => $this->endurance]);
	}
}