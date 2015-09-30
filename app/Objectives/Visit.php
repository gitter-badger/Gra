<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\PlaceEnter;
use HempEmpire\Player;
use Event;

class Visit extends Objective
{
	protected $state;
	protected $count;
	protected $name;




	public function __construct($name)
	{
		$this->state = 0;
		$this->name = $name;
	}



	public function render()
	{
		return $this->renderCheckbox(trans('objective.visit', ['name' => trans('place.' . $this->name . '.name')]), $this->state);
	}

	public function check()
	{
		return $this->state >= 1;
	}

	public function init()
	{
		$this->listen(PlaceEnter::class, 'onEnter');
	}


	public function onEnter(PlaceEnter $event)
	{
		if($event->place->getName() == $this->name)
		{
			$this->state = 1;
			$this->change();
		}
	}
}