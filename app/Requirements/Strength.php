<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Strength implements Requirement
{
	private $strength;


	public function __construct($strength)
	{
		$this->strength = $strength;
	}


	public function check(Player $player)
	{
		return $player->strength >= $this->strength;
	}

	public function getText()
	{
		return trans('requirement.strength', ['value' => $this->strength]);
	}
}