<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\Deal;
use HempEmpire\Player;
use Event;

class DealMoney extends Objective
{
	protected $state;
	protected $count;




	public function __construct($money)
	{
		$this->count = $money;
		$this->state = 0;
	}



	public function render()
	{
		return $this->renderProgress(trans('objective.dealMoney', ['value' => $this->count]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		$this->listen(Deal::class, 'onDeal');
	}


	public function onDeal(Deal $event)
	{
		$this->state += $event->money;
		$this->change();
	}
}