<?php


namespace HempEmpire;



class Opponent
{
	public $battleId;
	public $name;
	public $avatar;
	public $level;
	public $health;
	public $maxHealth;
	public $strength;
	public $perception;
	public $endurance;
	public $charisma;
	public $intelligence;
	public $luck;
	public $agility;
	public $weaponId;
	public $armorId;


	private $_weapon;
	private $_armor;

	public function getWeapon()
	{
		if(empty($this->_weapon) && $this->weaponId != 0)
			$this->_weapon = TemplateWeapon::find($this->weaponId);

		return $this->_weapon;
	}

	public function getArmor()
	{
		if(empty($this->_armor) && $this->armorId != 0)
			$this->_armor = TemplateArmor::find($this->armorId);

		return $this->_armor;
	}


	public function roll($min, $max)
	{
		$r = [];
		$n = max(round(($this->luck > 50 ? $this->luck - 50 : 50 - $this->luck) / 25), 1);


		for($i = 0; $i < $n; ++$i)
			$r[$i] = mt_rand($min, $max);
	


		if($this->luck == 50)
		{
			return $r[0];
		}
		elseif($this->luck > 50)
		{
			return max($r);
		}
		elseif($this->luck < 50)
		{
			return min($r);
		}
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

		return floor($this->endurance / 5) + $defense;
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
		return mt_rand(0, $this->perception);
	}

	public function rollDodge()
	{
		return mt_rand(0, $this->agility);
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