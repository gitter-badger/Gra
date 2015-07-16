<?php

namespace HempEmpire;


trait Fighter
{
	private $_weapon;
	private $_armor;

	public function getWeapon()
	{
		if(empty($this->_weapon))
			$this->_weapon = $this->equipment->weapon();

		return $this->_weapon;
	}

	public function getArmor()
	{
		if(empty($this->_armor))
			$this->_armor = $this->equipment->armor();

		return $this->_armor;
	}

	public function getDamage()
	{
		$weapon = $this->getWeapon();
		$minDamage = 0;
		$maxDamage = 0;

		if(is_null($weapon))
		{
			$minDamage = floor($this->strength / 10);
			$maxDamage = floor($this->strength / 5) + 1;
		}
		else
		{
			list($minDamage, $maxDamage) = $weapon->getDamage();
			$type = $weapon->getSubType();

			if($type == 'melee')
			{
				$minDamage += floor($this->strength / 10);
				$maxDamage += floor($this->strength / 5) + 1;
			}
			elseif($type == 'ranged')
			{
				$minDamage += floor($this->perception / 10);
				$maxDamage += floor($this->perception / 5) + 1;
			}
		}

		return [$minDamage, $maxDamage];
	}

	public function getDefense()
	{
		$armor = $this->getArmor();
		$defense = 0;

		if(!is_null($armor))
			$defense = $armor->getArmor();

		return $this->endurance + $defense;
	}

	public function getSpeed()
	{
		$speed = 1.0;

		$weapon = $this->getWeapon();
		$armor = $this->getArmor();

		if(!is_null($weapon))
			$speed += $weapon->getSpeed();

		if(!is_null($armor))
			$speed += $armor->getSpeed();


		return $this->agility * $speed;
	}

	public function getCritChance()
	{
		$weapon = $this->getWeapon();

		if(is_null($weapon))
		{
			return 0;
		}
		else
		{
			return round($weapon->getCritChance() * 10000) / 100;
		}
	}

	public function rollHit()
	{
		return $this->roll(0, $this->perception);
	}

	public function rollDodge()
	{
		return $this->roll(0, $this->agility);
	}


	public function rollCrit()
	{
		$chance = $this->getCritChance();

		return (100 - $this->roll(0, 99)) < round($chance);
	}

	public function rollDamage()
	{
		list($minDamage, $maxDamage) = $this->getDamage();

		return $this->roll($minDamage, $maxDamage);
	}
}