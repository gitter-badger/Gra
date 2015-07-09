<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Charisma implements Requirement
{
	private $charisma;


	public function __construct($charisma)
	{
		$this->charisma = $charisma;
	}


	public function check(Player $player)
	{
		return $player->charisma >= $this->charisma;
	}

	public function getText()
	{
		return trans('requirement.charisma', ['value' => $this->charisma]);
	}
}