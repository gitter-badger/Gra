<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Agility implements Requirement
{
	private $agility;


	public function __construct($agility)
	{
		$this->agility = $agility;
	}


	public function check(Player $player)
	{
		return $player->agility >= $this->agility;
	}

	public function getText()
	{
		return trans('requirement.agility', ['value' => $this->agility]);
	}
}