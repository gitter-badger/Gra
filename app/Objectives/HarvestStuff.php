<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Harvest as HarvestEvent;
use HempEmpire\Player;
use Event;

class HarvestStuff extends Objective
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
		return $this->renderProgress(trans('objective.harvestStuff', ['value' => $this->count]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		$this->listen(HarvestEvent::class, 'onHarvest');
	}


	public function onHarvest(HarvestEvent $event)
	{
		if(is_null($this->type) || $event->species == $this->type)
		{
			$this->state += $event->count;
			$this->change();
		}
	}
}