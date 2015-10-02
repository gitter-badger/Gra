<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\ItemBought;
use HempEmpire\Player;
use Event;

class BuySpecific extends Objective
{
	protected $state;
	protected $count;
	protected $name;




	public function __construct($name, $count = 1)
	{
		$this->count = $count;
		$this->name = $name;
		$this->state = 0;
	}



	public function render()
	{
		return $this->renderProgress(trans('objective.buySpecific', ['name' => trans('item.' . $this->name . '.name')]), $this->state, $this->count);
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		$this->listen(ItemBought::class, 'onBuy');
	}


	public function onBuy(ItemBought $bought)
	{
		if($bought->item->getName() == $this->name)
		{
			$this->state += $bought->count;
			$this->change();
		}
	}
}