<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\LocationEnter;
use Event;

class TravelTo extends Objective
{
	protected $state;
	protected $count;
	protected $name;




	public function __construct($name = null)
	{
		$this->count = 1;
		$this->state = 0;
		$this->name = $name;
	}



	public function render()
	{
		if(is_null($this->name))
		{
			return $this->renderProgress(trans('objective.travel'), $this->state, $this->count);
		}
		else
		{
			return $this->renderProgress(trans('objective.travelTo', ['to' => trans('location.' . $this->name . '.name')]), $this->state, $this->count);
		}
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		Event::listen(LocationEnter::class, [$this, 'onEnter']);
	}


	public function onEnter(LocationEnter $event)
	{
		if(is_null($this->name) || $event->location->getName() == $this->name)
		{
			$this->state = 1;
			$this->change();
		}
	}
}