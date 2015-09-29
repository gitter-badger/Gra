<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class NoTalent implements Requirement
{
	private $name;


	public function __construct($name)
	{
		$this->name = $name;
	}


	public function check(Player $player)
	{
		return !$player->hasTalent($this->name);
	}

	public function getText()
	{
		return trans('requirement.notalent', ['name' => trans('talent.' . $this->name . '.name')]);
	}
}