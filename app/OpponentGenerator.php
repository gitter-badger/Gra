<?php


namespace HempEmpire;
use Config;


class OpponentGenerator
{
	private static $weapons = [

		100 => [14, 15, 17, 11],
		80 => [16, 13, 14, 11],
		60 => [13, 12, 11, 10],
		40 => [10, 13, 8, 7],
		20 => [5, 6, 7, 9],
		0 => [1, 2, 3, 4],
	];

	private static $armors = [

		100 => [8, 7, 6],
		80 => [7, 6, 5],
		60 => [6, 5, 4],
		40 => [5, 4, 3],
		20 => [4, 3, 2],
		0 => [2, 1, 0],		
	];


	protected function getNearest($array, $value)
	{
		foreach($array as $key => $result)
		{
			if($key <= $value)
				return $result;
		}
		return [0];
	}

	protected function rollWeapon($value)
	{
		$array = null;
		$index = null;

		#try
		#{
			$array = $this->getNearest(static::$weapons, $value);
			$index = mt_rand(0, count($array) - 1);
			return $array[$index];
		#}
		#catch(\ErrorException $e)
		#{
		#	ddd($e, $array, $index);
		#}
	}

	protected function rollArmor($value)
	{
		$array = null;
		$index = null;

		#try
		#{
			$array = $this->getNearest(static::$armors, $value);
			$index = mt_rand(0, count($array) - 1);
			return $array[$index];
		#}
		#catch(\ErrorException $e)
		#{
		#	ddd($e, $array, $index);
		#}
	}

	protected function rollName()
	{
		$names = trans('name.data');
		$random = mt_rand(0, count($names) - 1);
		return $names[$random];
	}

	protected function rollAvatar()
	{
		$avatars = Config::get('player.avatars');
		$random = mt_rand(0, count($avatars) - 1);
		return asset('images/avatars/' . $avatars[$random]);
	}



	public function generate($level)
	{
		$opponent = new Opponent;
		$opponent->name = $this->rollName();
		$opponent->avatar = $this->rollAvatar();
		$opponent->level = $level;
		$opponent->health = $opponent->maxHealth = 100;
		$opponent->strength = 0;
		$opponent->perception = 0;
		$opponent->endurance = 0;
		$opponent->charisma = 0;
		$opponent->intelligence = 0;
		$opponent->agility = 0;
		$opponent->luck = mt_rand(Config::get('player.luck.min'), Config::get('player.luck.max'));
		$opponent->weaponId = $this->rollWeapon($level);
		$opponent->armorId = $this->rollArmor($level);


		$statistics = Config::get('player.start.stats') + Config::get('player.levelup.statisticsPoints') * $level - 5;


		for($i = 0; $i < $statistics; ++$i)
		{
			switch(mt_rand(0, 5))
			{
				case 0:
					$opponent->strength++;
					break;
				case 1:
					$opponent->perception++;
					break;
				case 2:
					$opponent->endurance++;
					break;
				case 3:
					$opponent->charisma++;
					break;
				case 4:
					$opponent->intelligence++;
					break;
				case 5:
					$opponent->agility++;
					break;
			}
		}

		return $opponent;
	}
}