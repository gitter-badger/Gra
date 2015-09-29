<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Blocked implements Requirement
{
	public function __construct()
	{
		
	}


	public function check(Player $player)
	{
		return false;
	}

	public function getText()
	{
		return trans('requirement.blocked');
	}
}