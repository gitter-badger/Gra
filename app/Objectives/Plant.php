<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Plant as PlantEvent;
use HempEmpire\Player;
use Event;

class Plant extends Objective
{
	protected $state;
	protected $count;
	protected $type;




	public function __construct($count, $type = null)
	{
		$this->count = $count;
		$this->type = $type;
		$this->state = 0;
	}



	public function render()
	{
		return $this->renderProgress(trans('objective.plant', ['value' => $this->count]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		$this->listen(PlantEvent::class, 'onPlant');
	}


	public function onPlant(PlantEvent $event)
	{
		if(is_null($this->type) || $event->slot->species == $this->type)
		{
			$this->state++;
			$this->change();
		}
	}
}