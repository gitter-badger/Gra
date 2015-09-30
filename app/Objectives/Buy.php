<?php

namespace HempEmpire\Objectives;
use HempEmpire\Events\ItemBought;
use HempEmpire\Player;
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
			return $this->renderProgress(trans('objective.buy', ['value' => $this->count]), $this->state, $this->count);
		}
		else
		{
			return $this->renderProgress(trans('objective.buyType', ['value' => $this->count, 'type' => trans('item.types.' . $this->type)]), $this->state, $this->count);
		}
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
		if(is_null($this->type) || $bought->item->getType() == $this->type)
		{
			$this->state += $bought->count;
			$this->change();
		}
	}
}