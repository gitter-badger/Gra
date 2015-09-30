<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Space implements Requirement
{
	private $space;


	public function __construct($space)
	{
		$this->space = $space;
	}


	public function check(Player $player)
	{
		return $player->space >= $this->space;
	}

	public function getText()
	{
		return trans('requirement.space', ['value' => $this->space]);
	}
}