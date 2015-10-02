<?php

namespace HempEmpire\Rewards;
use HempEmpire\Player;





class TakeItemType extends TakeItem
{
	private $type;
	private $count;

	protected function findItemByType(Player $player)
	{
		switch($this->type)
		{
			case 'weapon':
				return $player->weapons()->where('count', '>=', $this->count)->first();
			case 'armor':
				return $player->armors()->where('count', '>=', $this->count)->first();
			case 'seed':
				return $player->seeds()->where('count', '>=', $this->count)->first();
			case 'stuff':
				return $player->stuffs()->where('count', '>=', $this->count)->first();
			case 'vehicles':
				return $player->vehicless()->where('count', '>=', $this->count)->first();
			case 'food':
				return $player->foods()->where('count', '>=', $this->count)->first();
			default:
				return null;

		}
	}


	public function __construct($type, $count = 1)
	{
		$this->type = $type;
		$this->count = $count;
	}


	public function give(Player $player)
	{
		$item = $this->findItemByType($player);

		
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
		$item = $this->findItemByType($this->name);

		if(isset($item))
			return trans('reward.itemTakeType', ['type' => trans('item.types.' . $this->type), 'count' => $this->count]);
		else
			return 'Amba fatima miał być item i ni ma :c. Za bug przepraszamy.';
	}

	public function isVisible()
	{
		return true;
	}
}