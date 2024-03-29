<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Luck implements Requirement
{
	private $luck;


	public function __construct($luck)
	{
		$this->luck = $luck;
	}


	public function check(Player $player)
	{
		return $player->luck >= $this->luck;
	}

	public function getText()
	{
		return trans('requirement.luck', ['value' => $this->luck]);
	}
}