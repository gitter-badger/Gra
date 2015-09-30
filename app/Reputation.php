<?php
namespace HempEmpire;


class Reputation
{
	private static $reputations = [

		100000 => 'exalted',
		50000 => 'revered',
		10000 => 'honored',
		5000 => 'friendly',
		-5000 => 'neutral',
		-15000 => 'unfriendly',
		-30000 => 'hostile',
		-100000 => 'hated',
	];



	public static function fromRespect($respect)
	{
    	foreach(self::$reputations as $respect => $reputation)
    	{
    		if($this->respect >= $respect)
    			return $reputation;
    	}
    	end(self::$reputations);
    	return current(self::$reputations);
	}

	public static function getLevel($reputation)
	{
		$level = count(self::$reputations);

		foreach(self::$reputations as $current)
		{
			if($current === $reputation)
				return $level;

			$level--;
		}

		return $level;
	}

	public static function compare($test, $required)
	{
		return self::getLevel($test) >= self::getLevel($required);
	}

}


?>