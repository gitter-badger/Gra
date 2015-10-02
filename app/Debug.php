<?php

namespace HempEmpire;
use Config;



class Debug
{
	private static $enabled = true;



	public static function check()
	{
		return self::$enabled;
	}


	public static function set($enabled)
	{
		self::$enabled = $enabled;
	} 


	public static function log($string)
	{
		if(self::check())
		{
			echo $string . PHP_EOL;
		}
	}

}

