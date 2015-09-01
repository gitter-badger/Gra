<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Watering as WateringEvent;
use Event;

class Watering extends Objective
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
		return $this->renderProgress(trans('objective.watering', ['value' => $this->count]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		Event::listen(WateringEvent::class, [$this, 'onWatering']);
	}


	public function onWatering(WateringEvent $event)
	{
		if(is_null($this->type) || $event->slot->species == $this->type)
		{
			$this->state++;
			$this->change();
		}
	}
}