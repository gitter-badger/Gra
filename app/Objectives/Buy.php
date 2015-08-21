<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\ItemBought;
use Event;

class Buy extends Objective
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
		if(is_null($this->type))
		{
			return $this->renderProgress(trans('objective.buy'), $this->state, $this->count);
		}
		else
		{
			return $this->renderProgress(trans('objective.buyType', ['type' => trans('item.type.' . $this->type)]), $this->state, $this->count);
		}
	}

	public function check()
	{
		return $this->state >= $this->count;
	}

	public function init()
	{
		Event::listen(ItemBought::class, [$this, 'onBuy']);
	}


	public function onBuy(ItemBought $bought)
	{
		if(is_null($this->type) || $bought->item->getType() == $this->type)
		{
			$this->state += $bought->count;
			$this->change();
		}
	}
}