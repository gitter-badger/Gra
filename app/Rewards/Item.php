<?php

namespace HempEmpire\Rewards;
use HempEmpire\Player;

use HempEmpire\TemplateArmor;
use HempEmpire\TemplateFood;
use HempEmpire\TemplateSeed;
use HempEmpire\TemplateStuff;
use HempEmpire\TemplateVehicle;
use HempEmpire\TemplateWeapon;


class Item extends Reward
{
	private $name;
	private $count;

	protected function findItem($name)
	{
		$item = TemplateArmor::whereName($name)->first();

		if(isset($item))
			return $item;

		$item = TemplateFood::whereName($name)->first();

		if(isset($item))
			return $item;

		$item = TemplateSeed::whereName($name)->first();

		if(isset($item))
			return $item;

		$item = TemplateStuff::whereName($name)->first();

		if(isset($item))
			return $item;

		$item = TemplateVehicle::whereName($name)->first();

		if(isset($item))
			return $item;

		$item = TemplateWeapon::whereName($name)->first();

		if(isset($item))
			return $item;

		return null;
	}


	public function __construct($name, $count = 1)
	{
		$this->name = $name;
		$this->count = $count;
	}


	public function give(Player $player)
	{
		$item = $this->findItem($this->name);

		
		if(isset($item))
		{
			$this->log('Giving item: ' . $item->getName() . ' x ' . $this->count . ' to ' . $player->name);
		}
		else
		{
			$this->log('Item not found');
		}


		if(isset($item))
			$player->giveItem($item, $this->count);
	}

	public function getText()
	{
		$item = static::findItem($this->name);

		if(isset($item))
			return trans('reward.item', ['item' => trans('item.' . $item->getName() . '.name'), 'count' => $this->count]);
		else
			return 'Amba fatima miał być item i ni ma :c. Za bug przepraszamy.';
	}

	public function isVisible()
	{
		return true;
	}
}