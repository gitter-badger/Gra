<?php


namespace HempEmpire\Requirements;
use HempEmpire\Contracts\Requirement;
use HempEmpire\Player;


class Equiped implements Requirement
{
	private $type;

	public function __construct($type)
	{
		$this->type = $type;
	}




	public function check(Player $player)
	{
		switch($this->type)
		{
			case 'armor':
				return $player->equipment->armors()->count() > 0;
			case 'vehicle':
				return $player->equipment->vehicles()->count() > 0;
			case 'weapon':
				return $player->equipment->weapons()->count() > 0;
			default:
				return false;
		}
	}

	public function getText()
	{
		return trans('requirement.equiped', ['value' => trans('item.types.' . $this->type)]);
	}
}