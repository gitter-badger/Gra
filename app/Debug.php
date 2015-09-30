<?php

namespace HempEmpire;
use Config;



class Debug
{
	private static $enabled = false;



	private static function checkForDebug()
	{
		if(empty(self::$enabled))
		{
			self::$enabled = Config::get('app.debug', false);
		}
	}


	public static function check()
	{
		self::checkForDebug();
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

