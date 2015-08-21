<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Gang implements Requirement
{
	public function __construct()
	{
		
	}

	public function check(Player $player)
	{
		return !is_null($player->gang);
	}

	public function getText()
	{
		return trans('requirement.gang');
	}
}