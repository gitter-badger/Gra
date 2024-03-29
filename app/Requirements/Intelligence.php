<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Intelligence implements Requirement
{
	private $intelligence;


	public function __construct($intelligence)
	{
		$this->intelligence = $intelligence;
	}


	public function check(Player $player)
	{
		return $player->intelligence >= $this->intelligence;
	}

	public function getText()
	{
		return trans('requirement.intelligence', ['value' => $this->intelligence]);
	}
}