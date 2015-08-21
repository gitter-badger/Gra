<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Harvest as HarvestEvent;
use Event;

class HarvestPlant extends Objective
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
		return $this->renderProgress(trans('objective.harvestPlant'), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		Event::listen(HarvestEvent::class, [$this, 'onHarvest']);
	}


	public function onHarvest(HarvestEvent $event)
	{
		if(is_null($this->type) || $event->species == $this->type)
		{
			$this->state++;
			$this->change();
		}
	}
}