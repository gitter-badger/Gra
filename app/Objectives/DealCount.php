<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Deal;
use Event;

class DealCount extends Objective
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
		return $this->renderProgress(trans('objective.dealCount'), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		Event::listen(Deal::class, [$this, 'onDeal']);
	}


	public function onDeal(Deal $event)
	{
		$this->state += $event->count;
		$this->change();
	}
}