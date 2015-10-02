<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Equip as EquipEvent;
use HempEmpire\Player;
use Event;

class Equip extends Objective
{
	protected $state;
	protected $type;




	public function __construct($type)
	{
		$this->state = 0;
		$this->type = $type;
	}



	public function render()
	{
		return $this->renderCheckbox(trans('objective.equip', ['type' => trans('item.types.' . $this->type)]), $this->state);
	}

	public function check()
	{
		return $this->state >= 1;
	}

	public function init()
	{
		$this->listen(EquipEvent::class, 'onEquip');
	}


	public function onEquip(PlaceEnter $event)
	{
		if($event->item->getType() == $this->type)
		{
			$this->state = 1;
			$this->change();
		}
	}
}