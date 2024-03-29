<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Perception implements Requirement
{
	private $perception;


	public function __construct($perception)
	{
		$this->perception = $perception;
	}


	public function check(Player $player)
	{
		return $player->perception >= $this->perception;
	}

	public function getText()
	{
		return trans('requirement.perception', ['value' => $this->perception]);
	}
}