<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Money implements Requirement
{
	private $money;


	public function __construct($money)
	{
		$this->money = $money;
	}


	public function check(Player $player)
	{
		return $player->money >= $this->money;
	}

	public function getText()
	{
		return trans('requirement.money', ['value' => $this->money]);
	}
}