<?php

namespace HempEmpire\Rewards;
use HempEmpire\Player;


class TakeItem extends Item
{
	private $name;
	private $count;


	public function __construct($name, $count = 1)
	{
		$this->name = $name;
		$this->count = $count;
	}


	public function give(Player $player)
	{
		$item = $this->findItemByName($this->name);

		
		if(isset($item))
		{
			$this->log('Taking item: ' . $item->getName() . ' x ' . $this->count . ' from ' . $player->name);
		}
		else
		{
			$this->log('Item not found');
		}


		if(isset($item))
			$player->takeItem($item, $this->count);
	}

	public function getText()
	{
		$item = $this->findItemByName($this->name);

		if(isset($item))
			return trans('reward.itemTake', ['item' => trans('item.' . $item->getName() . '.name'), 'count' => $this->count]);
		else
			return 'Amba fatima miał być item i ni ma :c. Za bug przepraszamy.';
	}

	public function isVisible()
	{
		return true;
	}
}