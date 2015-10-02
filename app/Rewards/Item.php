<?php

namespace HempEmpire\Rewards;
use HempEmpire\TemplateArmor;
use HempEmpire\TemplateFood;
use HempEmpire\TemplateSeed;
use HempEmpire\TemplateStuff;
use HempEmpire\TemplateVehicle;
use HempEmpire\TemplateWeapon;


abstract class Item extends Reward
{
	protected function findItemByName($name)
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
}