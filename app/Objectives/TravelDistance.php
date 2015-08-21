<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Travel as TravelEvent;
use Event;

class TravelDistance extends Objective
{
	protected $state;
	protected $count;




	public function __construct($count)
	{
		$this->count = $count;
		$this->state = 0;
	}



	public function render()
	{
		return $this->renderProgress(trans('objective.travelDistance', ['value' => $this->count]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		Event::listen(TravelEvent::class, [$this, 'onEnter']);
	}


	public function onEnter(TravelEvent $event)
	{
		$this->state += $event->getDistance();
		$this->change();
	}
}