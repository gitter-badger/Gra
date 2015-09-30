<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;
use HempEmpire\Reputation;


class Cartel implements Requirement
{
	private $name;
	private $reputation;


	public function __construct($name, $reputation)
	{
		$this->name = $name;
		$this->reputation = $reputation;
	}


	public function check(Player $player)
	{
		return Reputation::compare($player->getCartelReputation($this->name), $this->reputation);
	}

	public function getText()
	{
		return trans('requirement.cartel', ['name' => trans('cartel.' . $this->name . '.name'), 'reputation' => trans('reputation.' . $this->reputation)]);
	}
}